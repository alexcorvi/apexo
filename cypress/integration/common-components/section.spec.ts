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
	it("expanding and collapsing", () => {
		cy.goToPage("staff");
		cy.get(".alex .clickable").click();
		cy.get(".cl-section")
			.first()
			.should("contain.text", "Name")
			.should("contain.text", "Days on duty");
		cy.get(".cl-section-title")
			.first()
			.should("not.have.class", "only-title");
		cy.get(".cl-section .chevron")
			.first()
			.click();
		cy.get(".cl-section-title")
			.first()
			.should("have.class", "only-title");
		cy.get(".cl-section")
			.first()
			.should("not.contain.text", "Name")
			.should("not.contain.text", "Days on duty");
		cy.get(".cl-section .chevron")
			.first()
			.click();
		cy.get(".cl-section")
			.first()
			.should("contain.text", "Name")
			.should("contain.text", "Days on duty");
		cy.get(".cl-section-title")
			.first()
			.should("not.have.class", "only-title");
	});
});
