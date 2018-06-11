import { computed, observable, observe } from 'mobx';
import axios from 'axios';
import { observer } from 'mobx-react';
import { registerModules } from '../../modules';
import { constants } from '../constants';
import { reSync } from '../db/index';

export enum LoginStep {
	allDone,
	chooseDoctor,
	initialCheck,
	login
}

class Login {
	@observable currentDoctorID: string = '';
	@observable loggedIn: boolean = false;
	@observable clinicID: string = '';
	@observable clinicPassword: string = '';
	@observable clinicServer: string = '';
	@observable initialCheckDone: boolean = false;
	@observable onLogin: (() => any)[] = [ () => registerModules(), () => reSync() ];

	@computed
	get step() {
		if (!this.initialCheckDone) {
			return LoginStep.initialCheck;
		} else if (!this.loggedIn) {
			return LoginStep.login;
		} else if (this.loggedIn && !this.currentDoctorID) {
			return LoginStep.chooseDoctor;
		} else {
			return LoginStep.allDone;
		}
	}

	constructor() {
		observe(this, () => {
			if (this.clinicID && this.clinicServer && this.loggedIn) {
				this.onLogin.forEach((hook) => hook());
			}
		});
		setTimeout(() => {
			this.initial();
		}, 300);

		setInterval(() => {
			if (navigator.onLine) {
				const LSQ = localStorage.getItem('__q') || '[]';
				try {
					const q = JSON.parse(LSQ);
					if (!Array.isArray(q)) {
						return;
					}
					q.forEach((r: { namespace: string; subPath: string; method: string; data?: any }) => {
						this.request(r);
					});
				} catch (e) {}
			}
		}, 5000);
	}

	getLocalStorage() {
		try {
			const session = localStorage.getItem('__m');
			if (session) {
				const auth = decrypt(session).split('{{{_}}}');
				return {
					u: auth[0],
					p: auth[1],
					s: auth[2]
				};
			}
			return;
		} catch (e) {
			return;
		}
	}

	setLocalStorage({ u, p }: { u: string; p: string }) {
		if (u.length && p.length) {
			localStorage.setItem('__m', encrypt(u + '{{{_}}}' + p));
		} else {
			localStorage.removeItem('__m');
			localStorage.removeItem('__s');
		}
	}

	async login({ u, p }: { u: string; p: string }) {
		try {
			const res = await axios.get<{ ip: string }>(constants.central_server + 'clinics/server', {
				auth: {
					password: p,
					username: u
				}
			});
			this.loggedIn = true;
			this.clinicID = u;
			this.clinicPassword = p;
			this.clinicServer = res.data.ip;
			localStorage.setItem('__s', this.clinicServer);
			this.setLocalStorage({ u, p });
			return true;
		} catch (e) {
			const server = localStorage.getItem('__s');
			if (server && u.length) {
				this.loggedIn = true;
				this.clinicID = u;
				this.clinicPassword = p;
				this.clinicServer = server;
			}
		}
	}

	async request<IData = {}>({
		namespace,
		subPath,
		method,
		data
	}: {
		namespace: string;
		subPath: string;
		method: string;
		data?: any;
	}) {
		if (navigator.onLine) {
			method = method.toLowerCase();
			const url = constants.central_server + namespace + '/' + subPath;
			const auth = { password: this.clinicPassword, username: this.clinicID };
			if (method === 'post') {
				return (await axios.post<IData>(url, data, { auth })).data;
			} else if (method === 'put') {
				return (await axios.put<IData>(url, data, { auth })).data;
			} else {
				return (await axios.get<IData>(url, { auth, data })).data;
			}
		} else {
			const LSQ = localStorage.getItem('__q') || '[]';
			const q = JSON.parse(LSQ);
			q.push({
				namespace,
				subPath,
				method,
				data
			});
			localStorage.setItem('__q', JSON.stringify(q));
		}
	}

	async initial() {
		const saved = this.getLocalStorage();
		if (saved) {
			await this.login(saved);
		}
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
		await reSync();
		this.initialCheckDone = true;
	}
}

function mist(string: string) {
	return string.split('').map((x, i) => String.fromCharCode(string.charCodeAt(i) * 3)).join('');
}

function deMist(string: string) {
	return string.split('').map((x, i) => String.fromCharCode(string.charCodeAt(i) / 3)).join('');
}

function stringToNum(string: string) {
	return string.split('').map((x, i) => string.charCodeAt(i)).join('+');
}

function numToString(string: string) {
	return string.split('+').map((x) => String.fromCharCode(Number(x))).join('');
}

function encrypt(input: string) {
	input = stringToNum(input);
	const i = Math.round(input.length / 3);
	let chunkA = stringToNum(mist(input.substr(0, i)));
	let chunkB = stringToNum(mist(input.substr(i)));
	const a_n = Math.floor(Math.random() * 8 + 1);
	const b_n = Math.floor(Math.random() * 8 + 1);
	let a_nn = a_n;
	let b_nn = b_n;
	while (a_nn) {
		chunkA = btoa(chunkA);
		a_nn--;
	}
	while (b_nn) {
		chunkB = btoa(chunkB);
		b_nn--;
	}

	const b64 = btoa(
		JSON.stringify({
			w: chunkA,
			x: chunkB,
			y: a_n,
			z: b_n
		})
	);

	return b64
		.split('')
		.map((x, u) => b64.charCodeAt(u))
		.map((x) => x * 120 + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2))
		.join('i')
		.toUpperCase();
}

function decrypt(input: string) {
	const m = input.split(/[^0-9]+/).map((x) => String.fromCharCode(Number(x) / 120));
	m.splice(m.length - 1);
	const n: { w: string; x: string; y: number; z: number } = JSON.parse(atob(m.join('')));
	while (n.y) {
		n.w = atob(n.w);
		n.y--;
	}
	while (n.z) {
		n.x = atob(n.x);
		n.z--;
	}
	let r = deMist(numToString(n.w)) + deMist(numToString(n.x));
	r = numToString(r);
	return r;
}

export const login = new Login();
