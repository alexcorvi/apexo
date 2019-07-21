const ipcRenderer = require("electron").ipcRenderer;

export function elExists(query: string): boolean {
	return !!document.querySelector(query);
}

export async function typeIn(query: string, string: string) {
	return new Promise(resolve => {
		const el = document.querySelector(query) as HTMLInputElement;
		el.focus();
		ipcRenderer.send("type", string);
		const i = setInterval(() => {
			if (el.value === string) {
				clearInterval(i);
				resolve();
			} else {
				console.log(el.value);
			}
		}, 10);
	});
}

export async function waitAndClick(query: string) {
	await waitForEl(query);
	click(query);
}

export async function waitAndInput(query: string, input: string) {
	await waitForEl(query);
	await typeIn(query, input);
}

export function click(query: string) {
	const el = document.querySelector(query) as HTMLInputElement;
	el.click();
}

export function waitForEl(query: string): Promise<void> {
	return new Promise(resolve => {
		const i = setInterval(() => {
			if (elExists(query)) {
				clearInterval(i);
				resolve();
			}
		}, 10);
	});
}

export async function reset() {
	await (window as any).resetApp();
}
