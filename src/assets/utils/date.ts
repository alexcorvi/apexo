import { lang } from "../../core/i18/i18";
import setting from "../../modules/settings/data/data.settings";

export function comparableTime(date: Date) {
	return {
		y: date.getFullYear(),
		m: date.getMonth(),
		d: date.getDate()
	};
}

export function isToday(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(comparableTime(new Date()))
	);
}

export function isYesterday(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(
			comparableTime(new Date(new Date().getTime() - 86400000))
		)
	);
}

export function isTomorrow(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(
			comparableTime(new Date(new Date().getTime() + 86400000))
		)
	);
}

export function unifiedDateFormat(d: Date | number | undefined) {
	if (typeof d === "number") {
		d = new Date(d);
	}

	if (typeof d === "undefined") {
		d = new Date(0);
	}

	const dateFormat = setting.getSetting("date_format");
	if (dateFormat === "dd/mm/yyyy") {
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	} else if (dateFormat === "mm/dd/yyyy") {
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
	} else {
		return `${d!.getDate()} ${
			name.monthsShort()[d!.getMonth()]
		}'${d!.getFullYear() - 2000}`;
	}
}

export const name = {
	daysShort: () =>
		name.days(true).map(x => lang(x.substr(0, 2).toUpperCase())),

	days: (skip?: boolean) => [
		lang("Monday" + (skip ? "_" : "")).replace("_", ""),
		lang("Tuesday" + (skip ? "_" : "")).replace("_", ""),
		lang("Wednesday" + (skip ? "_" : "")).replace("_", ""),
		lang("Thursday" + (skip ? "_" : "")).replace("_", ""),
		lang("Friday" + (skip ? "_" : "")).replace("_", ""),
		lang("Saturday" + (skip ? "_" : "")).replace("_", ""),
		lang("Sunday" + (skip ? "_" : "")).replace("_", "")
	],
	monthsShort: () => [
		lang("Jan"),
		lang("Feb"),
		lang("Mar"),
		lang("Apr"),
		lang("May"),
		lang("Jun"),
		lang("Jul"),
		lang("Aug"),
		lang("Sep"),
		lang("Oct"),
		lang("Nov"),
		lang("Dec")
	],
	months: () => [
		lang("January"),
		lang("February"),
		lang("March"),
		lang("April"),
		lang("May"),
		lang("June"),
		lang("July"),
		lang("August"),
		lang("September"),
		lang("October"),
		lang("November"),
		lang("December")
	]
};

export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
export const week = day * 7;
export const month = day * 30;
