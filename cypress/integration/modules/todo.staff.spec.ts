/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Staff", () => {
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
		cy.goToPage("staff");

		const staffToAdd = ["aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg"];
		staffToAdd.forEach((x, i) => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("staff-name").type(x);
			cy.get(".ms-Checkbox-label")
				.eq(i)
				.click();
			if (i === 0 || i === 1 || i === 2) {
				cy.getByTestId("phone-number").type(i.toString());
			}
			if (i === 0 || i === 3) {
				cy.getByTestId("email").type(`${x}@${x}${i}.com`);
			}
			cy.closePanel();
		});

		cy.get('.alex [data-icon-name="Trash"]').click();
		cy.getByTestId("modal-confirm").click();
		cy.get(".user-chooser");
		cy.get(".ms-Persona")
			.first()
			.click();

		// adding a treatment
		cy.goToPage("treatments");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("treatment-title").type("treatment");
		cy.closePanel();

		// adding appointments
		cy.goToPage("patients");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("patient-name").type("patient");
		cy.clickTabByIcon("Calendar");

		staffToAdd.forEach((x, i) => {
			if (i % 2 === 0) {
				// adding a past appointment
				cy.chooseFromDropdown("new-appointment", "treatment");
				cy.get(".operating-staff input").type(x);
				cy.get(".ms-Suggestions-item")
					.first()
					.click();

				cy.pickDate("appointment-date", "yesterday");
				if (i) {
					cy.getByTestId("is-done").click();
				}

				cy.closePanel();
			}

			if (i % 3 === 0) {
				// adding an upcoming appointment
				cy.chooseFromDropdown("new-appointment", "treatment");
				cy.get(".operating-staff input").type(x);
				cy.get(".ms-Suggestions-item")
					.first()
					.click();

				cy.pickDate("appointment-date", "tomorrow");
				cy.closePanel();
			}
		});
	});

	describe("on the table", () => {
		it("Names and upcoming appointments", () => {});
		it("Contact details", () => {});
		it("last next appointment", () => {});
	});

	describe("editing", () => {
		it("Editing name", () => {});
		it("Editing days on duty", () => {});
		it("reflecting days on duty on calendar and home page", () => {});
		it("Editing contact details", () => {});
		it("can only edit his own PIN", () => {});
		it("can not edit his own permissions", () => {});
		it("upcoming appointments list", () => {});
		it("deleting", () => {});
	});
});
