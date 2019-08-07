/// <reference types="cypress" />
/// <reference types="../../cypress" />

beforeEach(() => {
	cy.visit("http://localhost:8000");
	cy.online();
});

const tout = 100 * 1000;

describe("Logging in while online", () => {
	it("Using active cookie", () => {
		cy.getByTestId("input-identification").type("test");
		cy.getByTestId("input-password").type("test");
		cy.getByTestId("proceed-primary").click();
		cy.getByTestId("user-chooser", timeout)
			.first()
			.click();
		cy.ensureLoginType("login-credentials-online");
		cy.reload();
		cy.wait(2000);
		cy.ensureLoginType("initial-active-session");
		cy.clearCookies();
	});
	it("With no server", () => {
		cy.get(".no-server-mode").click();
		cy.resetEverything();
		cy.reload();
		cy.resetEverything();
		cy.get(".no-server-mode").click();
		cy.getByTestId("new-user-name")
			.type("Alex")
			.type("{enter}");
		cy.ensureLoginType("no-server");
	});
	describe("Entering credentials", () => {
		it("Entering invalid credentials", () => {
			cy.getByTestId("input-identification").type("invalid");
			cy.getByTestId("input-password").type("invalid");
			cy.getByTestId("proceed-primary").click();
			cy.getByTestId("error-msg")
				.should("exist")
				.should("contain", "is incorrect");
		});

		it("entering valid credentials", () => {
			cy.getByTestId("input-identification").type("test");
			cy.getByTestId("input-password").type("test");
			cy.getByTestId("proceed-primary").click();
			cy.getByTestId("user-chooser", timeout)
				.first()
				.click();
			cy.ensureLoginType("login-credentials-online");
			cy.clearCookies();
		});
	});
});

describe("Logging in while offline", () => {
	describe("With server", () => {
		beforeEach(() => {
			cy.resetEverything();
			cy.getByTestId("input-identification").type("test");
			cy.getByTestId("input-password").type("test");
			cy.getByTestId("proceed-primary").click();
			cy.getByTestId("user-chooser", timeout)
				.first()
				.click();
			cy.ensureLoginType("login-credentials-online");
		});
		describe("Manually entering credentials", () => {
			beforeEach(() => {
				cy.window().then(win => win.localStorage.removeItem("LSL_TS"));
				cy.offline();
				cy.reload();
				cy.get(".offline-msg")
					.should("exist")
					.should("contain", "Use the latest");
			});
			it("Entering invalid credentials", () => {
				cy.getByTestId("input-identification").type("invalid");
				cy.getByTestId("input-password").type("invalid");
				cy.getByTestId("proceed-primary").click();
				cy.getByTestId("error-msg")
					.should("exist")
					.should("contain", "not the last");
			});

			it("Entering valid credentials", () => {
				cy.getByTestId("input-identification")
					.clear()
					.type("test");
				cy.getByTestId("input-password")
					.clear()
					.type("test");
				cy.getByTestId("proceed-primary").click();
				cy.wait(2000);
				cy.ensureLoginType("login-credentials-offline");
			});
		});
		it("Using active hash with timestamp", () => {
			cy.offline();
			cy.reload();
			cy.wait(2000);
			cy.ensureLoginType("initial-lsl-hash-ts");
		});
	});

	it("With no server", () => {
		cy.resetEverything();
		cy.offline();
		cy.getByTestId("impossible");
		cy.get(".no-server-mode").click();
		cy.getByTestId("new-user-name")
			.type("Alex")
			.type("{enter}");
		cy.ensureLoginType("no-server");
	});
});

describe("MISC", () => {
	it("Impossible", () => {
		cy.offline();
		cy.getByTestId("impossible").should("exist");
		cy.online();
	});
	it("Pressing enter", () => {
		cy.getByTestId("input-identification").type("{enter}");
		cy.getByTestId("error-msg")
			.should("exist")
			.should("contain", "fields are necessary");
		cy.reload();
		cy.getByTestId("input-password").type("{enter}");
		cy.getByTestId("error-msg")
			.should("exist")
			.should("contain", "fields are necessary");
	});
	it("Using PIN", () => {
		cy.resetEverything();
		cy.reload();
		cy.get(".no-server-mode").click();
		cy.getByTestId("new-user-name")
			.type("Alex")
			.type("{enter}");
		cy.ensureLoginType("no-server");
		cy.goToPage("staff");
		cy.get(".permission")
			.first()
			.click();
		cy.get("#login-pin").slowType("1234");
		cy.getByTestId("close-panel").click();
		cy.goToPage("patients");
		cy.goToPage("staff");
		cy.get(".permission")
			.first()
			.click();
		cy.get("#login-pin").should("contain.value", "1234");
		cy.getByTestId("close-panel").click();
		cy.getByTestId("expand-user").click();
		cy.getByTestId("logout").click();
		cy.wait(1000);
		cy.get(".no-server-mode").click();
		cy.wait(1000);
		cy.getByTestId("user-chooser")
			.first()
			.click();
		cy.getByTestId("modal-input").type("12345");
		cy.getByTestId("modal-confirm").click();
		cy.getByTestId("message").should("contain", "Invalid PIN");
		cy.getByTestId("user-chooser")
			.first()
			.click();
		cy.getByTestId("modal-input").type("1234");
		cy.getByTestId("modal-confirm").click();
		cy.ensureLoginType("no-server");
	});
});
