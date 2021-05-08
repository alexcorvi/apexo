import { Menu, router } from "@core";
describe("@core: menu", () => {
	const menu = new Menu();
	menu.items = [];
	menu.items.push({
		name: "a",
		key: "a",
		url: "a",
		icon: "a",
		onClick: () => {},
		order: 1
	});

	menu.items.push({
		name: "b",
		key: "b",
		url: "b",
		icon: "b",
		onClick: () => {},
		order: 3
	});

	menu.items.push({
		name: "c",
		key: "c",
		url: "c",
		icon: "c",
		onClick: () => {},
		order: 2
	});

	menu.items.push({
		name: "d",
		key: "d",
		url: "d",
		icon: "d",
		onClick: () => {},
		order: 100,
		condition: () => false
	});

	it("Added to menu successfully", () => {
		expect(menu.items.length).toBe(4);
	});

	it("Sorted successfully", () => {
		expect(menu.sortedItems[1].name).toBe("c");
	});

	it("Conditional filtering", () => {
		expect(menu.sortedItems.length).toBe(3);
	});

	it("Nothing repeated", () => {
		menu.items.push({
			name: "c",
			key: "c",
			url: "c",
			icon: "c",
			onClick: () => {},
			order: 2
		});
		expect(menu.sortedItems.length).toBe(3);
	});

	it("Show menu", () => {
		menu.show();
		expect(router.selectedMain).toBe("menu");
		menu.hide();
	});

	it("Hide menu", () => {
		menu.show();
		menu.hide();
		expect(router.selectedMain).toBe("");
	});
});
