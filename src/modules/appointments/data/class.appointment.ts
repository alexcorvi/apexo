import {
	AppointmentJSON,
	patients,
	setting,
	staff,
	Treatment,
	treatments
	} from "@modules";
import {
	comparableTime,
	generateID,
	hour,
	isToday,
	isTomorrow,
	isYesterday,
	num
	} from "@utils";
import { computed, observable } from "mobx";

export class Appointment {
	_id: string = generateID();

	@observable triggerUpdate: number = 0;

	@observable timer: number | null = null;

	@observable complaint: string = "";

	@observable diagnosis: string = "";

	@observable treatmentID: string = (treatments.list[0] || { _id: "" })._id;

	@observable units: number = 1;

	@observable patientID: string = "";

	@observable staffID: string[] = [];

	@observable date: number = new Date().getTime();

	@observable involvedTeeth: number[] = [];

	@observable time: number = 0;

	@observable finalPrice: number = 0;
	@observable paidAmount: number = 0;

	@observable isDone: boolean = false;

	@observable notes: string = "";

	@observable prescriptions: { prescription: string; id: string }[] = [];

	@computed get isPaid() {
		return this.paidAmount >= this.finalPrice;
	}

	@computed get outstandingAmount() {
		return Math.max(this.finalPrice - this.paidAmount, 0);
	}

	@computed get overpaidAmount() {
		return Math.max(this.paidAmount - this.finalPrice, 0);
	}

	@computed
	get operatingStaff() {
		return staff.list.filter(
			member => this.staffID.indexOf(member._id) !== -1
		);
	}

	@computed
	get patient() {
		return patients.list.find(x => x._id === this.patientID);
	}

	@computed
	get treatment(): undefined | Treatment {
		return treatments.list[treatments.getIndexByID(this.treatmentID)];
	}

	@computed
	get expenses() {
		if (!this.treatment) {
			if (this.treatmentID.indexOf("|") > -1) {
				return num(this.treatmentID.split("|")[1]);
			} else {
				return 0;
			}
		}
		return this.treatment.expenses * this.units;
	}

	@computed
	get totalExpenses() {
		return this.expenses + this.spentTimeValue;
	}

	@computed
	get profit() {
		return this.finalPrice - this.totalExpenses;
	}

	@computed
	get profitPercentage() {
		return isNaN(this.profit / this.finalPrice)
			? 0
			: this.profit / this.finalPrice;
	}

	@computed
	get isOutstanding() {
		return this.isDone && this.outstandingAmount !== 0;
	}

	@computed
	get isOverpaid() {
		return this.isDone && this.overpaidAmount !== 0;
	}

	@computed
	get dueToday() {
		return isToday(this.date) && !this.isDone;
	}

	@computed
	get dueTomorrow() {
		return isTomorrow(this.date);
	}

	@computed
	get dueYesterday() {
		return isYesterday(this.date);
	}

	@computed
	get missed() {
		return (
			new Date().getTime() - new Date(this.date).getTime() > 0 &&
			!this.isDone &&
			!this.dueToday
		);
	}

	@computed
	get future() {
		return (
			!this.dueToday &&
			!this.dueTomorrow &&
			!this.isDone &&
			this.date > new Date().getTime()
		);
	}

	@computed get dateFloor() {
		const d = comparableTime(new Date(this.date));
		return new Date(`${d.y}/${d.m + 1}/${d.d}`);
	}

	@computed get formattedTime() {
		return new Date(this.date)
			.toLocaleTimeString()
			.replace(/:[0-9]{2} /, " ");
	}

	@computed
	get spentTimeValue() {
		return num(setting.getSetting("hourlyRate")) * (this.time / hour);
	}

	@computed
	get searchableString() {
		return `
				${this.complaint}
                ${this.diagnosis}
                ${new Date(this.date).toDateString()}
                ${this.treatment ? this.treatment.type : ""}
                ${this.isPaid ? "paid" : ""}
				${this.isOutstanding ? "outstanding" : ""}
				${this.isOverpaid ? "overpaid" : ""}
                ${this.missed ? "missed" : ""}
                ${this.dueToday ? "today" : ""}
				${this.dueTomorrow ? "tomorrow" : ""}
				${this.future ? "future" : ""}
				${(this.patient || { name: "" }).name}
				${this.operatingStaff.map(x => x.name).join(" ")}
				${this.notes}
		`.toLowerCase();
	}

	constructor(json?: AppointmentJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: AppointmentJSON) {
		this._id = json._id;
		this.treatmentID = json.treatmentID;
		this.patientID = json.patientID;
		this.date = json.date;
		this.involvedTeeth = json.involvedTeeth;
		this.paidAmount = json.paidAmount;
		this.finalPrice = json.finalPrice || 0;
		this.isDone =
			typeof json.isDone === "undefined"
				? (json as any).done
				: json.isDone;
		this.prescriptions = json.prescriptions;
		this.time = json.time;
		this.diagnosis = json.diagnosis;
		this.complaint = json.complaint;
		this.staffID = json.staffID || json.doctorsID || [];
		this.units = json.units || 1;
		this.notes = json.notes
			? json.notes
			: json.complaint && json.diagnosis
			? `Complaint: ${json.complaint}.
Diagnosis: ${json.diagnosis}`
			: "";
	}

	toJSON(): AppointmentJSON {
		return {
			_id: this._id,
			treatmentID: this.treatmentID,
			patientID: this.patientID,
			date: this.date,
			involvedTeeth: Array.from(this.involvedTeeth),
			paidAmount: this.paidAmount,
			finalPrice: this.finalPrice || 0,
			isDone: this.isDone,
			prescriptions: Array.from(this.prescriptions),
			time: this.time,
			diagnosis: this.diagnosis,
			complaint: this.complaint,
			staffID: Array.from(this.staffID),
			units: this.units,
			notes: this.notes
		};
	}

	setDate(value: number) {
		this.date = value;
		this.staffID = [];
	}
}
