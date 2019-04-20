import "../mocks/browser-mocks";
import {
	comparableDate,
	day,
	formatDate,
	getDayStartingPoint,
	isToday,
	isTomorrow,
	isYesterday
	} from "@utils";

describe("@utils: date basic functions", () => {
	it("starting point", () => {
		const timeStampCurrently = new Date().getTime();
		const obj = new Date(timeStampCurrently);
		const timeStampAtStart = new Date(
			obj.getFullYear(),
			obj.getMonth(),
			obj.getDate()
		).getTime();
		expect(getDayStartingPoint(timeStampAtStart)).toBe(timeStampAtStart);
	});

	it("comparable date", () => {
		const saturday = new Date(1555749265167);
		const alsoSaturday = new Date(1555724079303);
		const sunday = new Date(1555749265167 + day);

		expect(
			JSON.stringify(comparableDate(saturday)) ===
				JSON.stringify(comparableDate(alsoSaturday))
		).toBe(true);

		expect(
			JSON.stringify(comparableDate(saturday)) ===
				JSON.stringify(comparableDate(sunday))
		).toBe(false);
	});

	it("isToday, isYesterday, isTomorrow", () => {
		const today = new Date().getTime();
		const yesterday = new Date(today - day).getTime();
		const tomorrow = new Date(today + day).getTime();

		expect(isToday(today)).toBe(true);
		expect(isToday(yesterday)).toBe(false);
		expect(isToday(tomorrow)).toBe(false);

		expect(isYesterday(today)).toBe(false);
		expect(isYesterday(yesterday)).toBe(true);
		expect(isYesterday(tomorrow)).toBe(false);

		expect(isTomorrow(today)).toBe(false);
		expect(isTomorrow(yesterday)).toBe(false);
		expect(isTomorrow(tomorrow)).toBe(true);
	});
});

describe("@utils: date formatting", () => {
	const formatA = "dd/mm/yyyy";
	const formatB = "mm/dd/yyyy";
	const formatC = "anything else";

	const formatA_Res = "20/4/2019";
	const formatB_Res = "4/20/2019";
	const formatC_Res = "20 Apr'19";

	const timestamp = 1555753115814;
	const dateObj = new Date(timestamp);

	it("formats date (using format A) with timestamp", () => {
		expect(formatDate(timestamp, formatA)).toBe(formatA_Res);
	});

	it("formats date (using format A) with date object", () => {
		expect(formatDate(dateObj, formatA)).toBe(formatA_Res);
	});

	it("formats date (using format B) with timestamp", () => {
		expect(formatDate(timestamp, formatB)).toBe(formatB_Res);
	});

	it("formats date (using format B) with date object", () => {
		expect(formatDate(dateObj, formatB)).toBe(formatB_Res);
	});

	it("formats date (using format C) with timestamp", () => {
		expect(formatDate(timestamp, formatC)).toBe(formatC_Res);
	});

	it("formats date (using format C) with date object", () => {
		expect(formatDate(dateObj, formatC)).toBe(formatC_Res);
	});
});
