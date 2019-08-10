/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("section", () => {
	beforeEach(() => {
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
		patients.forEach(patientName => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type(patientName);
			cy.closePanel();
		});

		patients.forEach(patientName => {
			cy.get(".pg-pn-" + patientName + " .clickable .ms-Persona").click();
			cy.get(".patient-labels input").type("label-" + patientName);
			cy.get(".ms-Suggestions-item")
				.first()
				.click();
			cy.closePanel();
		});

		patients.forEach(patientName => {
			cy.get(".pg-pn-" + patientName).should(
				"contain.text",
				"label-" + patientName
			);
		});
	});
});
