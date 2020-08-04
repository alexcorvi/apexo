import { formatDate, generateID } from "@utils";
import { computed, observable, observe } from "mobx";
import { Model, observeModel } from "pouchx";
import {
	Appointment,
	appointments,
	gender,
	ISOTeeth,
	Label,
	PatientSchema,
	setting,
	Tooth,
} from "@modules";

@observeModel
export class Patient extends Model<PatientSchema> implements PatientSchema {
	@observable _id: string = generateID();

	@observable name: string = "";

	@observable avatar: string = "";

	@observable birthYear: number = 0;

	@observable gender: keyof typeof gender = gender.male;

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
		const diff = new Date().getFullYear() - this.birthYear;
		return diff > this.birthYear ? this.birthYear : diff;
	}

	@computed
	get appointments(): Appointment[] {
		return appointments!.docs.filter(
			(appointment) => appointment.patientID === this._id
		);
	}

	@computed
	get lastAppointment() {
		return this.appointments
			.filter((appointment) => appointment.isPast)
			.sort((a, b) => b.date - a.date)[0];
	}

	@computed
	get nextAppointment() {
		return this.appointments
			.filter((appointment) => appointment.isUpcoming)
			.sort((a, b) => a.date - b.date)[0];
	}

	@computed get totalPayments() {
		return this.appointments
			.map((x) => x.paidAmount)
			.reduce((t, c) => {
				t = t + c;
				return t;
			}, 0);
	}

	@computed get outstandingAmount() {
		return this.appointments
			.map((x) => x.outstandingAmount)
			.reduce((t, c) => {
				t = t + c;
				return t;
			}, 0);
	}

	@computed get overpaidAmount() {
		return this.appointments
			.map((x) => x.overpaidAmount)
			.reduce((t, c) => {
				t = t + c;
				return t;
			}, 0);
	}

	@computed get differenceAmount() {
		return this.overpaidAmount - this.outstandingAmount;
	}

	@computed
	get searchableString() {
		return `
			${this.age} ${this.birthYear}
			${this.phone} ${this.email} ${this.address} ${this.gender}
			${this.name} ${this.labels
			.map((x) => x.text)
			.join(" ")} ${this.medicalHistory.join(" ")}
			${this.teeth.map((x) => x.notes.join(" ")).join(" ")}
			${
				this.nextAppointment
					? (this.nextAppointment.treatment || { type: "" }).type
					: ""
			}
			${
				this.nextAppointment
					? formatDate(
							this.nextAppointment.date,
							setting!.getSetting("date_format")
					  )
					: ""
			}
			${
				this.lastAppointment
					? (this.lastAppointment.treatment || { type: "" }).type
					: ""
			}
			${
				this.lastAppointment
					? formatDate(
							this.lastAppointment.date,
							setting!.getSetting("date_format")
					  )
					: ""
			}
			${this.differenceAmount < 0 ? "outstanding " + this.outstandingAmount : ""}
			${this.differenceAmount > 0 ? "Overpaid " + this.overpaidAmount : ""}
		`.toLowerCase();
	}

	fromJSON(json: PatientSchema) {
		for (let index = 0; index < ISOTeeth.permanent.length; index++) {
			const number = ISOTeeth.permanent[index];
			this.teeth[number] = new Tooth().fromISO(number);
		}
		for (let index = 0; index < ISOTeeth.deciduous.length; index++) {
			const number = ISOTeeth.deciduous[index];
			this.teeth[number] = new Tooth().fromISO(number);
		}

		this._id = json._id;
		this.name = json.name;
		this.avatar = json.avatar || "";
		this.birthYear = json.birthYear;
		this.gender = json.gender;
		this.tags = json.tags;
		this.address = json.address;
		this.email = json.email;
		this.phone = json.phone;
		this.medicalHistory = Array.isArray(json.medicalHistory)
			? json.medicalHistory
			: [];
		this.gallery = json.gallery || [];
		json.teeth.map((toothObj) => {
			if (toothObj) {
				const tooth = new Tooth().fromJSON(toothObj);
				this.teeth[tooth.ISO] = tooth;
			}
		});
		this.labels = json.labels.map((x) => {
			return {
				text: x.text,
				type: x.type,
			};
		});
		return this;
	}

	toJSON(): PatientSchema {
		return {
			_id: this._id,
			name: this.name,
			avatar: this.avatar,
			birthYear: this.birthYear,
			gender: this.gender,
			tags: this.tags,
			address: this.address,
			email: this.email,
			phone: this.phone,
			medicalHistory: Array.from(this.medicalHistory),
			gallery: Array.from(this.gallery),
			teeth: Array.from(
				this.teeth
					.filter((x) => x)
					.filter((x) => x.condition !== "sound" || x.notes.length)
					.map((x) => x.toJSON())
			),
			labels: Array.from(
				this.labels.map((x) => {
					return {
						text: x.text,
						type: x.type,
					};
				})
			),
		};
	}
}
