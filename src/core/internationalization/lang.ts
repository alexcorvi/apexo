import { setting } from "@modules";
import { observable } from "mobx";

class Translate {
	languages: {
		code: string;
		RTL: boolean;
		loadTerms: () => Promise<{ [key: string]: string }>;
	}[] = [
		{
			code: "ar",
			RTL: true,
			loadTerms: async () => {
				return (await import("./languages/ar")).default;
			}
		}
	];

	@observable terms: { [key: string]: string } = {};

	@observable loadedCode: string = "en";

	constructor() {
		setInterval(async () => {
			const languageCode = setting.getSetting("lang");
			if (languageCode !== this.loadedCode) {
				this.loadedCode = languageCode;
				const newLang = this.languages.find(
					l => l.code === languageCode
				);
				if (newLang) {
					if (newLang.RTL) {
						this.setRTL();
					} else {
						this.unsetRTL();
					}
					this.terms = await newLang.loadTerms();
				}
			}
		}, 100);
	}

	private setRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
	}

	private unsetRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
	}

	text(term: string) {
		return this.terms[term] || term;
	}
}

export const translate = new Translate();

export function text(term: string) {
	return translate.text(term);
}
