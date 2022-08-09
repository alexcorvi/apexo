import { dbAction, LoginType, status } from "@core";
import * as core from "@core";
import { store } from "@utils";
import * as utils from "@utils";
import { Md5 } from "ts-md5";
interface LoginService {
	login: (
		username: string,
		password: string,
		server: string
	) => Promise<true | string>;
	activeSession: (server: string) => Promise<true | false>;
	logout: () => Promise<true | string>;
}

async function offlineCheck({
	username,
	password,
	server,
	noStart,
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
			status.loginType = LoginType.loginCredentialsOffline;
			status.start({ server });
			return true;
		}
	} else {
		return "This was not the last username/password combination you used!";
	}
}

const communityLoginService = {
	login: async (username: string, password: string, server: string) => {
		status.server = server;
		await status.validateOnlineStatus();
		if (!status.isOnline.server && store.found("LSL_hash")) {
			return offlineCheck({
				username,
				password,
				server,
			});
		}

		if (status.isOnline.server) {
			return communityLoginService.loginWithCredentialsOnline({
				username,
				password,
				server,
			});
		} else {
			return `
				An error occurred, please make sure that the server is online and it\'s accessible.
				Click "change" to change into another server
			`;
		}
	},
	logout: async () => {
		if (status.isOnline.server && !status.keepServerOffline) {
			try {
				await status.removeCookies();
				await dbAction("logout");
			} catch (e) {
				utils.log("Failed to logout", e);
			}
		}
		store.clear();
		location.reload();
		return true;
	},
	activeSession: async (server: string) => {
		const PouchDB: PouchDB.Static = (
			(await import("pouchdb-browser")) as any
		).default;
		const auth: PouchDB.Plugin = (
			(await import("pouchdb-authentication")) as any
		).default;
		PouchDB.plugin(auth);
		try {
			if (status.isOnline.server && !status.keepServerOffline) {
				return !!(
					await new PouchDB(server, {
						skip_setup: true,
					}).getSession()
				).userCtx.name;
			}
		} catch (e) {}
		return false;
	},

	async loginWithCredentialsOnline({
		username,
		password,
		server,
		noStart,
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
			status.loginType = LoginType.loginCredentialsOnline;
			status.start({ server });
			return true;
		} catch (e) {
			console.error(e);
			return ((e as any).reason as string) || "Could not login";
		}
	},
};

const offlineLoginService: LoginService = {
	login: async () => {
		await core.status.startNoServer();
		return true;
	},
	logout: async () => {
		store.clear();
		location.reload();
		return true;
	},
	activeSession: async () => {
		return true;
	},
};

export function loginService() {
	switch (core.status.version) {
		case "community":
			return communityLoginService;
		case "offline":
			return offlineLoginService;
		default:
			return communityLoginService;
	}
}
