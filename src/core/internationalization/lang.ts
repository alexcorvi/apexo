import { raw } from "./languages/raw";
import { setting } from "@modules";
import { observable } from "mobx";

class Translate {
	languages: {
		code: string;
		RTL: boolean;
		localName: string;
		loadTerms: () => Promise<{ [key: string]: string }>;
	}[] = [
		{
			localName: "عربي",
			code: "ar",
			RTL: true,
			loadTerms: async () => {
				return (await import("./languages/ar")).default;
			},
		},
		{
			localName: "Espanol",
			code: "es",
			RTL: false,
			loadTerms: async () => {
				return (await import("./languages/es")).default;
			},
		},
		{
			localName: "English",
			code: "en",
			RTL: false,
			loadTerms: async () => {
				return {};
			},
		},
		{
			localName: "中文",
			code: "zh-cn",
			RTL: false,
			loadTerms: async () => {
				return (await import("./languages/zh-cn")).default;
			},
		},

		{
			localName: "Deutsche",
			code: "de",
			RTL: false,
			loadTerms: async () => {
				return (await import("./languages/de")).default;
			},
		},
	];

	@observable terms: { [key: string]: string } = {};

	@observable loadedCode: string = "en";

	constructor() {
		const i = setInterval(() => {
			if (setting) {
				this.checkLang();
				setting.onSettingChange(() => this.checkLang());
				clearInterval(i);
			}
		}, 100);
	}

	private async checkLang() {
		const languageCode = setting ? setting.getSetting("lang") : "en";
		if (languageCode !== this.loadedCode) {
			const newLang = this.languages.find((l) => l.code === languageCode);
			if (newLang) {
				if (newLang.RTL) {
					this.setRTL();
				} else {
					this.unsetRTL();
				}
				this.loadedCode = languageCode;
				this.terms = await newLang.loadTerms();
			}
		}
	}

	private setRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
	}

	private unsetRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
	}

	text(term: string) {
		this.checkLang();
		return this.terms[term] || term;
	}
}

export const translate = new Translate();

class ResultTerm extends String {
	get c() {
		return this[0].toUpperCase() + this.substr(1);
	}
	get h() {
		return this.split(" ")
			.map((x) => x[0].toUpperCase() + x.substr(1))
			.join(" ");
	}
	get r() {
		return this.substr(0);
	}
}

export function text(term: keyof typeof raw) {
	// return new ResultTerm("$"); // for testing purposes
	return new ResultTerm(translate.text(term));
}
