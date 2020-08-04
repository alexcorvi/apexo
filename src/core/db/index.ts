import { documentTransformation } from "./transform";
import { status } from "@core";
import { store, username } from "@utils";
import * as utils from "@utils";
import { Md5 } from "ts-md5";

type methodsArr = Array<() => Promise<void>>;

export const DBNames: string[] = [];
export const defaultsArr: any[] = [];
export const remoteDBRefs: PouchDB.Database[] = [];
export const localDBRefs: PouchDB.Database[] = [];

const methods: {
	resync: methodsArr;
	compact: methodsArr;
	destroy: methodsArr;
	logout: methodsArr;
} = {
	resync: [],
	compact: [],
	destroy: [],
	logout: [],
};

export async function dbAction(action: keyof typeof methods, dbName?: string) {
	const progressID = Math.random().toString();
	status.dbActionProgress.push(progressID);
	try {
		if (dbName) {
			// apply on specific DB
			const dbIndex = DBNames.indexOf(dbName);
			const singleAction = methods[action][dbIndex];
			if (singleAction) {
				await singleAction();
			}
		} else {
			await Promise.all(methods[action].map((x) => x()));
		}
	} catch (e) {
		utils.log(e);
		utils.log(JSON.stringify(e));
	}
	status.dbActionProgress.splice(
		status.dbActionProgress.indexOf(progressID),
		1
	);
}

export async function importPouchDB() {
	const pouchdb: PouchDB.Static =
		((await import("pouchdb-browser")) as any).default ||
		((await import("pouchdb-browser")) as any);
	const transformPouch =
		((await import("transform-pouch")) as any).default ||
		((await import("transform-pouch")) as any);
	const auth: PouchDB.Plugin =
		((await import("pouchdb-authentication")) as any).default ||
		((await import("pouchdb-authentication")) as any);
	pouchdb.plugin(auth);
	pouchdb.plugin(transformPouch);
	return pouchdb;
}

export function uniqueString() {
	let unique = Md5.hashStr(store.get("LSL_hash")).toString();
	if (status.version === "supported") {
		const LSL_time = store.get("LSL_time");
		const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user.id;
		unique = Md5.hashStr(userID.toString()).toString();
	}
	return unique;
}

export async function connect<S>(dbName: string, defaults: any) {
	const usableDefaults = new defaults(null).toJSON();

	const PouchDB = await importPouchDB();
	const unique = uniqueString();
	const localName = dbName + "_" + Md5.hashStr(status.server + username());
	const remoteName =
		status.version === "supported" ? `c_${username()}_${dbName}` : dbName;
	const localDatabase = new PouchDB<S>(localName, { auto_compaction: true });
	documentTransformation(localDatabase, unique, usableDefaults);

	const remoteDatabase = new PouchDB(
		`${
			status.version === "supported"
				? "https://sdb.apexo.app"
				: status.server
		}/${remoteName}`,
		{
			fetch: (url, opts) => {
				return PouchDB.fetch(url, {
					...opts,
					credentials:
						status.version === "community" ? "include" : "omit",
					headers: {
						Authorization: `Bearer ${store.get("LSL_time")}`,
						"Content-Type": "application/json",
					},
				});
			},
		}
	);
	if (status.version === "supported") {
		documentTransformation(remoteDatabase, unique, usableDefaults);
		/**
		 * You might be tempted to try this on
		 * the community version.
		 * But the problem is 'unique' is not
		 * static on the community version,
		 * so an encryption with the wrong value,
		 * might lead to a permanent data loss
		 */
	}

	// preventing duplicates
	const oldIndex = DBNames.indexOf(dbName);
	if (oldIndex !== -1) {
		DBNames.splice(oldIndex, 1);
		methods.resync.splice(oldIndex, 1);
		methods.destroy.splice(oldIndex, 1);
		methods.compact.splice(oldIndex, 1);
		methods.logout.splice(oldIndex, 1);
	}

	DBNames.push(dbName);
	const refI = DBNames.indexOf(dbName);
	defaultsArr[refI] = usableDefaults;
	localDBRefs[refI] = localDatabase;
	remoteDBRefs[refI] = remoteDatabase;
	methods.resync[refI] = async () => {
		if (remoteDatabase) {
			await localDatabase.sync(remoteDatabase, {
				batch_size: 50,
			});
		}
	};
	methods.destroy[refI] = async () => {
		await localDatabase.destroy();
	};
	methods.logout[refI] = async () => {
		if (remoteDatabase) {
			await remoteDatabase.logOut();
		}
	};
	methods.compact[refI] = async () => {
		await localDatabase.compact();
		if (remoteDatabase) {
			await remoteDatabase.compact();
		}
	};
	return { localDatabase, remoteDatabase };
}

export { documentTransformation };
export { DTF } from "./transform";
