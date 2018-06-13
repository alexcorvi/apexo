import { computed, intercept, observable, observe } from 'mobx';

import { AppointmentJSON } from './index';
import { doctorsData } from '../../doctors';
import { generateID } from '../../../assets/utils/generate-id';
import { patientsData } from '../../patients';
import { prescriptionsData } from '../../prescriptions';
import { settingsData } from '../../settings';
import { treatmentsData } from '../../treatments';

export class Appointment {
	/**
	 * Unique ID for each appointment
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	_id: string = generateID();

	@observable triggerUpdate: number = 0;

	/**
	 * If a timer is running then it should be here
	 * 
	 * @type {(number | null)}
	 * @memberof Appointment
	 */
	@observable timer: number | null = null;

	/**
	 * Patient complaint for this appointment
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	@observable complaint: string = '';

	/**
	 * Patient diagnosis for this appointment
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	@observable diagnosis: string = '';

	/**
	 * Treatment ID
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	@observable treatmentID: string = (treatmentsData.treatments.list[0] || { _id: '' })._id;

	/**
	 * Patient ID
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	@observable patientID: string = '';

	/**
	 * Doctor ID
	 * 
	 * @type {string}
	 * @memberof Appointment
	 */
	@observable doctorsID: string[] = [];

	/**
	 * Date for the appointment
	 * 
	 * @type {number}
	 * @memberof Appointment
	 */
	@observable date: number = new Date().getTime();

	/**
	 * An array of involved teeth ISO numbers
	 * 
	 * @type {number[]}
	 * @memberof Appointment
	 */
	@observable involvedTeeth: number[] = [];

	/**
	 * Time spent on this appointment
	 * 
	 * @type {number}
	 * @memberof Appointment
	 */
	@observable time: number = 0;

	/**
	 * Actual paid amount for this appointment
	 * 
	 * @type {number}
	 * @memberof Appointment
	 */
	@observable paidAmount: number = 0;

	/**
	 * Whether this appointment done or not
	 * 
	 * @type {boolean}
	 * @memberof Appointment
	 */
	@observable done: boolean = false;

	/**
	 * Whether this appointment has been fully paid or not
	 * 
	 * @type {boolean}
	 * @memberof Appointment
	 */
	@observable paid: boolean = false;

	/**
	 * An array of prescriptions IDs
	 * 
	 * @type {string[]}
	 * @memberof Appointment
	 */
	@observable prescriptions: { prescription: string; id: string }[] = [];

	@observable records: string[] = observable([]);

	/**
	 * Doctors who are about to treat the patient
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get doctors() {
		return doctorsData.doctors.list.filter((doctor) => this.doctorsID.indexOf(doctor._id) !== -1);
	}

	/**
	 * Patient data
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get patient() {
		return patientsData.patients.list[patientsData.patients.findIndexByID(this.patientID)];
	}

	/**
	 * treatment data
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get treatment() {
		return treatmentsData.treatments.list[treatmentsData.treatments.getIndexByID(this.treatmentID)];
	}

	/**
	 * expenses on this appointment
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get expenses() {
		if (!this.treatment) {
			if (this.treatmentID.indexOf('|') > -1) {
				return Number(this.treatmentID.split('|')[1]);
			} else {
				return 0;
			}
		}
		return this.treatment.expenses;
	}

	/**
	 * The amount of expenses + time value
	 * 
	 * @returns 
	 * @memberof Appointment
	 */
	@computed
	get totalExpenses() {
		return this.expenses + this.spentTimeValue;
	}

	/**
	 * Profit from this appointment
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get profit() {
		return this.paidAmount - this.totalExpenses;
	}

	/**
	 * Profit percentage
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get profitPercentage() {
		return this.profit / this.totalExpenses;
	}

	/**
	 * Whether this appointment has an outstanding payment or not
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get outstanding() {
		return this.done && !this.paid;
	}

	/**
	 * Whether this appointment is due today or not
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get dueToday() {
		return this.sameDay(new Date(this.todayDate()), new Date(this.date)) && !this.done;
	}

	/**
	 * Whether this appointment is due tomorrow or not
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get dueTomorrow() {
		return this.sameDay(new Date(new Date(this.todayDate()).getTime() + 1000 * 60 * 60 * 24), new Date(this.date));
	}

	/**
	 * Is this appointment missed or not
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get missed() {
		return new Date(this.todayDate()).getTime() - new Date(this.date).getTime() > 0 && !this.done;
	}

	/**
	 * Will this appointment happen in the future
	 * 
	 * @readonly
	 * @memberof Appointment
	 */
	@computed
	get future() {
		return !this.dueToday && !this.dueTomorrow && !this.done && this.date > new Date().getTime();
	}

	@computed
	get spentTimeValue() {
		return Number(settingsData.settings.getSetting('hourlyRate')) * (this.time / (1000 * 60 * 60));
	}

	/**
	 * Creates an instance of Appointment from JSON data
	 * @param {AppointmentJSON} [json] 
	 * @memberof Appointment
	 */
	constructor(json?: AppointmentJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	/**
	 * Updates from JSON
	 * 
	 * @param {AppointmentJSON} json 
	 * @memberof Appointment
	 */
	fromJSON(json: AppointmentJSON) {
		this._id = json._id;
		this.treatmentID = json.treatmentID;
		this.patientID = json.patientID;
		this.date = json.date;
		this.involvedTeeth = json.involvedTeeth;
		this.paidAmount = json.paidAmount;
		this.done = json.done;
		this.paid = json.paid;
		this.prescriptions = json.prescriptions;
		this.time = json.time;
		this.diagnosis = json.diagnosis;
		this.complaint = json.complaint;
		this.doctorsID = json.doctorsID;
		this.records = json.records;
	}

	/**
	 * Converts this appointment to JSON
	 * 
	 * @returns {AppointmentJSON} 
	 * @memberof Appointment
	 */
	toJSON(): AppointmentJSON {
		return {
			_id: this._id,
			treatmentID: this.treatmentID,
			patientID: this.patientID,
			date: this.date,
			involvedTeeth: Array.from(this.involvedTeeth),
			paidAmount: this.paidAmount,
			done: this.done,
			paid: this.paid,
			prescriptions: Array.from(this.prescriptions),
			time: this.time,
			diagnosis: this.diagnosis,
			complaint: this.complaint,
			doctorsID: Array.from(this.doctorsID),
			records: Array.from(this.records)
		};
	}

	/**
	 * A proxy function to set date, so we can reset doctors whenever date changes
	 * 
	 * @param {number} value 
	 * @memberof Appointment
	 */
	setDate(value: number) {
		this.date = value;
		this.doctorsID = [];
	}

	/**
	 * Utility function to find Whether two dates are on the same day
	 * 
	 * @private
	 * @param {Date} date1 
	 * @param {Date} date2 
	 * @returns 
	 * @memberof Appointment
	 */
	private sameDay(date1: Date, date2: Date) {
		function comparableTime(date: Date) {
			return {
				y: date.getFullYear(),
				m: date.getMonth(),
				d: date.getDate()
			};
		}
		return JSON.stringify(comparableTime(date1)) === JSON.stringify(comparableTime(date2));
	}

	/**
	 * Utility function to get the Date object of today
	 * 
	 * @private
	 * @returns 
	 * @memberof Appointment
	 */
	private todayDate() {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}
}
