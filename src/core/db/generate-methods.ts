import { diff } from "fast-array-diff";
import { IClassCreator } from "./interface.class-creator";
import { IClassStatic } from "./interface.class-static";
import { IMobXStore } from "./interface.mobx-store";
import { InteractionMethods } from "./interface.interaction-methods";
import { observeItem } from "./observe-item";

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
			let index = this.que.findIndex(x => x.id === item._id);
			if (index === -1) {
				index = this.que.length;
			}
			this.que[index] = {
				id: item._id,
				action: function() {
					return db.put(item.toJSON());
				}
			};
		},

		async remove(_id: string) {
			let index = this.que.findIndex(x => x.id === _id);
			if (index === -1) {
				index = this.que.length;
			}
			this.que[index] = {
				id: _id,
				action: async function() {
					const doc = await db.get(_id);
					return db.remove(doc._id, doc._rev || "");
				}
			};
		},

		async update(_id: string, item: IClassStatic) {
			let index = this.que.findIndex(x => x.id === _id);
			if (index === -1) {
				index = this.que.length;
			}
			this.que[index] = {
				id: _id,
				action: async function() {
					const document = item.toJSON();
					const doc = await db.get(_id);
					document._rev = doc._rev;
					return db.put(document);
				}
			};
		},

		que: []
	};

	setInterval(() => {
		if (methods.que.length) {
			const target = methods.que[0];
			target
				.action()
				.then(() => {
					const i = methods.que.findIndex(x => x.id === target.id);
					methods.que.splice(i, 1);
				})
				.catch(() => {
					const i = methods.que.findIndex(x => x.id === target.id);
					methods.que.splice(i, 1);
				});
		}
	}, 100);

	return methods;
}
