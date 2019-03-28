import { minute, second } from "./../../assets/utils/date";
import pouchDB = require("pouchdb-browser");
const PouchDB: PouchDB.Static = (pouchDB as any).default;
import auth = require("pouchdb-authentication");
PouchDB.plugin((auth as any).default);

import { observable } from "mobx";
import { decrypt, encrypt } from "../../assets/utils/encryption";
import { staffData } from "../../modules/staff";
import { isOnline } from "../../assets/utils/is-online";
import { loadDemoData } from "../demo/load-demo-data";
import { Md5 } from "ts-md5";
import { registerModules } from "../../modules";
import { resync } from "../db";
import { files } from "../files/files";

const demoHosts: string[] = [
	// "localhost:8000",
	"demo.apexo.app",
	"192.168.0.101:8000",
	"192.168.0.102:8000"
];

export enum LoginStep {
	loadingData,
	allDone,
	chooseUser,
	initial
}

class Login {
	@observable server: string = "";
	@observable currentUserID: string = "";

	@observable keepOffline = false;

	@observable step: LoginStep = LoginStep.initial;

	@observable online: boolean = false;

	@observable dropboxActive: boolean = false;

	constructor() {
		setInterval(() => this.validateOnlineStatus(), second * 2);

		setTimeout(() => this.validateDropBoxToken(), second * 5);

		setInterval(() => this.validateDropBoxToken(), minute * 10); // every minute
	}

	async initialCheck(server: string) {
		this.server = server;

		let saved = false;
		let savedUser = "";
		let savedPassword = "";
		let savedServer = "";
		const encrypted = localStorage.getItem("ec") || "";
		const decrypted = decrypt(encrypted);
		try {
			const savedCredentials: {
				server: string;
				username: string;
				password: string;
			} = JSON.parse(decrypted);
			savedUser = savedCredentials.username;
			savedPassword = savedCredentials.password;
			savedServer = savedCredentials.server;
			saved = true;
		} catch (e) {}

		if (saved && navigator.onLine) {
			await this.login({
				server: savedServer,
				user: savedUser,
				pass: savedPassword
			});
		} else if (saved) {
			await this.authenticate({
				server: savedServer,
				password: savedPassword,
				username: savedUser
			});
		} else if (localStorage.getItem("no-server-mode") === "true") {
			await this.noServerMode();
		} else if (navigator.onLine && (await isOnline(server))) {
			this.online = true;
			const username = (await new PouchDB(server).getSession()).userCtx
				.name;
			if (username) {
				await this.authenticate({ server, username });
			}
		} else if (demoHosts.indexOf(location.host) !== -1) {
			this.online = false;
			this.keepOffline = true;
			await this.authenticate({
				server: "https://fake_server.apexo.app",
				username: ""
			});
		}
	}

	async noServerMode() {
		this.online = false;
		this.keepOffline = true;
		await this.authenticate({
			server: "http://apexo-no-server-mode",
			username: ""
		});
		localStorage.setItem("no-server-mode", "true");
	}

	async login({
		user,
		pass,
		server
	}: {
		user: string;
		pass: string;
		server: string;
	}) {
		// login
		try {
			if (await isOnline(server)) {
				const res = await new PouchDB(server).logIn(user, pass);
			} else {
				const LSL_hash = localStorage.getItem("LSL_hash") || "";
				if (LSL_hash !== Md5.hashStr(server + user + pass).toString()) {
					throw new Error("...");
				}
			}
			this.authenticate({ server, username: user, password: pass });
		} catch (e) {
			if (navigator.onLine) {
				console.log(e);
				return (
					e.reason ||
					'An error occured, please make sure that the server is online and it\'s accessible. Click "change" to change into another server'
				);
			} else {
				return "This was not the last username/password combination you used!";
			}
		}
	}

	async authenticate({
		server,
		username,
		password
	}: {
		server: string;
		username: string;
		password?: string;
	}) {
		this.server = server;
		localStorage.setItem("server_location", server);
		if (password) {
			localStorage.setItem(
				"LSL_hash",
				Md5.hashStr(server + username + password).toString()
			);
			localStorage.setItem(
				"ec",
				encrypt(JSON.stringify({ username, password, server }))
			);
		}
		this.step = LoginStep.loadingData;
		try {
			await registerModules();
		} catch (e) {}

		if (demoHosts.indexOf(location.host) !== -1) {
			await loadDemoData();
		}

		if (!this.checkUserID()) {
			this.step = LoginStep.chooseUser;
		}
	}
	async logout() {
		if (navigator.onLine && !this.keepOffline) {
			try {
				await new PouchDB(this.server).logOut();
			} catch (e) {}
		}
		localStorage.removeItem("LSL_hash");
		localStorage.removeItem("ec");
		localStorage.removeItem("no-server-mode");
		localStorage.removeItem("user_id");
		localStorage.removeItem("server_location");
		location.reload();
	}

	checkUserID() {
		const userID = localStorage.getItem("user_id");
		if (userID && staffData.staffMembers.getIndexByID(userID) !== -1) {
			this.setUser(userID);
			return true;
		} else {
			return false;
		}
	}
	resetUser() {
		this.step = LoginStep.chooseUser;
		this.currentUserID = "";
		localStorage.removeItem("user_id");
	}
	setUser(id: string) {
		this.currentUserID = id;
		this.step = LoginStep.allDone;
		localStorage.setItem("user_id", id);
	}

	validateDropBoxToken() {
		files
			.status()
			.then(x => {
				this.dropboxActive = true;
			})
			.catch(e => {
				this.dropboxActive = false;
			});
	}

	validateOnlineStatus() {
		if (this.keepOffline) {
			return;
		}
		isOnline(this.server).then(online => {
			if (online && !this.online) {
				console.log("getting back online");
				resync.resync();
			}
			this.online = online;
		});
	}
}

export const login = new Login();
