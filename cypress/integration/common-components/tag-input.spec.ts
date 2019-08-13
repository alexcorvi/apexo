/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Editable list", () => {
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

		const staff = ["William", "Wilson", "Albert", "Allison"];

		staff.forEach(x => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("staff-name").type(x);
			cy.closePanel();
		});

		cy.goToPage("treatments");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("treatment-title").type("treatment type");
		cy.closePanel();

		cy.goToPage("patients");
		cy.get(`[title="Add new"]`).click();
		cy.clickTabByIcon("Calendar");
		cy.chooseFromDropdown("new-appointment", "treatment type");
	});

	it("suggestion header", () => {
		cy.get(".operating-staff input").click();
		cy.get(".ms-Suggestions-title").should(
			"contain.text",
			"Operating staff"
		);
	});

	it("not found text", () => {
		cy.get(".operating-staff input").type("something that doesn't exist");
		cy.get(".ms-Suggestions-none").should("contain.text", "No staff found");
		cy.get(".ms-Suggestions-title").should(
			"contain.text",
			"Operating staff"
		);
	});

	it("Filtering", () => {
		cy.get(".operating-staff input").clear();
		cy.get(".operating-staff input").type("al");
		cy.get(".ms-Suggestions-item")
			.contains("William")
			.should("not.exist");
		cy.get(".ms-Suggestions-item")
			.contains("Wilson")
			.should("not.exist");
		cy.get(".ms-Suggestions-item")
			.contains("Alex")
			.should("be.visible");
		cy.get(".ms-Suggestions-item")
			.contains("Albert")
			.should("be.visible");
		cy.get(".ms-Suggestions-item")
			.contains("Allison")
			.should("be.visible");

		cy.get(".operating-staff input").clear();
		cy.get(".operating-staff input").type("wi");
		cy.get(".ms-Suggestions-item")
			.contains("William")
			.should("be.visible");
		cy.get(".ms-Suggestions-item")
			.contains("Wilson")
			.should("be.visible");
		cy.get(".ms-Suggestions-item")
			.contains("Alex")
			.should("not.exist");
		cy.get(".ms-Suggestions-item")
			.contains("Albert")
			.should("not.exist");
		cy.get(".ms-Suggestions-item")
			.contains("Allison")
			.should("not.exist");
	});
});
