import { setting } from "@modules";
import { dateNames } from "@utils";
import { action, computed, observable } from "mobx";

export interface WeekDayInfo {
	dayLiteral: string;
	dayLiteralShort: string;
	isWeekend: boolean;
}

export interface DayInfo {
	dateNum: number;
	weekDay: WeekDayInfo;
}

export class Calendar {
	// currents
	currentYear: number = new Date().getFullYear();
	currentMonth: number = new Date().getMonth();
	currentDay: number = new Date().getDate();

	@observable selected: { year: number; month: number; day: number } = {
		year: this.currentYear,
		month: this.currentMonth,
		day: this.currentDay
	};

	@computed get weekendsOn(): number {
		return isNaN(Number(setting.getSetting("weekend_num")))
			? 6
			: Number(setting.getSetting("weekend_num"));
	}

	@computed get selectedMonthCalendar() {
		const month: DayInfo[][] = [[]];

		const numberOfDays = this.numberOfDays(
			this.selected.month,
			this.selected.year
		);

		for (let date = 0; date < numberOfDays; date++) {
			const obj = new Date(
				this.selected.year,
				this.selected.month,
				date + 1
			);
			const dayLiteral = obj.toLocaleDateString("en-us", {
				weekday: "long"
			});
			const dayLiteralShort = obj.toLocaleDateString("en-us", {
				weekday: "short"
			});
			const isWeekend =
				dateNames.days(true).indexOf(dayLiteral) === this.weekendsOn;
			month[month.length - 1].push({
				dateNum: date + 1,
				weekDay: {
					dayLiteral,
					dayLiteralShort,
					isWeekend
				}
			});
			if (isWeekend) {
				month.push([]);
			}
		}

		return month;
	}

	@computed
	get selectedMonthDays(): DayInfo[] {
		return this.selectedMonthCalendar.reduce((month: DayInfo[], week) => {
			week.forEach(day => month.push(day));
			return month;
		}, []);
	}

	@computed
	get selectedWeekDays(): DayInfo[] {
		let week: DayInfo[] = [];
		for (let wi = 0; wi < this.selectedMonthCalendar.length; wi++) {
			const w = this.selectedMonthCalendar[wi];
			for (let di = 0; di < w.length; di++) {
				const d = w[di];
				if (d.dateNum === this.selected.day) {
					week = w;
					return week;
				}
			}
		}
		return week;
	}

	select({
		year,
		month,
		day
	}: {
		year?: number;
		month?: number;
		day?: number;
	}) {
		if (typeof year === "number") {
			this.selected.year = year;
		}
		if (typeof month === "number") {
			this.selected.month = month;
		}
		if (typeof day === "number") {
			this.selected.day = day;
		}
		console.log(this.selectedWeekDays.map(x => x.dateNum));
	}

	numberOfDays(month: number, year: number): number {
		let numberOfDays = 28;
		for (; numberOfDays < 32; numberOfDays++) {
			if (new Date(year, month, numberOfDays + 1).getMonth() !== month) {
				return numberOfDays;
			}
		}
		return numberOfDays;
	}
}

export const calendar = observable(new Calendar());
