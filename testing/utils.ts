const ipcRenderer = require("electron").ipcRenderer;

export function elExists(query: string): boolean {
	return !!document.querySelector(query);
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
