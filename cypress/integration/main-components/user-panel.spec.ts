/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("user panel", () => {
	const timeoutUserPanel = 100 * 1000;
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

	describe("header", () => {
		it("name", () => {
			cy.getByTestId("expand-user", timeoutUserPanel).click();
			cy.get(".user-component .ms-Persona").should("be.visible");
		});
		it("action: logout", () => {
			cy.getByTestId("expand-user").click();
			cy.getByTestId("logout").click();
			cy.get(".login-component").should("be.visible");
		});
		it("action: reset user", () => {
			cy.getByTestId("expand-user").click();
			cy.getByTestId("switch").click();
			cy.getByTestId("user-chooser").should("be.visible");
		});
	});

	describe("Appointments", () => {
		it("listing upcoming appointments", () => {
			const patientName = "Dina";
			const treatmentName = "Filling";
			cy.goToPage("treatments");
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("treatment-title").type(treatmentName);
			cy.closePanel();
			cy.goToPage("patients");
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type(patientName);
			cy.clickTabByIcon("Calendar");
			cy.chooseFromDropdown("new-appointment", treatmentName);
			cy.get(".operating-staff input").type("Al");
			cy.get(".ms-Suggestions-item")
				.first()
				.click();
			cy.closePanel();
			cy.closePanel();
			cy.getByTestId("expand-user").click();
			cy.getByTestId("appointments-list").should(
				"contain.text",
				treatmentName
			);
			cy.getByTestId("appointments-list").should(
				"contain.text",
				patientName
			);
			cy.getByTestId("appointments-list").should("contain.text", "Alex");
			cy.getByTestId("appointments-list").should("contain.text", "Today");
		});
	});
});
