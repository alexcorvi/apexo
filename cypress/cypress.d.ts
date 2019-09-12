declare namespace Cypress {
	interface Chainable {
		offline(): void;
		online(): void;
		resetEverything(): void;
		solveMath(): void;
		getByTestId(
			testid: string,
			timeout?: number
		): Chainable<JQuery<HTMLElement>>;
		ensureLoginType(type: string): void;
		ensurePage(namespace: string): void;
		goToPage(namespace: string): void;
		slowType(input: string): void;
		closePanel(): void;
		clickTabByIcon(icon: string): void;
		chooseFromDropdown(className: string, choice: string | number): void;
		pickDate(
			className: string,
			pick: "today" | "tomorrow" | "yesterday"
		): void;
	}
}
