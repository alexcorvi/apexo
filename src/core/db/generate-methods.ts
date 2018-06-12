import { API } from '../';
import { IClassCreator } from './interface.class-creator';
import { IClassStatic } from './interface.class-static';
import { IDocumentJSON } from './interface.document-json';
import { IMobXStore } from './interface.mobx-store';
import { InteractionMethods } from './interface.interaction-methods';
import PouchDB from 'pouchdb-browser';
import { diff } from 'fast-array-diff';
import { observe } from 'mobx';
import { observeItem } from './observe-item';

export function generateMethods(dbName: string, db: PouchDB.Database, data: IMobXStore, Class: IClassCreator) {
	const methods: InteractionMethods<IClassStatic> = {
		/**
         * Put the MobX store list into the database by diffing the new store with the cache
         * 
         */
		async syncListToDatabase(newList: IClassStatic[]) {
			const current = await db.allDocs({});
			const currentIDs = current.rows.map((x) => x.id);

			// diff
			const result = diff<string>(currentIDs.sort(), newList.map((x) => x._id).sort());
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
			const document = item.toJSON();
			const doc = await db.get(_id);
			document._rev = doc._rev;
			const response = await db.put(document);
			return response;
		}
	};
	return methods;
}
