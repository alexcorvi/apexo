import { store } from "@utils";
describe("@utils: store", () => {
	const itemName = "name";
	const itemContent = "apexo1234, عليひらがな ☤☥☦☧☨☩☪☫☬ 😁";
	it("Saves an item", () => {
		store.set(itemName as any, itemContent);
	});
	it("Gets an item", () => {
		expect(store.get(itemName as any)).toBe(itemContent);
	});
	it("Finds an item", () => {
		expect(store.found(itemName as any)).toBe(true);
	});
	it("Removes an item", () => {
		store.remove(itemName as any);
		expect(store.found(itemName as any)).toBe(false);
		store.set(itemName as any, itemContent);
	});
	it("Clears everything", () => {
		store.clear();
		expect(store.found(itemName as any)).toBe(false);
	});
});
