import { IClassCreator, IClassStatic, IMobXStore, InteractionMethods, observeItem } from "@core";
import { diff } from "fast-array-diff";

export function generateMethods(
	db: PouchDB.Database,
	data: IMobXStore,
	Class: IClassCreator
) {
	const methods: InteractionMethods<IClassStatic> = {
		/**
		 * Put the MobX store list into the database by diffing the new store with the cache
		 *
		 */
		async syncListToDatabase(newList: IClassStatic[]) {
			const current = await db.allDocs({});
			const currentIDs = current.rows.map(x => x.id);

			// diff
			const result = diff<string>(
				currentIDs.sort(),
				newList.map(x => x._id).sort()
			);
			// remove the removed
			result.removed.forEach(_id => {
				methods.remove(_id);
			});

			// add the added
			result.added.forEach(_id => {
				const document = newList.find(doc => doc._id === _id);
				if (!document) {
					return;
				}
				observeItem(document, data, methods);
				methods.add(document);
			});
		},

		async add(item: IClassStatic) {
			const response = await db.put(item.toJSON());
			return response;
		},

		async remove(_id: string) {
			const doc = await db.get(_id);
			(doc as any)._deleted = true;
			const response = await db.put(doc);
			return response;
		},

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
