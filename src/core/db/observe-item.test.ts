import { IClassStatic } from "./interface.class-static";
import { observeItem } from "./observe-item";
import { singleItemUpdateQue } from "./single-item-update-que";
import { staff, Treatment } from "@modules";
describe("@core: DB", () => {
	describe("observe single item", () => {
		it("function gets called when the item updates", done => {
			const item = new Treatment();
			const _id = item._id;
			const store = {
				list: [],
				ignoreObserver: false
			};
			const updateFunc = jest.fn(async function() {
				// this is the function that will be called
				return { id: _id, rev: "", ok: true };
			});
			observeItem(item as any, store, {
				update: updateFunc,
				add: async () => {
					return { id: _id, rev: "", ok: true };
				},
				remove: async () => {
					return { id: _id, rev: "", ok: true };
				},
				syncListToDatabase: async (newList: []) => {}
			});
			item.expenses++;
			setTimeout(() => {
				expect(updateFunc).toBeCalledWith(_id, item);
				done();
			}, 2000);
		});

		it("function gets called even when the item is already in que", done => {
			const item = new Treatment();
			const _id = item._id;
			const store = {
				list: [],
				ignoreObserver: false
			};
			const updateFunc = jest.fn(async function() {
				// this is the function that will be called
				return { id: _id, rev: "", ok: true };
			});
			singleItemUpdateQue[_id] = async () => {};
			observeItem(item as any, store, {
				update: updateFunc,
				add: async () => {
					return { id: _id, rev: "", ok: true };
				},
				remove: async () => {
					return { id: _id, rev: "", ok: true };
				},
				syncListToDatabase: async (newList: []) => {}
			});
			item.expenses++;
			setTimeout(() => {
				expect(updateFunc).toBeCalledWith(_id, item);
				done();
			}, 2000);
		});

		it("function does not get called when ignore observer is true", done => {
			const item = new Treatment();
			const _id = item._id;
			const store = {
				list: [],
				ignoreObserver: true
			};
			const updateFunc = jest.fn(async function() {
				// this is the function that will be called
				return { id: _id, rev: "", ok: true };
			});
			observeItem(item as any, store, {
				update: updateFunc,
				add: async () => {
					return { id: _id, rev: "", ok: true };
				},
				remove: async () => {
					return { id: _id, rev: "", ok: true };
				},
				syncListToDatabase: async (newList: []) => {}
			});
			item.expenses++;
			setTimeout(() => {
				expect(updateFunc).not.toBeCalled();
				done();
			}, 2000);
		});
	});
});
