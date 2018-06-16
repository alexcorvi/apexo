import { Gender, ISOTeeth, Label, PatientJSON, Tooth, genderToString, stringToGender } from './index';
import { LabelTypeToString, stringToLabelType } from '../../../assets/components/label/label.component';
import { computed, observable, observe } from 'mobx';

import { appointmentsData } from '../../appointments';
import { generateID } from '../../../assets/utils/generate-id';

/* 
	------------------------------
	Patient Class
	------------------------------
*/
export class Patient {
	/**
	 * A unique ID for each patient
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	_id: string = generateID();

	@observable triggerUpdate = 0;

	/**
	 * Name of the patient
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	@observable name: string = '';

	/**
	 * Birth year of the patient
	 * 
	 * @type {number}
	 * @memberof Patient
	 */
	@observable birthYear: number = 0;

	/**
	 * Gender of the patient
	 * 
	 * @type {Gender}
	 * @memberof Patient
	 */
	@observable gender: Gender = Gender.male;

	/**
	 * Tags for search utility
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	@observable tags: string = '';

	/**
	 * Address of the patient
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	@observable address: string = '';

	/**
	 * Email of the patient
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	@observable email: string = '';

	/**
	 * Phone number of the patient
	 * 
	 * @type {string}
	 * @memberof Patient
	 */
	@observable phone: string = '';

	/**
	 * labels of the patient
	 * 
	 * @type {Label[]}
	 * @memberof Patient
	 */
	@observable labels: Label[] = [];

	/**
	 * Medical History of the patient
	 * 
	 * @type {string[]}
	 * @memberof Patient
	 */
	@observable medicalHistory: string[] = [];

	/**
	 * Gallery of the patient images
	 * 
	 * @type {string[]}
	 * @memberof Patient
	 */
	@observable gallery: string[] = [];

	/**
	 * Dental history of the patient
	 * 
	 * @type {Tooth[]}
	 * @memberof Patient
	 */
	teeth: Tooth[] = [];

	/**
	 * Patient age computed from birth year
	 * 
	 * @readonly
	 * @memberof Patient
	 */
	@computed
	get age() {
		return new Date().getFullYear() - this.birthYear;
	}

	/**
	 * An array of all the patients appointments
	 * 
	 * @readonly
	 * @type {appointmentsData.Appointment[]}
	 * @memberof Patient
	 */
	@computed
	get appointments(): appointmentsData.Appointment[] {
		return appointmentsData.appointments.list.filter((appointment) => appointment.patientID === this._id);
	}

	/**
	 * Last appointment of the patient
	 * 
	 * @readonly
	 * @memberof Patient
	 */
	@computed
	get lastAppointment() {
		return this.appointments.filter((appointment) => appointment.done === true).sort((a, b) => b.date - a.date)[0];
	}

	/**
	 * Next appointment for the patient
	 * 
	 * @readonly
	 * @memberof Patient
	 */
	@computed
	get nextAppointment() {
		return this.appointments
			.filter(
				(appointment) =>
					appointment.done === false &&
					appointment.date > Math.round(new Date().getTime() / 43200000) * 43200000 - 43200000
			)
			.sort((a, b) => a.date - b.date)[0];
	}

	/**
	 * Does the patient have 1 teeth
	 * 
	 * @readonly
	 * @memberof Patient
	 */
	@computed
	get hasPrimaryTeeth() {
		return this.age < 18;
	}

	/**
	 * Does the patient have 2 teeth
	 * 
	 * @readonly
	 * @memberof Patient
	 */
	@computed
	get hasPermanentTeeth() {
		return this.age > 5;
	}

	/**
	 * Creates an instance of Patient from JSON data
	 * @param {PatientJSON} [json] 
	 * @memberof Patient
	 */
	constructor(json?: PatientJSON) {
		for (let index = 0; index < ISOTeeth.permanent.length; index++) {
			const number = ISOTeeth.permanent[index];
			this.teeth[number] = new Tooth(number);
		}
		for (let index = 0; index < ISOTeeth.deciduous.length; index++) {
			const number = ISOTeeth.deciduous[index];
			this.teeth[number] = new Tooth(number);
		}
		if (json) {
			this.fromJSON(json);
		} else {
			observe(this.medicalHistory, () => this.triggerUpdate++);
			observe(this.labels, () => this.triggerUpdate++);
			observe(this.gallery, () => this.triggerUpdate++);
			this.teeth.forEach((tooth, index) => {
				observe(this.teeth[index], () => this.triggerUpdate++);
			});
		}
	}

	/**
	 * Updates the class from JSON
	 * 
	 * @param {PatientJSON} json 
	 * @memberof Patient
	 */
	fromJSON(json: PatientJSON) {
		this._id = json._id;
		this.name = json.name;
		this.birthYear = json.birthYear;
		this.gender = stringToGender(json.gender);
		this.tags = json.tags;
		this.address = json.address;
		this.email = json.email;
		this.phone = json.phone;
		this.medicalHistory = Array.isArray(json.medicalHistory) ? json.medicalHistory : [];
		this.gallery = json.gallery || [];
		json.teeth.map((toothObj) => {
			if (toothObj) {
				const tooth = new Tooth(toothObj);
				this.teeth[tooth.ISO] = tooth;
			}
		});
		this.labels = json.labels.map((x) => {
			return {
				text: x.text,
				type: stringToLabelType(x.type)
			};
		});
		observe(this.medicalHistory, () => this.triggerUpdate++);
		observe(this.gallery, () => this.triggerUpdate++);
		observe(this.labels, () => this.triggerUpdate++);
		this.teeth.forEach((tooth, index) => {
			if (tooth) {
				observe(this.teeth[index], () => this.triggerUpdate++);
				observe(this.teeth[index].notes, () => this.triggerUpdate++);
			}
		});
	}

	/**
	 * Converts patients data to JSON
	 * 
	 * @returns {PatientJSON} 
	 * @memberof Patient
	 */
	toJSON(): PatientJSON {
		return {
			_id: this._id,
			name: this.name,
			birthYear: this.birthYear,
			gender: genderToString(this.gender),
			tags: this.tags,
			address: this.address,
			email: this.email,
			phone: this.phone,
			medicalHistory: Array.from(this.medicalHistory),
			gallery: Array.from(this.gallery),
			teeth: Array.from(this.teeth.map((x) => x.toJSON())),
			labels: Array.from(
				this.labels.map((x) => {
					return {
						text: x.text,
						type: LabelTypeToString(x.type)
					};
				})
			)
		};
	}
}
