import { appointmentsData } from "../../appointments";
import { computed, observable, observe } from "mobx";
import {
	Gender,
	genderToString,
	ISOTeeth,
	Label,
	PatientJSON,
	stringToGender,
	Tooth
} from "./index";
import { generateID } from "../../../assets/utils/generate-id";
import {
	LabelTypeToString,
	stringToLabelType
} from "../../../assets/components/label/label.component";

export class Patient {
	_id: string = generateID();

	@observable triggerUpdate = 0;

	@observable name: string = "";

	@observable birthYearOrAge: number = 0;

	@observable gender: Gender = Gender.male;

	@observable tags: string = "";

	@observable address: string = "";

	@observable email: string = "";

	@observable phone: string = "";

	@observable labels: Label[] = [];

	@observable medicalHistory: string[] = [];

	@observable gallery: string[] = [];

	teeth: Tooth[] = [];

	@computed
	get age() {
		const diff = new Date().getFullYear() - this.birthYearOrAge;
		return diff > this.birthYearOrAge ? this.birthYearOrAge : diff;
	}

	@computed
	get appointments(): appointmentsData.Appointment[] {
		return appointmentsData.appointments.list.filter(
			appointment => appointment.patientID === this._id
		);
	}

	@computed
	get lastAppointment() {
		return this.appointments
			.filter(appointment => appointment.isDone === true)
			.sort((a, b) => b.date - a.date)[0];
	}

	@computed
	get nextAppointment() {
		return this.appointments
			.filter(
				appointment =>
					appointment.isDone === false &&
					appointment.date >
						Math.round(new Date().getTime() / 43200000) * 43200000 -
							43200000
			)
			.sort((a, b) => a.date - b.date)[0];
	}

	@computed
	get hasPrimaryTeeth() {
		return this.age < 18;
	}

	@computed
	get hasPermanentTeeth() {
		return this.age > 5;
	}

	@computed
	get searchableString() {
		return `
			${this.age} ${this.birthYearOrAge}
			${this.phone} ${this.email} ${this.address} ${genderToString(this.gender)}
			${this.name} ${this.labels
			.map(x => x.text)
			.join(" ")} ${this.medicalHistory.join(" ")}
			${this.teeth.map(x => x.notes.join(" ")).join(" ")}
			${
				this.nextAppointment
					? (this.nextAppointment.treatment || { type: "" }).type
					: ""
			}
			${
				this.lastAppointment
					? (this.lastAppointment.treatment || { type: "" }).type
					: ""
			}
		`.toLowerCase();
	}

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

	fromJSON(json: PatientJSON) {
		this._id = json._id;
		this.name = json.name;
		this.birthYearOrAge = json.birthYear;
		this.gender = stringToGender(json.gender);
		this.tags = json.tags;
		this.address = json.address;
		this.email = json.email;
		this.phone = json.phone;
		this.medicalHistory = Array.isArray(json.medicalHistory)
			? json.medicalHistory
			: [];
		this.gallery = json.gallery || [];
		json.teeth.map(toothObj => {
			if (toothObj) {
				const tooth = new Tooth(toothObj);
				this.teeth[tooth.ISO] = tooth;
			}
		});
		this.labels = json.labels.map(x => {
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

	toJSON(): PatientJSON {
		return {
			_id: this._id,
			name: this.name,
			birthYear: this.birthYearOrAge,
			gender: genderToString(this.gender),
			tags: this.tags,
			address: this.address,
			email: this.email,
			phone: this.phone,
			medicalHistory: Array.from(this.medicalHistory),
			gallery: Array.from(this.gallery),
			teeth: Array.from(this.teeth.map(x => x.toJSON())),
			labels: Array.from(
				this.labels.map(x => {
					return {
						text: x.text,
						type: LabelTypeToString(x.type)
					};
				})
			)
		};
	}
}
