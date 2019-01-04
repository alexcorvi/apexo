import { computed, observable } from 'mobx';

interface WeekDayInfo {
	index: number;
	day: string;
	dayShort: string;
}

export class Calendar {
	// constants
	daysShort = [ 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA' ];
	days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
	monthsShort = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
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
		const numberOfDays = this.numberOfDays(this.selectedMonth, this.selectedYear);
		for (let date = 0; date < numberOfDays; date++) {
			days.push({
				date,
				weekDay: this.getDayOfTheWeek(this.selectedYear, this.selectedMonth, date + 1)
			});
		}
		return days;
	}
	@computed
	get selectedWeek() {
		const selectedDay = this.selectedMonthDays[this.selectedDay];
		const selectedWeek: { date: number; weekDay: WeekDayInfo }[] = [ selectedDay ];
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
		if (selectedDay.weekDay.index !== 6 && selectedDay.date + 1 !== this.selectedMonthDays.length) {
			for (let index = this.selectedDay + 1; true; index++) {
				const day = this.selectedMonthDays[index];
				selectedWeek.push(day);
				if (day.weekDay.index === 6 || day.date + 1 === this.selectedMonthDays.length) {
					break;
				}
			}
		}
		return selectedWeek.sort((dayA, dayB) => dayA.date - dayB.date);
	}

	/**
     * Get the number of days in a specific month
     * 
     * @param {number} month 
     * @param {number} year 
     * @returns {number}
     * @memberof Calendar
     */
	numberOfDays(month: number, year: number): number {
		let numberOfDays = 28;
		for (; numberOfDays < 32; numberOfDays++) {
			if (new Date(year, month, numberOfDays + 1).getMonth() !== month) {
				return numberOfDays;
			}
		}
		return numberOfDays;
	}

	/**
     * Get the day of the week for a specific date
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @memberof Calendar
     */
	getDayOfTheWeek(year: number, month: number, day: number): WeekDayInfo {
		const index = new Date(year, month, day).getDay();
		return {
			index,
			day: this.days[index],
			dayShort: this.daysShort[index]
		};
	}

	/**
     * Switch selected days by passing a time stamp
     * 
     * @param {number} timestamp 
     * @memberof Calendar
     */
	selectDayByTimeStamp(timestamp: number) {
		const d = new Date(timestamp);
		this.selectedYear = d.getFullYear();
		this.selectedMonth = d.getMonth();
		this.selectedDay = d.getDate() - 1;
	}
}
