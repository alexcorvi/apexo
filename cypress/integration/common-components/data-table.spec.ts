/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("data table", () => {
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
		const patients = "abcdefghijklmnopqrst"
			.split("")
			.map(x => `${x}${x}${x}${x}${x}${x}`);
		cy.goToPage("patients");
		patients.forEach(patientName => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type(patientName);
			cy.closePanel();
		});
	});

	it("Searching", () => {
		cy.get(".ms-SearchBox input").type("ffff");
		cy.get(".patients-data-table tbody").should("contain.text", "ffff");
		cy.get(".patients-data-table tbody").should("not.contain.text", "aaaa");
		cy.get(".patients-data-table tbody tr").should("have.length", 1);
		cy.get(".ms-SearchBox input").clear();
	});

	it("Sorting", () => {
		cy.get("th.patient").click();
		cy.get(".patients-data-table tbody tr")
			.first()
			.should("contain.text", "tttt");
		cy.get("th.patient").click();
		cy.get(".patients-data-table tbody tr")
			.first()
			.should("contain.text", "aaaa");
	});

	it("Limiting", () => {
		cy.get(".patients-data-table tbody tr").should("have.length", 10);
		cy.get(".load-more").click();
		cy.get(".patients-data-table tbody tr").should("have.length", 20);
		cy.get(".load-more").should("not.exist");
	});

	it("Clicking", () => {
		cy.get(".patients-data-table tbody tr .clickable .ms-Persona")
			.first()
			.click();
		cy.getByTestId("patient-name").should("be.visible");
	});
});
