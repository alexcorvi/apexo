import { Modals } from "@core";
describe("@core: modals", () => {
	const modals = new Modals();
	it("creating new modals", () => {
		modals.newModal({
			id: "a",
			text: "a",
			onConfirm: () => {},
			showCancelButton: true,
			showConfirmButton: true
		});

		modals.newModal({
			id: "b",
			text: "b",
			onConfirm: () => {},
			showCancelButton: true,
			showConfirmButton: true
		});

		modals.newModal({
			id: "c",
			text: "c",
			onConfirm: () => {},
			showCancelButton: true,
			showConfirmButton: true
		});

		expect(modals.activeModals.length).toBe(3);
	});

	it("deleting modals", () => {
		modals.deleteModal(1);
		expect(modals.activeModals.length).toBe(2);
	});
});
