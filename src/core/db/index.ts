import { Lambda, isObservableArray, observe } from 'mobx';

import { API } from '../';
import { IDocumentJSON } from './interface.document-json';
import { InteractionMethods } from './interface.interaction-methods';
import PouchDB from 'pouchdb-browser';
import { configs } from './config';
import { databases } from './databases';
import { defaultDesign } from './default.design';
import { defineDesign } from './define-design';
import { diff } from 'fast-array-diff';
import { generateMethods } from './generate-methods';
import { keepInSync } from './sync';
import { log } from './log';
import { watchForChanges } from './changes';

export const reSyncFunctions: { [key: string]: () => Promise<void> } = {};
export async function reSync() {
	Object.keys(reSyncFunctions).forEach(async (key) => {
		await reSyncFunctions[key]();
	});
}

// every 2 minutes, there will be an update
setInterval(() => reSync(), 120000);

/**
 * Database main connection method
 * 
 * @export
 * @template DocumentJSON 
 * @param {string} name 
 * @param {boolean} [shouldLog] 
 * @param {PouchDB.AdapterWebSql.Configuration} [config] 
 * @returns {(Class: ClassCreator, data: Data) => InteractionMethods<ClassStatic>}
 */
export function connectToDB<DocumentJSON extends IDocumentJSON>(
	name: string,
	shouldLog: boolean = false,
	config?: PouchDB.AdapterWebSql.Configuration
) {
	/**
	 * Connection object
	 */
	const localDatabase = new PouchDB(name);
	const remoteDatabase = new PouchDB(`${API.login.clinicServer}/${name}`, {
		auth: { username: API.constants.db.username, password: API.constants.db.password }
	});

	configs[name] = {
		shouldLog: shouldLog
	};

	// destroy
	// database.destroy();

	/**
	 * Class creator, that is callable with "new"
	 * 
	 * @interface ClassCreator
	 */
	interface ClassCreator {
		new (json?: DocumentJSON): ClassStatic;
	}

	/**
	 * The result of calling a class creator with the "new"
	 * 
	 * @interface ClassStatic
	 * @extends {IDocumentJSON}
	 */
	interface ClassStatic extends IDocumentJSON {
		toJSON: () => PouchDB.Core.PutDocument<DocumentJSON>;
		fromJSON: (json: DocumentJSON) => void;
	}

	/**
	 * MobX data store object
	 * 
	 * @interface Data
	 */
	interface MobXStore {
		list: ClassStatic[];
		ignoreObserver: boolean;
	}

	return async function(Class: ClassCreator, data: MobXStore) {
		log(name, 'Opening database');

		const methods = generateMethods<any, DocumentJSON>(name, localDatabase, data, Class as any);

		databases[name] = (<ClassStatic>() => methods) as any;

		// define a document design for the local database
		await defineDesign(localDatabase, defaultDesign, false);
		if (navigator.onLine) {
			// define a document design for the remote database
			await defineDesign(remoteDatabase, defaultDesign, false);
		}

		// sync from database
		await methods.syncFromDatabase();
		// watch for any changes
		await watchForChanges(name, localDatabase, data as any, Class as any, methods);
		// keep the remote and the local on sync
		reSyncFunctions[name] = async () => {
			if (navigator.onLine) {
				API.router.reSyncing = true;
				await keepInSync(name, localDatabase, remoteDatabase);
				API.router.reSyncing = false;
			}
		};

		return methods;
	};
}

export { databases };

(window as any).reSync = reSync;
