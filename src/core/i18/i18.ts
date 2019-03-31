import languages from "./languages/";
import setting from "../../modules/settings/data/data.settings";

function setRTL() {
	document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
}

function unsetRTL() {
	document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
}

export function lang(term: string) {
	const currentLanguageCode = setting.getSetting("lang");
	const currentLanguage = languages.find(
		x => x.code === currentLanguageCode
	) || { RTL: false, code: "", terms: {} };

	if (currentLanguage.RTL) {
		setRTL();
	} else {
		unsetRTL();
	}

	return currentLanguage.terms[term] || term;
}
