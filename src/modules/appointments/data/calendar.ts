import { setting } from "@modules";
import { dateNames, day } from "@utils";
import { action, computed, observable } from "mobx";

export interface WeekDayInfo {
	dayLiteral: string;
	dayLiteralShort: string;
	isWeekend: boolean;
}

export interface DayInfo {
	dateNum: number;
	monthNum: number;
	yearNum: number;
	weekDay: WeekDayInfo;
}

export class Calendar {
	// currents
	currentYear: number = new Date().getFullYear();
	currentMonth: number = new Date().getMonth();
	currentDay: number = new Date().getDate();

	@observable highlightedIndex: 0 | 1 | 2 = 1;

	@observable selected: { year: number; month: number; day: number } = {
		year: this.currentYear,
		month: this.currentMonth,
		day: this.currentDay
	};

	@computed get weekendsOn(): number {
		return isNaN(Number(setting!.getSetting("weekend_num")))
			? 6
			: Number(setting!.getSetting("weekend_num"));
	}

	@computed get weeksCalendar() {
		let pointer = new Date(this.selected.year, 0, 1).getTime();
		let weeks: DayInfo[][] = [[]];
		while (true) {
			const dateObj = new Date(pointer);
			const dayLiteral = dateObj.toLocaleDateString("en-us", {
				weekday: "long"
			});
			const dayLiteralShort = dateObj.toLocaleDateString("en-us", {
				weekday: "short"
			});
			const isWeekend =
				dateNames.days().indexOf(dayLiteral) === this.weekendsOn;
			weeks[weeks.length - 1].push({
				dateNum: dateObj.getDate(),
				monthNum: dateObj.getMonth(),
				yearNum: dateObj.getFullYear(),
				weekDay: {
					dayLiteral,
					dayLiteralShort,
					isWeekend
				}
			});
			if (isWeekend) {
				weeks.push([]);
			}
			pointer = pointer + day;
			if (new Date(pointer).getFullYear() !== this.selected.year) {
				break;
			}
		}
		weeks = weeks.filter(x => x.length);

		// correcting the first week
		while (weeks[0].length !== 7) {
			const dateObj = new Date(
				new Date(
					weeks[0][0].yearNum,
					weeks[0][0].monthNum,
					weeks[0][0].dateNum
				).getTime() - day
			);
			const dayLiteral = dateObj.toLocaleDateString("en-us", {
				weekday: "long"
			});
			const dayLiteralShort = dateObj.toLocaleDateString("en-us", {
				weekday: "short"
			});
			const isWeekend =
				dateNames.days().indexOf(dayLiteral) === this.weekendsOn;
			weeks[0].unshift({
				dateNum: dateObj.getDate(),
				monthNum: dateObj.getMonth(),
				yearNum: dateObj.getFullYear(),
				weekDay: {
					dayLiteral,
					dayLiteralShort,
					isWeekend
				}
			});
		}

		// correcting the last week
		while (weeks[weeks.length - 1].length !== 7) {
			const dateObj = new Date(
				new Date(
					weeks[weeks.length - 1][
						weeks[weeks.length - 1].length - 1
					].yearNum,
					weeks[weeks.length - 1][
						weeks[weeks.length - 1].length - 1
					].monthNum,
					weeks[weeks.length - 1][
						weeks[weeks.length - 1].length - 1
					].dateNum
				).getTime() + day
			);
			const dayLiteral = dateObj.toLocaleDateString("en-us", {
				weekday: "long"
			});
			const dayLiteralShort = dateObj.toLocaleDateString("en-us", {
				weekday: "short"
			});
			const isWeekend =
				dateNames.days().indexOf(dayLiteral) === this.weekendsOn;
			weeks[weeks.length - 1].push({
				dateNum: dateObj.getDate(),
				monthNum: dateObj.getMonth(),
				yearNum: dateObj.getFullYear(),
				weekDay: {
					dayLiteral,
					dayLiteralShort,
					isWeekend
				}
			});
		}
		return weeks;
	}

	@computed get overview() {
		return [
			this.weeksCalendar[this.selectedWeekIndex - 1],
			this.weeksCalendar[this.selectedWeekIndex],
			this.weeksCalendar[this.selectedWeekIndex + 1]
		].filter(x => x);
	}

	@computed get selectedWeekIndex() {
		return this.weeksCalendar.findIndex(x =>
			x.find(
				y =>
					y.dateNum === this.selected.day &&
					y.monthNum === this.selected.month &&
					y.yearNum === this.selected.year
			)
		);
	}

	@computed get selectedWeek() {
		return this.weeksCalendar[this.selectedWeekIndex] || [];
	}

	@computed get currentWeek() {
		return (
			this.weeksCalendar.find(x =>
				x.find(
					y =>
						y.dateNum === this.currentDay &&
						y.monthNum === this.currentMonth &&
						y.yearNum === this.currentYear
				)
			) || []
		);
	}
}

export const calendar = observable(new Calendar());
