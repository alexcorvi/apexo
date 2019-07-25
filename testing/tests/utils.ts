const ipcRenderer = require("electron").ipcRenderer;

export const timeout = 15000;

export const assert = {
	elExists(query: string) {
		if (!document.querySelector(query)) {
			throw Error(`Element "${query}" does not exist`);
		}
	},
	elContains(query: string, string: string) {
		const el: HTMLElement | null = document.querySelector(query);
		if (!el) {
			throw Error(`Element "${query}" does not exist`);
		} else if (el.innerText.indexOf(string) === -1) {
			throw Error(
				`Element "${query}" does not have text: "${string}", instead it has the following: ${el.innerText.replace(
					/\s+/g,
					" "
				)}`
			);
		}
	},
	elValue(query: string, value: string) {
		const el: HTMLInputElement | null = document.querySelector(query);
		if (!el) {
			throw Error(`Element "${query}" does not exist`);
		} else if (el.value !== value) {
			throw Error(
				`Input "${query}" does not have value: "${value}", instead it has the following: ${el.value.replace(
					/\s+/g,
					" "
				)}`
			);
		}
	},
	attribute(query: string, attribute: string, expectedValue: string) {
		const el: HTMLElement | null = document.querySelector(query);
		if (!el) {
			throw Error(`Element "${query}" does not exist`);
		} else {
			const attrVal = el.getAttribute(attribute);
			if (!attrVal) {
				throw Error(
					`Element "${query}" does not have attribute ${attribute}`
				);
			} else if (attrVal !== expectedValue) {
				throw Error(
					`Element "${query}" attribute is equal to ${attrVal}, not ${expectedValue}`
				);
			}
		}
	}
};

export const interact = {
	async typeIn(query: string, string: string) {
		return new Promise(resolve => {
			const el = document.querySelector(query) as HTMLInputElement;
			el.focus();
			ipcRenderer.send("type", string);
			const i = setInterval(() => {
				if (el.value === string) {
					clearInterval(i);
					resolve();
				}
			}, 10);
		});
	},
	async waitAndClick(query: string) {
		await this.waitForEl(query);
		const el = document.querySelector(query) as HTMLInputElement;
		el.click();
	},
	async waitAndInput(query: string, input: string) {
		await this.waitForEl(query);
		await this.typeIn(query, input);
	},
	async waitForEl(query: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const initTime = new Date().getTime();
			const i = setInterval(() => {
				if (document.querySelector(query)) {
					clearInterval(i);
					resolve();
				} else if (new Date().getTime() - initTime > timeout) {
					clearInterval(i);
					reject(`Timeout: could not find element "${query}"`);
				}
			}, 10);
		});
	}
};

export const app = {
	async resync() {
		await (window as any).resyncApp();
	},

	async reset({ retainLSLHash }: { retainLSLHash?: boolean } = {}) {
		await new Promise(resolve => setTimeout(resolve, 1000));
		await app.resync();
		await (window as any).resetApp(retainLSLHash);
	},

	async goToPage(namespace: string) {
		await interact.waitAndClick("#expand-menu");
		await interact.waitAndClick(`[title="${namespace}"].ms-Nav-link`);
	},

	async removeCookies() {
		await (window as any).removeCookies();
	}
};

export const test = {
	async offline() {
		return new Promise(resolve => {
			console.log("taking it offline");
			(window as any).emulateOffline();
			ipcRenderer.send("offline");
			test.onFail(async () => await test.online());
			resolve();
		});
	},

	async online() {
		return new Promise(resolve => {
			console.log("bringing it back online");
			(window as any).disableOfflineEmulation();
			ipcRenderer.send("online");
			resolve();
		});
	},
	onFailCallback: async () => {},

	async onFail(callback: () => Promise<any>) {
		this.onFailCallback = callback;
	}
};
