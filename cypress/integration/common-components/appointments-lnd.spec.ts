/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("appointments-lnd", () => {
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

	it("Appointments Listing", () => {
		const patients = ["Dina", "Bill", "William"];
		const treatments = ["Filling", "Crowning", "RCT"];
		const dates: Array<"yesterday" | "today" | "tomorrow"> = [
			"yesterday",
			"today",
			"tomorrow"
		];

		cy.goToPage("treatments");
		treatments.forEach(treatmentName => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("treatment-title").type(treatmentName);
			cy.closePanel();
		});

		cy.goToPage("patients");
		patients.forEach(patientName => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type(patientName);
			cy.clickTabByIcon("Calendar");

			treatments.forEach((treatmentName, i) => {
				cy.chooseFromDropdown("new-appointment", treatmentName);
				cy.pickDate("appointment-date", dates[i]);
				cy.get(".operating-staff input").type("Al");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();
			});

			cy.get(".appointment-body")
				.eq(0)
				.should("contain.text", "Yesterday");
			cy.get(".appointment-body")
				.eq(0)
				.should("contain.text", "Missed");
			cy.get(".appointment-body")
				.eq(0)
				.should("contain.text", treatments[0]);
			cy.get(".appointment-body")
				.eq(0)
				.should("contain.text", "Alex");
			cy.get(".appointment-body")
				.eq(1)
				.should("contain.text", "Today");
			cy.get(".appointment-body")
				.eq(1)
				.should("contain.text", treatments[1]);
			cy.get(".appointment-body")
				.eq(1)
				.should("contain.text", "Alex");
			cy.get(".appointment-body")
				.eq(2)
				.should("contain.text", "Tomorrow");
			cy.get(".appointment-body")
				.eq(2)
				.should("contain.text", treatments[2]);
			cy.get(".appointment-body")
				.eq(2)
				.should("contain.text", "Alex");

			cy.get(".appointment-body")
				.eq(0)
				.click();

			cy.get(".ms-Toggle")
				.contains("done")
				.click();
			cy.closePanel();

			cy.get(".appointment-body")
				.eq(0)
				.should("contain.text", "Done");

			cy.get(".appointment-body")
				.eq(0)
				.should("not.contain.text", "Missed");

			cy.closePanel();
		});
	});
});
