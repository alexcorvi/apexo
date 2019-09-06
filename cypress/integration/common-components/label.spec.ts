/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("label", () => {
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
	});
	it("Viewing labels", () => {
		const patients = ["alex", "dina", "william", "jeff", "bill", "hugh"];
		cy.goToPage("patients");
		patients.forEach((patientName, index) => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type(patientName);
			cy.get(".patient-labels input").type("label-" + patientName);
			cy.get(".ms-Suggestions-item")
				.first()
				.click();
			if (index % 2 === 0) {
				cy.get(".patient-labels input").type("even");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
			}
			cy.closePanel();
		});
		patients.forEach(patientName => {
			cy.get(".pg-pn-" + patientName).should(
				"contain.text",
				"label-" + patientName
			);
		});
	});
	it("clicking labels", () => {
		cy.get('[data-head="Patient"]').should("have.length.gt", 3);
		cy.get(".label.clickable")
			.contains("even")
			.first()
			.click();
		cy.get(".label.clickable")
			.contains("even")
			.should("have.class", "highlighted");
		cy.get('[data-head="Patient"]').should("have.length", 3);
		cy.get(".label.clickable.highlighted")
			.first()
			.click();
		cy.get('[data-head="Patient"]').should("have.length.gt", 3);
	});
});
