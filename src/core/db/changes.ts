import { API } from '../';
import { IClassCreator } from './interface.class-creator';
import { IMobXStore } from './interface.mobx-store';
import { InteractionMethods } from './interface.interaction-methods';
import PouchDB from 'pouchdb-browser';
import { log } from './log';
import { observeItem } from './observe-item';
import { singleItemUpdateQue } from './single-item-update-que';

export function watchForChanges<Store extends IMobXStore, ClassCreator extends IClassCreator>(
	dbName: string,
	localDatabase: PouchDB.Database<any>,
	data: Store,
	Class: ClassCreator,
	methods: InteractionMethods<any>
) {
	// watch the database for changes
	log(dbName, 'starting to watch for changes');
	localDatabase
		.changes({
			since: 'now',
			live: true,
			include_docs: true,
			query_params: {
				clinicID: API.login.clinicID
			},
			filter: 'design/clinic',
			limit: 1
		})
		.on('change', function(change) {
			const newDoc = change.doc as any;
			const id = change.id;
			const mobxIndex = data.list.findIndex((x) => x._id === id);

			const deletion = mobxIndex !== -1 && change.deleted;
			const update = mobxIndex !== -1 && !change.deleted;
			const addition = mobxIndex === -1 && !change.deleted;

			log(dbName, 'a database changed occurred on document mobxIndex index:', mobxIndex, change);
			data.ignoreObserver = true;
			// if it's a deletion
			if (deletion) {
				log(dbName, "The database change was a deletion, we'll remove it right away");
				data.list.splice(mobxIndex, 1);
			} else if (addition) {
				// if it's an addition
				log(dbName, "The database change was an addition, we'll add it right away");
				data.list.push(new Class(newDoc));
			} else if (update) {
				// if it's an update
				log(dbName, "The database change was an update, we'll update right away");
				// if there's another update that will carry on the same document
				// don't update the MobX store just now
				if (singleItemUpdateQue.find((x) => x.id === id)) {
					log(dbName, "the item is being queued again for update, we'll ignore this update");
				} else {
					data.list[mobxIndex].fromJSON(newDoc);
					observeItem(dbName, data.list[mobxIndex], data, methods);
				}
			}
			data.ignoreObserver = false;
		})
		.on('error', (err) => log(dbName, 'Error occurred', err));
}
