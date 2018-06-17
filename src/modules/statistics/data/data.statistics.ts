import {
	ageBar,
	appointmentsByDate,
	financesByDate,
	genderPie,
	missedAppointments,
	mostAppliedTreatments,
	mostInvolvedTeeth,
	outstandingAppointments,
	treatments,
	treatmentsByGender
} from '../components/charts';
import { computed, observable } from 'mobx';

import { Chart } from './interface.chart';
import { appointmentsData } from '../../appointments';
import { treatmentsData } from '../../treatments';

class Statistics {
	@observable filterByDoctor: string = '';

	/**
	 * How much milliseconds there is in a day
	 * 
	 * @memberof Statistics
	 */
	readonly msInDay = 1000 * 60 * 60 * 24;
	/**
	 * Todays day object
	 * 
	 * @type {Date}
	 * @memberof Statistics
	 */
	readonly todayDateObject: Date = new Date();
	/**
	 * Starting point of today in milliseconds
	 * 
	 * @type {number}
	 * @memberof Statistics
	 */
	readonly todayStartsWith: number = this.getDayStartingPoint(this.todayDateObject.getTime());

	/**
	 * An array of available charts to be viewed
	 * 
	 * @type {Chart[]}
	 * @memberof Statistics
	 */
	@observable
	charts: Chart[] = [
		appointmentsByDate,
		financesByDate,
		treatmentsByGender,
		treatments,
		genderPie,
		ageBar,
		mostInvolvedTeeth,
		mostAppliedTreatments,
		missedAppointments,
		outstandingAppointments
	];
	/**
	 * Selected starting date
	 * 
	 * @type {number}
	 * @memberof Statistics
	 */
	@observable startingDate: number = this.todayStartsWith - this.msInDay * 31;
	/**
	 * Selected ending date
	 * 
	 * @type {number}
	 * @memberof Statistics
	 */
	@observable endingDate: number = this.todayStartsWith;

	/**
	 * Number of selected days
	 * 
	 * @readonly
	 * @private
	 * @memberof Statistics
	 */
	@computed
	private get numberOfSelectedDays() {
		return (this.endingDate - this.startingDate) / this.msInDay;
	}

	/**
	 * Date objects of the selected days
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedDays() {
		const days: Date[] = [];
		let i = 0;
		while (i <= this.numberOfSelectedDays) {
			days.push(new Date(this.startingDate + this.msInDay * i));
			i++;
		}
		return days;
	}

	/**
	 * An array of arrays, each subarray represents appointments in a day 
	 * 
	 * @readonly
	 * @private
	 * @memberof Statistics
	 */
	@computed
	private get _selectedAppointmentsByDay() {
		return this.selectedDays.map((day) =>
			appointmentsData.appointments
				.appointmentsForDay(day.getFullYear(), day.getMonth() + 1, day.getDate())
				.filter(
					(appointment) => !this.filterByDoctor || appointment.doctorsID.indexOf(this.filterByDoctor) > -1
				)
				.filter((appointment) => appointment.treatment)
		);
	}

	/**
	 * An array of objects, each objects has the date, and that dates appointments
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedAppointmentsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map((appointment) => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	/**
	 * 
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedPatientsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map((appointment) => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	/**
	 * An array of all the selected appointments regardless of the date
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedAppointments() {
		return this._selectedAppointmentsByDay.reduce((total, els) => {
			els.forEach((el) => total.push(el));
			return total;
		}, []);
	}

	/**
	 * An array of all the selected patients regardless of the date
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedPatients() {
		return this.selectedAppointments.map((appointment) => appointment.patient);
	}

	/**
	 * An array of each day finances, payments, expenses and profits
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get selectedFinances() {
		return this.selectedAppointmentsByDay.map((date) => {
			const appointments = date.appointments.map((appointment) => {
				const paid = appointment.paidAmount;
				const expenses = appointment.expenses;
				const profit = appointment.profit;
				const profitPercentage = appointment.profitPercentage;
				return {
					paid,
					expenses,
					profit,
					profitPercentage,
					isPaid: appointment.paid,
					isDone: appointment.done
				};
			});
			return {
				day: date.day,
				appointments
			};
		});
	}

	/**
	 * Total profits in the selected dates
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get totalProfits() {
		return this.selectedAppointments.map((x) => x.profit).reduce((total, single) => (total = total + single), 0);
	}

	/**
	 * Total expenses in the selected dates
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get totalExpenses() {
		return this.selectedAppointments.map((x) => x.expenses).reduce((total, single) => (total = total + single), 0);
	}

	/**
	 * Total payments in the selected dates
	 * 
	 * @readonly
	 * @memberof Statistics
	 */
	@computed
	get totalPayments() {
		return this.selectedAppointments
			.map((x) => x.paidAmount)
			.reduce((total, single) => (total = total + single), 0);
	}

	/**
	 * Utility function to get the starting point (in milliseconds) for a day
	 * 
	 * @param {number} t 
	 * @returns 
	 * @memberof Statistics
	 */
	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`).getTime();
	}
}

export default new Statistics();
