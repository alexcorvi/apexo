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

Cypress.Commands.add("closePanel", () => {
	cy.get(`[data-icon-name="cancel"]`)
		.last()
		.click();
});

Cypress.Commands.add("solveMath", () => {
	cy.get(".math-question")
		.invoke("text")
		.then(x => {
			// tslint:disable-next-line:no-eval
			const res = eval(((x as unknown) as string).replace("=", ""));
			cy.get(".math-question .ms-TextField-field").type(res);
		});
});

Cypress.Commands.add(
	"pickDate",
	(
		datePickerClassName: string,
		pick: "today" | "tomorrow" | "yesterday" | "next-month" | "past-month"
	) => {
		cy.get(`.${datePickerClassName}`).click();
		if (pick === "today") {
			cy.get(".ms-DatePicker-day--today")
				.parent()
				.click();
		} else if (pick === "next-month" || pick === "past-month") {
			if (pick === "past-month") {
				cy.get(".ms-DatePicker-prevMonth").click();
			} else if (pick === "next-month") {
				cy.get(".ms-DatePicker-nextMonth").click();
			}
			cy.get(".ms-DatePicker-day--infocus")
				.first()
				.click();
		} else {
			const now = new Date().getTime();
			const target =
				pick === "tomorrow" ? now + 86400000 : now - 86400000;
			const nowMonth = new Date(now).getMonth();
			const targetMonth = new Date(target).getMonth();
			if (nowMonth !== targetMonth && pick === "tomorrow") {
				cy.get(".ms-DatePicker-nextMonth").click();
			}
			if (nowMonth !== targetMonth && pick === "yesterday") {
				cy.get(".ms-DatePicker-prevMonth").click();
			}
			cy.get(".ms-DatePicker-day--infocus")
				.contains(new Date(target).getDate().toString())
				.click();
		}
	}
);

Cypress.Commands.add("ensurePage", namespace => {
	cy.get(
		`[data-current-namespace="${namespace.toLowerCase()}"]#router-outlet`
	);
});

Cypress.Commands.add("clickTabByIcon", (icon: string) => {
	cy.get(`.ms-Pivot-icon [data-icon-name="${icon}"]`).click();
});

Cypress.Commands.add(
	"chooseFromDropdown",
	(dropdownClassName: string, choice: string | number) => {
		cy.get(`.${dropdownClassName}`).click();
		if (typeof choice === "string") {
			cy.get(`[role="option"][title="${choice}"]`).click();
		} else {
			cy.get(`[role="option"]`)
				.eq(choice)
				.click();
		}
	}
);

Cypress.Commands.add("clickItem", (contains: string) => {
	cy.get(".ms-Persona")
		.contains(contains)
		.click();
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

Cypress.Commands.add("getInputByLabel", (label: string, type?: string) => {
	return cy
		.get(".ms-TextField")
		.contains(label)
		.parent()
		.find(type ? type : "input");
});

Cypress.Commands.add("clickBtn", (text: string) => {
	cy.get(".ms-Button")
		.contains(text)
		.click();
});
