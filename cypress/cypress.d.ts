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
		getInputByLabel(
			label: string,
			type?: string
		): Chainable<JQuery<HTMLElement>>;
		ensureLoginType(type: string): void;
		ensurePage(namespace: string): void;
		goToPage(namespace: string): void;
		slowType(input: string): void;
		closePanel(): void;
		clickItem(contains: string): void;
		clickBtn(contains: string): void;
		clickTabByIcon(icon: string): void;
		chooseFromDropdown(className: string, choice: string | number): void;
		pickDate(
			className: string,
			pick:
				| "today"
				| "tomorrow"
				| "yesterday"
				| "past-month"
				| "next-month"
		): void;
	}
}
