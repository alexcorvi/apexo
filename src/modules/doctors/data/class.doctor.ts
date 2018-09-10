import { appointmentsData } from '../../appointments';
import { computed, observable, observe } from 'mobx';
import { DoctorJSON } from './interface.doctor-json';
import { generateID } from '../../../assets/utils/generate-id';

export class Doctor {
	/**
	 * Utility variable to get days by index
	 * 
	 * @memberof Doctor
	 */
	readonly days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

	/**
	 * A unique ID for each doctor
	 * 
	 * @type {string}
	 * @memberof Doctor
	 */
	_id: string = generateID();

	@observable name: string = '';

	@observable email: string = '';

	@observable phone: string = '';

	/**
	 * holiday days names
	 * 
	 * @type {string[]}
	 * @memberof Settings
	 */
	@observable onDutyDays: string[] = [];

	@computed
	get sortedDays() {
		return this.onDutyDays.sort((dayA, dayB) => this.days.indexOf(dayA) - this.days.indexOf(dayB));
	}

	/**
	 * holiday days indices
	 * 
	 * @readonly
	 * @memberof Settings
	 */
	@computed
	get holidays() {
		return this.days.filter((day) => this.onDutyDays.indexOf(day) === -1).map((day) => this.days.indexOf(day));
	}

	/**
	 * Duty days indices
	 * 
	 * @readonly
	 * @memberof Doctor
	 */
	@computed
	get onDuty() {
		return this.days.filter((day) => this.onDutyDays.indexOf(day) !== -1).map((day) => this.days.indexOf(day));
	}

	/**
	 * List of appointments registered for this doctor
	 * 
	 * @readonly
	 * @memberof Doctor
	 */
	@computed
	get appointments() {
		return appointmentsData.appointments.list.filter((x) => x.doctorsID.indexOf(this._id) !== -1);
	}

	@computed
	get weeksAppointments() {
		const weeksAppointments: { [key: number]: appointmentsData.Appointment[] } = {};
		const c = new appointmentsData.Calendar();
		c.selectedWeek.forEach((day) => {
			const d = day.date;
			const m = c.currentMonth;
			const y = c.currentYear;
			weeksAppointments[day.weekDay.index] = appointmentsData.appointments
				.appointmentsForDay(y, m + 1, d + 1)
				.filter((appointment) => appointment.doctorsID.indexOf(this._id) !== -1);
		});
		return weeksAppointments;
	}

	@computed
	get nextWeekAppointments() {
		const c = new appointmentsData.Calendar();
		c.selectDayByTimeStamp(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
		return c.selectedWeek.map((day) => {
			const d = day.date;
			const m = c.currentMonth;
			const y = c.currentYear;
			return appointmentsData.appointments
				.appointmentsForDay(y, m + 1, d + 1)
				.filter((appointment) => appointment.doctorsID.indexOf(this._id) !== -1);
		});
	}

	@computed
	get lastWeekAppointments() {
		const c = new appointmentsData.Calendar();
		c.selectDayByTimeStamp(new Date().getTime() - 1000 * 60 * 60 * 24 * 7);
		return c.selectedWeek.map((day) => {
			const d = day.date;
			const m = c.currentMonth;
			const y = c.currentYear;
			return appointmentsData.appointments
				.appointmentsForDay(y, m + 1, d + 1)
				.filter((appointment) => appointment.doctorsID.indexOf(this._id) !== -1);
		});
	}

	/**
	 * Last appointment of the doctor
	 * 
	 * @readonly
	 * @memberof Doctor
	 */
	@computed
	get lastAppointment() {
		return this.pastAppointments[0];
	}

	@computed
	get searchableString() {
		return `
			${this.name} ${this.onDutyDays.join(' ')}
			${this.phone} ${this.email}
			${this.nextAppointment.treatment.type} ${this.lastAppointment.treatment.type}
		`.toLowerCase();
	}

	/**
	 * Next appointment for the doctor
	 * 
	 * @readonly
	 * @memberof Doctor
	 */
	@computed
	get nextAppointment() {
		return this.nextAppointments[0];
	}

	@computed
	get nextAppointments() {
		return this.appointments
			.filter(
				(appointment) =>
					this.getDayStartingPoint(appointment.date) >= this.getDayStartingPoint(new Date().getTime())
			)
			.sort((a, b) => a.date - b.date);
	}

	@computed
	get pastAppointments() {
		return this.appointments
			.filter(
				(appointment) =>
					this.getDayStartingPoint(appointment.date) < this.getDayStartingPoint(new Date().getTime())
			)
			.sort((a, b) => b.date - a.date);
	}

	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}

	/**
	 * Converting Doctor class to JSON
	 * 
	 * @returns {DoctorJSON} 
	 * @memberof Doctor
	 */
	toJSON(): DoctorJSON {
		return {
			_id: this._id,
			name: this.name,
			email: this.email,
			phone: this.phone,
			onDutyDays: Array.from(this.onDutyDays)
		};
	}

	/**
	 * Updates the class from JSON data
	 * 
	 * @param {DoctorJSON} json 
	 * @memberof Doctor
	 */
	fromJSON(json: DoctorJSON) {
		this._id = json._id;
		this.name = json.name || '';
		this.email = json.email || '';
		this.phone = json.phone || '';
		this.onDutyDays = Array.isArray(json.onDutyDays) ? json.onDutyDays : [];
	}

	/**
	 * Creates an instance of Doctor from it's JSON representation
	 * @param {DoctorJSON} json 
	 * @memberof Doctor
	 */
	constructor(json?: DoctorJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}
}
