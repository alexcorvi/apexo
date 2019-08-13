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
		cy.goToPage("patients");
		cy.get(`[title="Add new"]`).click();
		cy.getByTestId("patient-name").type("Patient name");
	});

	it("Disabled input, not accepting when empty", () => {
		cy.getByTestId("add-elc-item").should("have.class", "is-disabled");
		cy.get(".elc-c .new-item input").type("{enter}");
		cy.get(".elc-c .list-item").should("not.exist");
	});

	it("Adding and clicking", () => {
		cy.get(".elc-c .new-item input")
			.type("item a")
			.type("{enter}");
		cy.get(".list-item")
			.contains("item a")
			.should("be.visible");
		cy.closePanel();
		cy.goToPage("staff");
		cy.goToPage("patients");
		cy.get(".clickable")
			.first()
			.click();
		cy.get(".ms-Panel-content").scrollTo("bottom");
		cy.get(".list-item")
			.contains("item a")
			.should("be.visible");
	});

	it("Adding and pressing enter", () => {
		cy.get(".elc-c .new-item input").type("item b");
		cy.getByTestId("add-elc-item").click();
		cy.get(".list-item")
			.contains("item b")
			.should("be.visible");
		cy.closePanel();
		cy.goToPage("staff");
		cy.goToPage("patients");
		cy.get(".clickable")
			.first()
			.click();
		cy.get(".ms-Panel-content").scrollTo("bottom");
		cy.get(".list-item")
			.contains("item b")
			.should("be.visible");
	});

	it("Editing", () => {
		cy.get(".list-item textarea")
			.first()
			.clear()
			.type("item c");
		cy.get(".list-item")
			.contains("item c")
			.should("be.visible");
		cy.get(".list-item")
			.contains("item a")
			.should("not.be.visible");
		cy.closePanel();
		cy.goToPage("staff");
		cy.goToPage("patients");
		cy.get(".clickable")
			.first()
			.click();
		cy.get(".ms-Panel-content").scrollTo("bottom");
		cy.get(".list-item")
			.contains("item c")
			.should("be.visible");
		cy.get(".list-item")
			.contains("item a")
			.should("not.be.visible");
	});

	it("Deleting", () => {
		cy.get(".list-item")
			.contains("item c")
			.should("be.visible");
		cy.getByTestId("delete-elc-item")
			.first()
			.click();
		cy.get(".list-item")
			.contains("item c")
			.should("not.be.visible");
		cy.get(".list-item")
			.contains("item b")
			.should("be.visible");
		cy.closePanel();
		cy.goToPage("staff");
		cy.goToPage("patients");
		cy.get(".clickable")
			.first()
			.click();
		cy.get(".ms-Panel-content").scrollTo("bottom");
		cy.get(".list-item")
			.contains("item c")
			.should("not.be.visible");
		cy.get(".list-item")
			.contains("item b")
			.should("be.visible");
	});
});
