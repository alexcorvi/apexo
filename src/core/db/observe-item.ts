import { IClassStatic } from "./interface.class-static";
import { InteractionMethods } from "./interface.interaction-methods";
import { IMobXStore } from "./interface.mobx-store";
import { singleItemUpdateQue } from "./single-item-update-que";
import { diff } from "fast-array-diff";
import { isObservableArray, observe, toJS as normalizeArray } from "mobx";


export function observeItem(
	item: IClassStatic,
	data: IMobXStore,
	methods: InteractionMethods<any>
) {
	observe(item, change => {
		if (change.type !== "update") {
			return;
		}
		if (data.ignoreObserver) {
			return;
		}
		if (isObservableArray(change.newValue)) {
			const diffs = diff(
				normalizeArray(change.oldValue),
				normalizeArray(change.newValue)
			);
			if (!(diffs.added.length || diffs.removed.length)) {
				return;
			}
		}
		// check to see if we have already queued an update for this item
		const existingIndex = singleItemUpdateQue.findIndex(
			single => single.id === item._id
		);
		// delete if it's there
		if (existingIndex !== -1) {
			singleItemUpdateQue.splice(existingIndex, 1);
		}
		// que the new update
		singleItemUpdateQue.push({
			id: item._id,
			update: async () => await methods.update(item._id, item)
		});
	});
}
