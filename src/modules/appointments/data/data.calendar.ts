import { computed, observable } from "mobx";
import { lang } from "../../../core/i18/i18";
import * as dateUtils from "../../../assets/utils/date";

interface WeekDayInfo {
	index: number;
	day: string;
	dayShort: string;
}

export class Calendar {
	// constants
	// currents
	currentYear: number = new Date().getFullYear();
	currentMonth: number = new Date().getMonth();
	currentDay: number = new Date().getDate() - 1;

	// selected
	@observable selectedYear: number = this.currentYear;
	@observable selectedMonth: number = this.currentMonth;
	@observable selectedDay: number = this.currentDay;

	@computed
	get selectedMonthDays() {
		const days: {
			date: number;
			weekDay: WeekDayInfo;
		}[] = [];
		const numberOfDays = this.numberOfDays(
			this.selectedMonth,
			this.selectedYear
		);
		for (let date = 0; date < numberOfDays; date++) {
			days.push({
				date,
				weekDay: this.getDayOfTheWeek(
					this.selectedYear,
					this.selectedMonth,
					date + 1
				)
			});
		}
		return days;
	}
	@computed
	get selectedWeek() {
		const selectedDay = this.selectedMonthDays[this.selectedDay];
		const selectedWeek: { date: number; weekDay: WeekDayInfo }[] = [
			selectedDay
		];
		// look back
		if (selectedDay.weekDay.index !== 0 && selectedDay.date !== 0) {
			for (let index = this.selectedDay - 1; true; index--) {
				const day = this.selectedMonthDays[index];
				selectedWeek.push(day);
				if (day.weekDay.index === 0 || day.date === 0) {
					break;
				}
			}
		}
		// look forward
		if (
			selectedDay.weekDay.index !== 6 &&
			selectedDay.date + 1 !== this.selectedMonthDays.length
		) {
			for (let index = this.selectedDay + 1; true; index++) {
				const day = this.selectedMonthDays[index];
				selectedWeek.push(day);
				if (
					day.weekDay.index === 6 ||
					day.date + 1 === this.selectedMonthDays.length
				) {
					break;
				}
			}
		}
		return selectedWeek.sort((dayA, dayB) => dayA.date - dayB.date);
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

	getDayOfTheWeek(year: number, month: number, day: number): WeekDayInfo {
		const index = new Date(year, month, day).getDay();
		return {
			index,
			day: dateUtils.name.days()[index],
			dayShort: dateUtils.name.daysShort()[index]
		};
	}

	selectDayByTimeStamp(timestamp: number) {
		const d = new Date(timestamp);
		this.selectedYear = d.getFullYear();
		this.selectedMonth = d.getMonth();
		this.selectedDay = d.getDate() - 1;
	}
}
