/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Prescriptions", () => {
	before(() => {
		cy.visit("http://localhost:8000");
		cy.clearCookies();
		cy.resetEverything();
		cy.reload();
		cy.wait(1000);
		cy.get(".no-server-mode").click();
		cy.getByTestId("new-user-name")
			.type("Alex")
			.type("{enter}");
		cy.ensureLoginType("no-server");
		cy.goToPage("settings");
		cy.solveMath();
		cy.getByTestId("prescriptions-toggle").click();
		cy.goToPage("prescriptions");
	});

	const prescriptions = ["ABC", "DEF", "XYZ", "MNO"];

	describe("creating/viewing prescriptions", () => {
		it("creating prescriptions", () => {
			prescriptions.forEach((name, i) => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("rx-name")
					.clear()
					.type(name);
				cy.getByTestId("rx-dose")
					.clear()
					.type((i * 100).toString());
				cy.getByTestId("rx-times")
					.clear()
					.type(i.toString());
				cy.getByTestId("rx-units")
					.clear()
					.type(i.toString());
				cy.chooseFromDropdown("form-picker", i);
				cy.closePanel();
			});
		});
		it("viewing", () => {
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", prescriptions.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "0 mg");
			first.should("contain.text", "0 * 0");
			first.should("contain.text", "capsule");
		});
		it("sorting", () => {
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", prescriptions.length);
			all.last().should("contain.text", "XYZ");
		});
		it("Editing", () => {
			const newTitle = "BB NEW TITLE";
			cy.get(".data-table tbody tr .clickable")
				.eq(2)
				.click();
			cy.getByTestId("rx-name")
				.clear()
				.type(newTitle);
			cy.getByTestId("rx-dose")
				.clear()
				.type((900).toString());
			cy.closePanel();
			cy.get(".data-table tbody tr")
				.eq(1)
				.should("contain.text", newTitle);
			cy.get(".data-table tbody tr")
				.eq(1)
				.should("contain.text", "9000 mg");
		});
		it("Deleting from table", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("rx-name").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .delete-button")
				.eq(0)
				.click();
			cy.getByTestId("modal-confirm").click();

			const all = cy.get(".data-table tbody tr");
			all.should("have.length", prescriptions.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "0 mg");
			first.should("contain.text", "0 * 0");
			first.should("contain.text", "capsule");
		});
		it("Deleting from panel", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("rx-name").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .clickable")
				.eq(0)
				.click();
			cy.clickTabByIcon("trash");
			cy.get("button.delete").click();

			const all = cy.get(".data-table tbody tr");
			all.should("have.length", prescriptions.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "0 mg");
			first.should("contain.text", "0 * 0");
			first.should("contain.text", "capsule");
		});
	});
});
