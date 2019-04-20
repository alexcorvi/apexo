export function getDayStartingPoint(t: number): number {
	return new Date(t).setHours(0, 0, 0, 0);
}

export function comparableDate(date: Date) {
	date.setHours(0, 0, 0, 0);
	return {
		y: date.getFullYear(),
		m: date.getMonth(),
		d: date.getDate()
	};
}

export function isToday(timestamp: number) {
	return (
		JSON.stringify(comparableDate(new Date(timestamp))) ===
		JSON.stringify(comparableDate(new Date()))
	);
}

export function isYesterday(timestamp: number) {
	return (
		JSON.stringify(comparableDate(new Date(timestamp))) ===
		JSON.stringify(
			comparableDate(new Date(new Date().getTime() - 86400000))
		)
	);
}

export function isTomorrow(timestamp: number) {
	return (
		JSON.stringify(comparableDate(new Date(timestamp))) ===
		JSON.stringify(
			comparableDate(new Date(new Date().getTime() + 86400000))
		)
	);
}

export function formatDate(d: Date | number | undefined, dateFormat: string) {
	if (typeof d === "number") {
		d = new Date(d);
	}

	if (typeof d === "undefined") {
		d = new Date(0);
	}

	if (dateFormat === "dd/mm/yyyy") {
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	} else if (dateFormat === "mm/dd/yyyy") {
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
	} else {
		return `${d!.getDate()} ${
			dateNames.monthsShort()[d!.getMonth()]
		}'${d!.getFullYear() - 2000}`;
	}
}

export const dateNames = {
	daysShort: () => dateNames.days().map(x => x.substr(0, 2).toUpperCase()),

	days: () => [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	],
	monthsShort: () => [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	],
	months: () => [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]
};

export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
export const week = day * 7;
export const month = day * 30;
