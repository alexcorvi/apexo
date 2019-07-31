/// <reference types="cypress" />
/// <reference types="../cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("offline", () => {
	cy.window().then(win => (win as any).emulateOffline());
});

Cypress.Commands.add("online", () => {
	cy.window().then(win => (win as any).disableOfflineEmulation());
});

Cypress.Commands.add("getByTestId", (testid, timeout = 4000) => {
	return cy.get(`[data-testid="${testid}"]`, { timeout });
});

Cypress.Commands.add("ensureLoginType", type => {
	cy.get(".header-component", { timeout: 5000 }).should(
		"have.attr",
		"data-login-type",
		type
	);
});

Cypress.Commands.add("resetEverything", type => {
	cy.window({ timeout: 10 * 1000 })
		.then(win => (win as any).hardResetApp())
		.then(x => {
			cy.clearCookies();
			cy.clearLocalStorage();
			(window as any).indexedDB.databases().then(r => {
				for (let i = 0; i < r.length; i++) {
					window.indexedDB.deleteDatabase(r[i].name);
				}
			});
		});
});

Cypress.Commands.add("goToPage", namespace => {
	cy.getByTestId("expand-menu").click();
	cy.get(`[title="${namespace.toLowerCase()}"].ms-Nav-link`).click();
	cy.ensurePage(namespace);
});

Cypress.Commands.add("ensurePage", namespace => {
	cy.get(
		`[data-current-namespace="${namespace.toLowerCase()}"]#router-outlet`
	);
});

Cypress.Commands.add(
	"slowType",
	{ prevSubject: "element" },
	(subject, input) => {
		input.split("").forEach(x => {
			cy.get(subject[0]).type(x);
			cy.wait(700);
		});
	}
);
