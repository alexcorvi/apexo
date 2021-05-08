/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Treatments", () => {
	const treatmentsTimeout = 100 * 1000;
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
		cy.goToPage("treatments");
	});

	const treatments = ["ABC", "DEF", "XYZ", "MNO"];

	describe("creating/viewing treatments", () => {
		it("creating treatments", () => {
			treatments.forEach((treatmentName, i) => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("treatment-title").type(treatmentName);
				cy.getByTestId("treatment-expenses").type((i * 10).toString());
				cy.closePanel();
			});
		});
		it("viewing", () => {
			cy.goToPage("patients");
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type("any");
			cy.clickTabByIcon("Calendar");
			cy.chooseFromDropdown("new-appointment", "ABC");
			cy.get(".operating-staff input").type("Al");
			cy.get(".ms-Suggestions-item")
				.first()
				.click();

			cy.get(".ms-Toggle")
				.contains("done")
				.click();
			cy.closePanel();

			cy.chooseFromDropdown("new-appointment", "ABC");
			cy.get(".operating-staff input").type("Al");
			cy.get(".ms-Suggestions-item")
				.first()
				.click();
			cy.closePanel();

			cy.closePanel();
			cy.goToPage("treatments");
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", treatments.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "$0");
			first.should("contain.text", "1 upcoming");
			first.should("contain.text", "1 done");
		});
		it("sorting", () => {
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", treatments.length);
			all.last().should("contain.text", "XYZ");
		});

		it("Editing", () => {
			const newTitle = "BB NEW TITLE";
			cy.get(".data-table tbody tr .clickable")
				.eq(2)
				.click();
			cy.getByTestId("treatment-title")
				.clear()
				.type(newTitle);
			cy.getByTestId("treatment-expenses")
				.clear()
				.type((100).toString());
			cy.closePanel();
			cy.get(".data-table tbody tr")
				.eq(1)
				.should("contain.text", newTitle);
			cy.get(".data-table tbody tr")
				.eq(1)
				.should("contain.text", "$100");
		});

		it("Deleting from table", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("treatment-title").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .delete-button")
				.eq(0)
				.click();
			cy.getByTestId("modal-confirm").click();
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", treatments.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "$0");
			first.should("contain.text", "1 upcoming");
			first.should("contain.text", "1 done");
		});
		it("Deleting from panel", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("treatment-title").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .clickable")
				.eq(0)
				.click();
			cy.clickTabByIcon("trash");
			cy.get("button.delete").click();
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", treatments.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "$0");
			first.should("contain.text", "1 upcoming");
			first.should("contain.text", "1 done");
		});
	});
});
