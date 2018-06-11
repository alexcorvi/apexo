import { API } from '../';
import { IClassCreator } from './interface.class-creator';
import { IClassStatic } from './interface.class-static';
import { IDocumentJSON } from './interface.document-json';
import { IMobXStore } from './interface.mobx-store';
import { InteractionMethods } from './interface.interaction-methods';
import PouchDB from 'pouchdb-browser';
import { diff } from 'fast-array-diff';
import { log } from './log';
import { observe } from 'mobx';
import { observeItem } from './observe-item';

export function generateMethods<MobXStore extends IMobXStore, DocumentJSON extends IDocumentJSON>(
	dbName: string,
	db: PouchDB.Database,
	data: MobXStore,
	Class: IClassCreator
) {
	const methods: InteractionMethods<IClassStatic> = {
		/**
         * Grab the database and put it into the MobX store
         */
		async syncFromDatabase() {
			log(dbName, 'Syncing from the database');

			// grab the data for this user (defined by the document design)
			const response = await db.allDocs<DocumentJSON>({
				include_docs: true,
				startkey: API.login.clinicID,
				endkey: API.login.clinicID + `\ufff0`
			});
			const docs = response.rows.map((x) => x.doc) || [];
			data.ignoreObserver = true;
			// convert JSON to class
			const newData = docs.map((x) => new Class(x));
			// put the document on the mobx store
			data.list = newData;
			log(dbName, 'Observing the list');
			// observe the mobx store list for changes
			observe(data.list, (change) => {
				// only if we're not ignoring it (i.e. we're not syncing from database, thus preventing cycles)
				if (!data.ignoreObserver) {
					methods.syncListToDatabase(data.list);
				}
			});

			// refill singleDocumentCancellationMethods
			log(dbName, 'Observing every item');
			data.list.forEach((item, index) => observeItem(dbName, item, data, methods));
			data.ignoreObserver = false;
		},

		/**
         * Put the MobX store list into the database by diffing the new store with the cache
         * 
         */
		async syncListToDatabase(newList: IClassStatic[]) {
			log(dbName, 'Syncing to the database');

			const current = await db.allDocs({
				startkey: API.login.clinicID,
				endkey: API.login.clinicID + `\ufff0`
			});
			const currentIDs = current.rows.map((x) => x.id);

			// diff
			const result = diff<string>(currentIDs.sort(), newList.map((x) => x._id).sort());

			log(
				dbName,
				'We will remove',
				result.removed.length,
				'documents',
				'and will add',
				result.added.length,
				'documents'
			);

			// remove the removed
			result.removed.forEach((_id) => {
				methods.remove(_id);
			});

			// add the added
			result.added.forEach((_id) => {
				const document = newList.find((doc) => doc._id === _id);
				if (!document) {
					return;
				}
				observeItem(dbName, document, data, methods);
				methods.add(document);
			});
		},

		/**
         * Add new document
         * 
         * @param {ClassStatic} item 
         * @returns {PouchDB.Core.Response}
         */
		async add(item: IClassStatic) {
			log(dbName, 'adding', item.toJSON());
			const response = await db.put(item.toJSON());
			return response;
		},

		/**
         * Remove document
         * 
         * @param {string} _id 
         * @returns {PouchDB.Core.Response}
         */
		async remove(_id: string) {
			const doc = await db.get(_id);
			log(dbName, 'deleting', doc);
			const response = await db.remove(doc._id, doc._rev || '');
			return response;
		},

		/**
         * Update a document (given an ID)
         * 
         * @param {string} _id 
         * @param {ClassStatic} item 
         * @returns {PouchDB.Core.Response}
         */
		async update(_id: string, item: IClassStatic) {
			log(dbName, 'updating', _id, 'to', item.toJSON());
			const document = item.toJSON();
			const doc = await db.get(_id);
			document._rev = doc._rev;
			const response = await db.put(document);
			return response;
		}
	};
	return methods;
}
