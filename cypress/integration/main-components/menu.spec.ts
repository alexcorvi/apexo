/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("menu", () => {
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

	describe("Big Menu", () => {
		it("Sorting", () => {
			cy.getByTestId("menu-item-bg")
				.first()
				.should("have.class", "bg-menu-item-home");

			cy.getByTestId("menu-item-bg")
				.last()
				.should("have.class", "bg-menu-item-settings");
		});
		it("Hovering", () => {
			cy.getByTestId("menu-item-bg")
				.first()
				.trigger("mouseover");
			cy.get(".menu-item-tt").should("contain.text", "Home");
			cy.getByTestId("menu-item-bg")
				.last()
				.trigger("mouseover");
			cy.get(".menu-item-tt").should("contain.text", "Settings");
		});
		it("Selecting", () => {
			cy.get(".bg-menu-item-home").should("have.class", "selected");
			cy.goToPage("patients");
			cy.get(".bg-menu-item-patients").should("have.class", "selected");
			cy.goToPage("appointments");
			cy.get(".bg-menu-item-appointments").should(
				"have.class",
				"selected"
			);
			cy.goToPage("settings");
			cy.get(".bg-menu-item-settings").should("have.class", "selected");
			cy.goToPage("staff");
			cy.get(".bg-menu-item-staff").should("have.class", "selected");
			cy.goToPage("treatments");
			cy.get(".bg-menu-item-treatments").should("have.class", "selected");
		});
	});

	describe("Mobile Menu", () => {
		it("Opening", () => {
			cy.getByTestId("expand-menu").click();
			cy.getByTestId("menu-sd").should("be.visible");
		});
		it("Selecting", () => {
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="home"]`).should(
				"have.class",
				"is-selected"
			);
			cy.get(".ms-Nav-link")
				.first()
				.type("{esc}");
			cy.goToPage("patients");
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="patients"]`).should(
				"have.class",
				"is-selected"
			);
			cy.get(".ms-Nav-link")
				.first()
				.type("{esc}");
			cy.goToPage("appointments");
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="appointments"]`).should(
				"have.class",
				"is-selected"
			);
			cy.get(".ms-Nav-link")
				.first()
				.type("{esc}");
			cy.goToPage("treatments");
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="treatments"]`).should(
				"have.class",
				"is-selected"
			);
			cy.get(".ms-Nav-link")
				.first()
				.type("{esc}");
			cy.goToPage("staff");
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="staff"]`).should(
				"have.class",
				"is-selected"
			);
			cy.get(".ms-Nav-link")
				.first()
				.type("{esc}");
			cy.goToPage("settings");
			cy.getByTestId("expand-menu").click();
			cy.get(`[data-testid="menu-item-sd"][title="settings"]`).should(
				"have.class",
				"is-selected"
			);
		});
	});
});
