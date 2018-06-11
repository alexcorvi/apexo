import { isObservableArray, observe, toJS as normalizeArray } from 'mobx';

import { IClassStatic } from './interface.class-static';
import { IMobXStore } from './interface.mobx-store';
import { InteractionMethods } from './interface.interaction-methods';
import { diff } from 'fast-array-diff';
import { log } from './log';
import { singleItemUpdateQue } from './single-item-update-que';

export function observeItem(dbName: string, item: IClassStatic, data: IMobXStore, methods: InteractionMethods<any>) {
	log(dbName, 'Observing item', item.toJSON());
	observe(item, (change) => {
		log(dbName, 'item changed', change);
		if (data.ignoreObserver) {
			log(dbName, 'change ignored');
			return;
		}
		if (isObservableArray(change.newValue)) {
			log(dbName, 'Change was an array');
			const diffs = diff(normalizeArray(change.oldValue), normalizeArray(change.newValue));
			if (!(diffs.added.length || diffs.removed.length)) {
				log(dbName, "Array didn't really change");
				return;
			}
		}
		// check to see if we have already queued an update for this item
		const existingIndex = singleItemUpdateQue.findIndex((single) => single.id === item._id);
		// delete if it's there
		if (existingIndex !== -1) {
			log(dbName, "This items is already queued for pushing, we'll just update");
			singleItemUpdateQue.splice(existingIndex, 1);
		}
		// que the new update
		log(dbName, 'Adding item update function in the que');
		singleItemUpdateQue.push({
			id: item._id,
			update: async () => await methods.update(item._id, item)
		});
	});
}
