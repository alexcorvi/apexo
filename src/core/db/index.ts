import PouchDB from "pouchdb-browser";
import { API } from "../";
import { configs } from "./config";
import { generateMethods } from "./generate-methods";
import { IClassCreator } from "./interface.class-creator";
import { IMobXStore } from "./interface.mobx-store";
import { observe } from "mobx";
import { log } from "./log";
import { Md5 } from "ts-md5";
import { observeItem } from "./observe-item";
import { singleItemUpdateQue } from "./single-item-update-que";

export const DBs: PouchDB.Database[] = [];

export function replicateAllDBsToServer({
	serverURL,
	password,
	username
}: {
	serverURL: string;
	password: string;
	username: string;
}) {
	// DBs[0].name
}

export const resync: {
	resyncMethods: Array<() => Promise<void>>;
	resync: () => Promise<boolean>;
} = {
	resyncMethods: [],
	resync: async function() {
		return new Promise<boolean>(resolve => {
			let done = 0;
			this.resyncMethods.forEach(resyncMethod => {
				resyncMethod()
					.then(() => done++)
					.catch(() => done++);
			});
			const checkInterval = setInterval(() => {
				if (done === this.resyncMethods.length) {
					resolve(true);
					clearInterval(checkInterval);
				}
			}, 300);
		});
	}
};

export function connectToDB(
	name: string,
	shouldLog: boolean = false,
	config?: PouchDB.AdapterWebSql.Configuration
) {
	// prefixing local DB name
	const localName = name + "_" + Md5.hashStr(API.login.server);

	/**
	 * Connection object
	 */
	const localDatabase = new PouchDB(localName);
	const remoteDatabase = new PouchDB(`${API.login.server}/${name}`);

	configs[name] = {
		shouldLog: shouldLog
	};

	return async function(Class: IClassCreator, data: IMobXStore) {
		// start with the basics
		const methods = generateMethods(localDatabase, data, Class);

		/**
		 * First of all we have three places to store data
		 * 1. remote DB
		 * 2. local DB
		 * 3. MobX Store
		 * We need to pass the data like this:
		 * [Remote DB] ====> [Local DB] =====> [MobX Store]
		 * **/
		try {
			await localDatabase.sync(remoteDatabase);
		} catch (e) {
			try {
				await localDatabase.sync(remoteDatabase);
			} catch (e) {}
		}
		const response =
			(await localDatabase.allDocs({ include_docs: true })).rows.map(
				x => x.doc
			) || [];
		data.ignoreObserver = true;
		const newData = response.map(x => new Class(x));
		data.list = newData;

		/**
		 * Watching the data on the other hand should be in reverse
		 * [MobX Store] ====> [Local DB] ====> [Remote DB]
		 * However we need to watch the list as a whole
		 * and to watch document by document
		 * **/

		// Watch the list as a whole
		observe(data.list, change => {
			// only if we're not ignoring it (i.e. we're not syncing from database, thus preventing cycles)
			if (!data.ignoreObserver) {
				methods.syncListToDatabase(data.list);
			}
		});

		// Watch document by document
		data.list.forEach((item, index) => observeItem(item, data, methods));
		data.ignoreObserver = false;

		// watch the local database for changes
		localDatabase
			.changes({
				since: "now",
				live: true,
				include_docs: true,
				limit: 1
			})
			.on("change", function(change) {
				// put the local and the remote in sync
				localDatabase.sync(remoteDatabase);

				// and since they will be in sync
				// we might have changes in the local database coming from the remote one
				// so we need to handle those
				const newDoc: any = change.doc;
				const id = change.id;
				const mobxIndex = data.list.findIndex(x => x._id === id);

				const deletion = mobxIndex !== -1 && change.deleted;
				const update = mobxIndex !== -1 && !change.deleted;
				const addition = mobxIndex === -1 && !change.deleted;
				data.ignoreObserver = true;
				// if it's a deletion
				if (deletion) {
					data.list.splice(mobxIndex, 1);
				} else if (addition) {
					// if it's an addition
					data.list.push(new Class(newDoc));
				} else if (update) {
					// if it's an update
					// if there's another update that will carry on the same document
					// don't update the MobX store just now
					if (singleItemUpdateQue.find(x => x.id === id)) {
					} else {
						data.list[mobxIndex].fromJSON(newDoc);
						observeItem(data.list[mobxIndex], data, methods);
					}
				}
				data.ignoreObserver = false;
			})
			.on("error", err => log(name, "Error occurred", err));

		resync.resyncMethods.push(async () => {
			await localDatabase.sync(remoteDatabase);
		});

		return methods;
	};
}
