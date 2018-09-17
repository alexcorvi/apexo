import auth from 'pouchdb-authentication';
import PouchDB from 'pouchdb-browser';
import { computed, observable, observe } from 'mobx';
import { decrypt, encrypt } from '../../assets/utils/encryption';
import { doctorsData } from '../../modules/doctors';
import { isOnline } from '../../assets/utils/is-online';
import { loadDemoData } from '../demo/load-demo-data';
import { Md5 } from 'ts-md5';
import { observer } from 'mobx-react';
import { registerModules } from '../../modules';
import { resync } from '../db';

PouchDB.plugin(auth);

const demoHosts = [ 'localhost:8000', 'demo.apexo.app', '192.168.0.101:8000', '192.168.0.102:8000' ];

export enum LoginStep {
	loadingData,
	allDone,
	chooseDoctor,
	initial
}

class Login {
	@observable server: string = '';
	@observable currentDoctorID: string = '';

	@observable keepOffline = false;

	@observable step: LoginStep = LoginStep.initial;

	@observable online: boolean = false;

	constructor() {
		setInterval(() => {
			if (this.keepOffline) {
				return;
			}
			isOnline(this.server).then((online) => {
				if (online && !this.online) {
					console.log('getting back online');
					resync.resync();
				}
				this.online = online;
			});
		}, 2000);
	}

	async initialCheck(server: string) {
		this.server = server;

		let saved = false;
		let savedUser = '';
		let savedPassword = '';
		let savedServer = '';
		const encrypted = localStorage.getItem('ec') || '';
		const decrypted = decrypt(encrypted);
		try {
			const savedCredentials: { server: string; username: string; password: string } = JSON.parse(decrypted);
			savedUser = savedCredentials.username;
			savedPassword = savedCredentials.password;
			savedServer = savedCredentials.server;
			saved = true;
		} catch (e) {}

		if (saved && navigator.onLine) {
			this.login({ server: savedServer, user: savedUser, pass: savedPassword });
		} else if (saved) {
			this.authenticate({ server: savedServer, password: savedPassword, username: savedUser });
		} else if (localStorage.getItem('no-server-mode') === 'true') {
			this.noServerMode();
		} else if (navigator.onLine && (await isOnline(server))) {
			this.online = true;
			const username = (await new PouchDB(server).getSession()).userCtx.name;
			if (username) {
				await this.authenticate({ server, username });
			}
		} else if (demoHosts.indexOf(location.host) !== -1) {
			this.online = false;
			this.keepOffline = true;
			await this.authenticate({
				server: 'https://fake_server.apexo.app',
				username: ''
			});
		}
	}

	async noServerMode() {
		this.online = false;
		this.keepOffline = true;
		await this.authenticate({
			server: 'http://apexo-no-server-mode',
			username: ''
		});
		localStorage.setItem('no-server-mode', 'true');
	}

	async login({ user, pass, server }: { user: string; pass: string; server: string }) {
		// login
		try {
			if (await isOnline(server)) {
				const res = await new PouchDB(server).logIn(user, pass);
			} else {
				const LSL_hash = localStorage.getItem('LSL_hash') || '';
				if (LSL_hash !== Md5.hashStr(server + user + pass).toString()) {
					throw new Error('...');
				}
			}
			this.authenticate({ server, username: user, password: pass });
		} catch (e) {
			if (navigator.onLine) {
				return (
					e.reason ||
					'An error occured, please make sure that the server is online and it\'s accessible. Click "change" to change into another server'
				);
			} else {
				return 'This was not the last username/password combination you used!';
			}
		}
	}

	async authenticate({ server, username, password }: { server: string; username: string; password?: string }) {
		this.server = server;
		localStorage.setItem('server_location', server);
		if (password) {
			localStorage.setItem('LSL_hash', Md5.hashStr(server + username + password).toString());
			localStorage.setItem('ec', encrypt(JSON.stringify({ username, password, server })));
		}
		this.step = LoginStep.loadingData;
		try {
			await registerModules();
		} catch (e) {}

		if (demoHosts.indexOf(location.host) !== -1) {
			await loadDemoData();
		}

		if (!this.checkDoctorID()) {
			this.step = LoginStep.chooseDoctor;
		}
	}
	async logout() {
		if (navigator.onLine && !this.keepOffline) {
			try {
				await new PouchDB(this.server).logOut();
			} catch (e) {}
		}
		localStorage.removeItem('LSI');
		localStorage.removeItem('doctor_id');
		localStorage.removeItem('no-server-mode');
		location.reload();
	}

	checkDoctorID() {
		const doctorID = localStorage.getItem('doctor_id');
		if (doctorID && doctorsData.doctors.getIndexByID(doctorID) !== -1) {
			this.setDoctor(doctorID);
			return true;
		} else {
			return false;
		}
	}
	resetDoctor() {
		this.step = LoginStep.chooseDoctor;
		this.currentDoctorID = '';
	}
	setDoctor(id: string) {
		this.currentDoctorID = id;
		this.step = LoginStep.allDone;
		localStorage.setItem('doctor_id', id);
	}
}

export const login = new Login();
