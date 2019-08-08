/// <reference types="cypress" />
/// <reference types="../../cypress" />

const timeout = 100 * 1000;
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

describe("home", () => {
	it("Welcome text", () => {
		cy.get(".welcome").should("contain.text", "Welcome, Alex");
	});
	it("Appointments", () => {
		const patientName1 = "Dina";
		const treatmentName1 = "Filling";
		const patientName2 = "William";
		const treatmentName2 = "Crowning";

		// today
		cy.goToPage("treatments");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("treatment-title").type(treatmentName1);
		cy.closePanel();
		cy.goToPage("patients");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("patient-name").type(patientName1);
		cy.clickTabByIcon("Calendar");
		cy.chooseFromDropdown("new-appointment", treatmentName1);
		cy.pickDate("appointment-date", "today");
		cy.get(".operating-staff input").type("Al");
		cy.get(".ms-Suggestions-item")
			.first()
			.click();
		cy.closePanel();
		cy.closePanel();
		// tomorrow
		cy.goToPage("treatments");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("treatment-title").type(treatmentName2);
		cy.closePanel();
		cy.goToPage("patients");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("patient-name").type(patientName2);
		cy.clickTabByIcon("Calendar");
		cy.chooseFromDropdown("new-appointment", treatmentName2);
		cy.pickDate("appointment-date", "tomorrow");
		cy.get(".operating-staff input").type("Al");
		cy.get(".ms-Suggestions-item")
			.first()
			.click();
		cy.closePanel();
		cy.closePanel();
		cy.goToPage("home");
		cy.get(".today-appointments").should("contain.text", patientName1);
		cy.get(".today-appointments").should("contain.text", treatmentName1);
		cy.get(".today-appointments").should("contain.text", "Today");
		cy.get(".tomorrow-appointments").should("contain.text", patientName2);
		cy.get(".tomorrow-appointments").should("contain.text", treatmentName2);
		cy.get(".tomorrow-appointments").should("contain.text", "Tomorrow");
		cy.goToPage("staff");
		cy.get(".clickable.no-label")
			.first()
			.click();
		cy.get(".day-selector").click({ multiple: true });
		cy.closePanel();
		cy.goToPage("home");
		cy.get(".duty-table").should("contain.text", "1 appointments for");
	});
});
