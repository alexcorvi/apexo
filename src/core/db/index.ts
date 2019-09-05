import { status } from "@core";
import { store } from "@utils";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { Md5 } from "ts-md5";

type methodsArr = Array<() => Promise<void>>;

export const DBNames: string[] = [];

const methods: {
	resync: methodsArr;
	compact: methodsArr;
	destroy: methodsArr;
	logout: methodsArr;
} = {
	resync: [],
	compact: [],
	destroy: [],
	logout: []
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
			await Promise.all(methods[action].map(x => x()));
		}
	} catch (e) {
		console.log(e);
		console.log(JSON.stringify(e));
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
	const cryptoPouch =
		((await import("crypto-pouch")) as any).default ||
		((await import("crypto-pouch")) as any);
	const transformPouch =
		((await import("transform-pouch")) as any).default ||
		((await import("transform-pouch")) as any);
	const auth: PouchDB.Plugin =
		((await import("pouchdb-authentication")) as any).default ||
		((await import("pouchdb-authentication")) as any);
	pouchdb.plugin(auth);
	pouchdb.plugin(cryptoPouch);
	pouchdb.plugin(transformPouch);
	return pouchdb;
}

function compressDB(db: PouchDB.Database) {
	db.transform<
		PouchDB.Meta,
		PouchDB.Meta & {
			_lz: string | undefined;
		}
	>({
		incoming(document) {
			const compressed = {
				_id: document._id,
				_rev: document._rev,
				_revisions: document._revisions,
				_lz: ""
			};
			delete document._id;
			delete document._rev;
			delete document._revisions;
			compressed._lz = compressToUTF16(JSON.stringify(document));
			return compressed;
		},
		outgoing(result) {
			if (!result._lz) {
				return result;
			}
			const document = JSON.parse(decompressFromUTF16(result._lz));
			document._id = result._id;
			document._rev = result._rev;
			document._revisions = result._revisions;
			return document;
		}
	});
}

export function encryptDB(db: PouchDB.Database, secret: string) {
	db.crypto(secret);
}

export async function connect<S>(dbName: string) {
	const PouchDB = await importPouchDB();

	const unique = Md5.hashStr(store.get("LSL_hash")).toString();
	const localName = dbName + "_" + Md5.hashStr(status.server);
	const localDatabase = new PouchDB<S>(localName, { auto_compaction: true });
	compressDB(localDatabase);
	encryptDB(localDatabase, unique);

	const remoteDatabase = new PouchDB(`${status.server}/${dbName}`, {
		fetch: (url, opts) =>
			PouchDB.fetch(url, {
				...opts,
				credentials: "include"
			})
	});

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
	methods.resync.push(async () => {
		if (remoteDatabase) {
			await localDatabase.sync(remoteDatabase);
		}
	});
	methods.destroy.push(async () => {
		await localDatabase.destroy();
	});
	methods.logout.push(async () => {
		if (remoteDatabase) {
			await remoteDatabase.logOut();
		}
	});
	methods.compact.push(async () => {
		await localDatabase.compact();
		if (remoteDatabase) {
			await remoteDatabase.compact();
		}
	});
	return { localDatabase, remoteDatabase };
}
