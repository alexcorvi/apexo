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

export const methods: {
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

export async function dbAction(
	action: keyof typeof methods,
	dbName?: string,
	initial?: boolean
) {
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
			await Promise.all(
				methods[action].map(async (func, index) => {
					try {
						await func();
					} catch (e) {
						utils.log(
							"PERFORMING MULTIPLE DBs ACTION",
							action,
							DBNames[index],
							e
						);
					}
					if (initial) {
						status.finishedTasks++;
					}
					return;
				})
			);
		}
	} catch (e) {
		utils.log("PERFORMING SINGLE DB ACTION", action, dbName, e);
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

export function preUniqueString() {
	const LSL_time = store.get("LSL_time");
	const payload = JSON.parse(atob(LSL_time.split(".")[1]));
	const secret = payload.data.user.secret;
	return secret;
}

export function uniqueString() {
	let unique = Md5.hashStr(store.get("LSL_hash")).toString();
	if (status.version === "supported") {
		unique = Md5.hashStr(preUniqueString()).toString();
	}
	return unique;
}

export async function genLocalInstance<S = any>(
	dbName: string
): Promise<PouchDB.Database<S>> {
	const PouchDB = await importPouchDB();
	const localName = dbName + "_" + Md5.hashStr(status.server + username());
	return localTransformation(
		new PouchDB<S>(localName, { auto_compaction: true }),
		dbName
	);
}

export async function genRemoteInstance<S = any>(dbName: string) {
	const PouchDB = await importPouchDB();
	const remoteName =
		status.version === "supported" ? `c_${username()}_${dbName}` : dbName;
	return remoteTransformations(
		new PouchDB<S>(
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
		),
		dbName
	);
}

const transVars: { unique: string; usableDefaults: any } = {
	unique: "",
	usableDefaults: {},
};

export function remoteTransformations<S>(
	db: PouchDB.Database<S>,
	name: string
): PouchDB.Database<S> {
	documentTransformation(
		db,
		transVars.unique,
		transVars.usableDefaults[name] || {},
		true,
		status.version === "supported",
		status.version === "supported"
		/**
		 * You might be tempted to try encrypting
		 * the community version.
		 * But the problem is 'unique' is not
		 * static on the community version,
		 * so an encryption with the wrong value,
		 * might lead to a permanent data loss
		 */
	);
	return db;
}

export function localTransformation<S>(
	db: PouchDB.Database<S>,
	name: string
): PouchDB.Database<S> {
	documentTransformation(
		db,
		transVars.unique,
		transVars.usableDefaults[name] || {}
	);
	return db;
}

export async function connect<S>(dbName: string, defaults: any) {
	const usableDefaults = new defaults(null).toJSON();
	const unique = uniqueString();
	transVars.unique = unique;
	transVars.usableDefaults[dbName] = usableDefaults;

	const localDatabase = await genLocalInstance<S>(dbName);
	const remoteDatabase = await genRemoteInstance<S>(dbName);

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
