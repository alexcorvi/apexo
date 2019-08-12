import { dbAction, files } from "@core";
import { registerModules, staff } from "@modules";
import * as modules from "@modules";
import {
	checkClient,
	checkServer,
	day,
	num,
	second,
	store
	} from "@utils";
import { computed, observable } from "mobx";
import { Md5 } from "ts-md5";

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

export enum LoginType {
	initialActiveSession = "initial-active-session",
	initialLSLHashTS = "initial-lsl-hash-ts",
	loginCredentialsOnline = "login-credentials-online",
	loginCredentialsOffline = "login-credentials-offline",
	noServer = "no-server"
}

export class Status {
	private currentlyValidating: string | null = null;
	@observable dbActionProgress = false;
	@observable loadingIndicatorText = "";
	@observable server: string = "";
	@observable currentUserID: string = "";

	@observable keepOffline = false;

	@observable step: LoginStep = LoginStep.initial;

	@observable isOnline = {
		dropbox: false,
		server: false,
		client: false
	};

	@observable tryOffline: boolean = false;

	@observable loginType: LoginType | "" = "";

	constructor() {
		this.validateOnlineStatus().then(() => {
			setInterval(() => this.validateOnlineStatus(), second * 2);
		});
	}

	async initialCheck(server: string) {
		// If we're on a demo host
		if (demoHosts.indexOf(location.host) !== -1) {
			console.log("Login: Demo mode");
			return await this.startDemoServer();
		}

		// if we're running on no server mode
		if (store.found("no_server_mode")) {
			console.log("Login: No server mode");
			return await this.startNoServer();
		}

		this.server = server;
		await this.validateOnlineStatus();

		if (this.isOnline.server) {
			if (await this.activeSession(this.server)) {
				this.loginType = LoginType.initialActiveSession;
				await this.start({ server });
				store.set("LSL_TS", new Date().getTime().toString());
				return;
			}
		}

		if (store.found("LSL_hash")) {
			const now = new Date().getTime();
			const then = new Date(num(store.get("LSL_TS"))).getTime();
			if (now - then < 7 * day) {
				this.loginType = LoginType.initialLSLHashTS;
				this.start({ server });
			}
		}
	}

	async loginWithCredentials({
		username,
		password,
		server
	}: {
		username: string;
		password: string;
		server: string;
	}) {
		this.server = server;
		await this.validateOnlineStatus();
		if (!this.isOnline.server && store.found("LSL_hash")) {
			return this.loginWithCredentialsOffline({
				username,
				password,
				server
			});
		}

		if (this.isOnline.server) {
			return this.loginWithCredentialsOnline({
				username,
				password,
				server
			});
		} else {
			if (store.found("LSL_hash")) {
				this.tryOffline = true;
			}
			return `
				An error occurred, please make sure that the server is online and it\'s accessible.
				Click "change" to change into another server
			`;
		}
	}

	async loginWithCredentialsOnline({
		username,
		password,
		server,
		noStart
	}: {
		username: string;
		password: string;
		server: string;
		noStart?: boolean;
	}) {
		const PouchDB: PouchDB.Static =
			((await import("pouchdb-browser")) as any).default ||
			((await import("pouchdb-browser")) as any);
		const auth: PouchDB.Plugin =
			((await import("pouchdb-authentication")) as any).default ||
			((await import("pouchdb-authentication")) as any);
		PouchDB.plugin(auth);
		try {
			await new PouchDB(server, { skip_setup: true }).logIn(
				username,
				password
			);
			if (noStart) {
				return true;
			}
			store.set(
				"LSL_hash",
				Md5.hashStr(server + username + password).toString()
			);
			store.set("LSL_TS", new Date().getTime().toString());
			this.loginType = LoginType.loginCredentialsOnline;
			this.start({ server });
			return true;
		} catch (e) {
			console.error(e);
			return (e.reason as string) || "Could not login";
		}
	}

