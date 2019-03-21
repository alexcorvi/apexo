import t4mat from "t4mat";
import { lang } from "../../core/i18/i18";

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

export function unifiedDateFormat(d: Date | number) {
	if (typeof d === "number") {
		d = new Date(d);
	}

	return `${d!.getDate()} ${
		name.monthsShort()[d!.getMonth()]
	}'${d!.getFullYear() - 2000}`;
}

export const name = {
	daysShort: () => [
		lang("SU"),
		lang("MO"),
		lang("TU"),
		lang("WE"),
		lang("TH"),
		lang("FR"),
		lang("SA")
	],

	days: () => [
		lang("Sunday"),
		lang("Monday"),
		lang("Tuesday"),
		lang("Wednesday"),
		lang("Thursday"),
		lang("Friday"),
		lang("Saturday")
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
