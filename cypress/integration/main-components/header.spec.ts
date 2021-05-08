/// <reference types="cypress" />
/// <reference types="../../cypress" />

const timeoutHeader = 100 * 1000;

describe("header", () => {
	describe("not requiring real server", () => {
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
		it("clicking menu button", () => {
			cy.getByTestId("expand-menu").click();
			cy.getByTestId("menu-sd").should("be.visible");
			cy.go("back");
		});
		it("clicking user panel", () => {
			cy.getByTestId("expand-user").click();
			cy.getByTestId("user-panel").should("be.visible");
			cy.go("back");
			cy.go("back");
		});
		it("showing namespace name", () => {
			cy.goToPage("staff");
			cy.getByTestId("page-title").should("contain.text", "staff");
			cy.goToPage("patients");
			cy.getByTestId("page-title").should("contain.text", "patients");
			cy.goToPage("appointments");
			cy.getByTestId("page-title").should("contain.text", "appointments");
		});
	});

	describe("requiring real server", () => {
		beforeEach(() => {
			cy.visit("http://localhost:8000");
			cy.clearCookies();
			cy.resetEverything();
			cy.reload();
			cy.online();
			cy.getByTestId("input-identification").type("test");
			cy.getByTestId("input-password").type("test");
			cy.getByTestId("proceed-primary").click();
			cy.getByTestId("user-chooser", timeoutHeader)
				.first()
				.click();
		});

		it("showing online/offline status", () => {
			cy.getByTestId("resync", 60 * 1000).should("be.visible");
			cy.getByTestId("resync").should("not.have.class", "error");
			cy.offline();
			cy.getByTestId("resync").should("have.class", "error");
		});

		it("clicking resync button", () => {
			cy.get(".clickable-sync", {
				timeout: 60 * 1000
			}).click({});
			cy.getByTestId("resync").should("have.class", "rotate");
		});
	});
});