	async loginWithCredentialsOffline({
		username,
		password,
		server,
		noStart
	}: {
		username: string;
		password: string;
		server: string;
		noStart?: boolean;
	}) {
		const LSL_hash = store.get("LSL_hash");
		if (LSL_hash === Md5.hashStr(server + username + password).toString()) {
			if (noStart) {
				return true;
			} else {
				this.loginType = LoginType.loginCredentialsOffline;
				this.start({ server });
				return true;
			}
		} else {
			return "This was not the last username/password combination you used!";
		}
	}

	async startDemoServer() {
		await this.startNoServer();
		(await import("core/demo")).loadDemoData();
	}

	async startNoServer() {
		this.isOnline = {
			server: false,
			client: false,
			dropbox: false
		};
		this.keepOffline = true;
		this.loginType = LoginType.noServer;
		await this.start({
			server: "http://apexo-no-server-mode"
		});
		store.set("no_server_mode", "true");
	}

	async start({ server }: { server: string }) {
		console.log("Login Type:", this.loginType);
		this.server = server;
		store.set("server_location", server);
		this.step = LoginStep.loadingData;
		try {
			this.loadingIndicatorText = "Registering modules";
			await registerModules();
			this.loadingIndicatorText = "Checking and setting user";
			if (!this.checkAndSetUserID()) {
				this.step = LoginStep.chooseUser;
			}
		} catch (e) {
			console.log("Registering modules failed", e);
		}
	}

	async removeCookies() {
		const PouchDB: PouchDB.Static =
			((await import("pouchdb-browser")) as any).default ||
			((await import("pouchdb-browser")) as any);
		const auth: PouchDB.Plugin =
			((await import("pouchdb-authentication")) as any).default ||
			((await import("pouchdb-authentication")) as any);
		return await new PouchDB(this.server, { skip_setup: true }).logOut();
	}

	async logout() {
		if (this.isOnline.server && !this.keepOffline) {
			try {
				this.removeCookies();
				await dbAction("logout");
			} catch (e) {
				console.log("Failed to logout", e);
			}
		}
		store.clear();
		location.reload();
	}

	checkAndSetUserID() {
		const userID = store.get("user_id");
		if (userID && staff!.docs.find(x => x._id === userID)) {
			this.setUser(userID);
			return true;
		} else {
			return false;
		}
	}
	resetUser() {
		this.step = LoginStep.chooseUser;
		this.currentUserID = "";
		store.remove("user_id");
	}
	setUser(id: string) {
		this.currentUserID = id;
		this.step = LoginStep.allDone;
		store.set("user_id", id);
	}

	async activeSession(server: string) {
		const PouchDB: PouchDB.Static = ((await import(
			"pouchdb-browser"
		)) as any).default;
		const auth: PouchDB.Plugin = ((await import(
			"pouchdb-authentication"
		)) as any).default;
		PouchDB.plugin(auth);
		try {
			if (this.isOnline.server && !this.keepOffline) {
				return !!(await new PouchDB(server, {
					skip_setup: true
				}).getSession()).userCtx.name;
			}
		} catch (e) {}
		return false;
	}

	async validateOnlineStatus() {
		if (this.currentlyValidating === this.server) {
			return;
		} else {
			this.currentlyValidating = this.server;
		}

		if (this.keepOffline) {
			this.isOnline.client = false;
			this.isOnline.server = false;
			this.isOnline.dropbox = false;
			this.currentlyValidating = null;
			return;
		}

		this.isOnline.server = await checkServer(this.server);
		this.isOnline.client = await checkClient();
		if (modules.setting) {
			this.isOnline.dropbox = await files.status();
		}
		this.currentlyValidating = null;
	}
	reset() {
		this.server = "";
		this.currentUserID = "";
		this.keepOffline = false;
		this.step = LoginStep.initial;
		this.isOnline = {
			server: false,
			client: false,
			dropbox: false
		};
		this.tryOffline = false;
		this.loginType = "";
	}
}

export const status = new Status();
