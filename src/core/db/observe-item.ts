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
		singleItemUpdateQue[item._id] = async () =>
			await methods.update(item._id, item);
	});
}
