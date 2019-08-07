/// <reference types="cypress" />
/// <reference types="../../cypress" />

beforeEach(() => {
	cy.visit("http://localhost:8000");
	cy.online();
	cy.getByTestId("input-identification").type("test");
	cy.getByTestId("input-password").type("test");
	cy.getByTestId("proceed-primary").click();
	cy.getByTestId("user-chooser", timeout)
		.first()
		.click();
});

afterEach(() => {
	cy.clearCookies();
	cy.resetEverything();
});

const timeout = 100 * 1000;

describe("interactions", () => {
	it("clicking menu button", () => {
		cy.getByTestId("expand-menu").click();
		cy.getByTestId("menu-sd").should("be.visible");
	});
	it("clicking user panel", () => {
		cy.getByTestId("expand-user").click();
		cy.getByTestId("user-panel").should("be.visible");
	});
	it("clicking resync button", () => {
		cy.getByTestId("resync").click();
		cy.getByTestId("resync").should("have.class", "rotate");
	});
});

describe("Viewing", () => {
	it("showing online/offline status", () => {
		cy.online();
		cy.getByTestId("resync").should("be.visible");
		cy.offline();
		cy.getByTestId("offline").should("be.visible");
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
