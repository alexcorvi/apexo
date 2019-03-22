import * as dateUtils from "../../../assets/utils/date";
import { AppointmentJSON } from "./index";
import { computed, observable } from "mobx";
import { staffData } from "../../staff";
import { generateID } from "../../../assets/utils/generate-id";
import { patientsData } from "../../patients";
import { settingsData } from "../../settings";
import { treatmentsData } from "../../treatments";
import { Treatment } from "../../treatments/data/class.treatment";

export class Appointment {
	_id: string = generateID();

	@observable triggerUpdate: number = 0;

	@observable timer: number | null = null;

	@observable complaint: string = "";

	@observable diagnosis: string = "";

	@observable treatmentID: string = (
		treatmentsData.treatments.list[0] || { _id: "" }
	)._id;

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

	@observable records: string[] = observable([]);

	@computed get isPaid() {
		return this.paidAmount >= this.finalPrice;
	}

	@computed get outstandingAmount() {
		return Math.max(this.finalPrice - this.paidAmount, 0);
	}

	@computed
	get operatingStaff() {
		return staffData.staffMembers.list.filter(
			member => this.staffID.indexOf(member._id) !== -1
		);
	}

	@computed
	get patient() {
		return patientsData.patients.list[
			patientsData.patients.findIndexByID(this.patientID)
		];
	}

	@computed
	get treatment(): undefined | Treatment {
		return treatmentsData.treatments.list[
			treatmentsData.treatments.getIndexByID(this.treatmentID)
		];
	}

	@computed
	get expenses() {
		if (!this.treatment) {
			if (this.treatmentID.indexOf("|") > -1) {
				return Number(this.treatmentID.split("|")[1]);
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
		return this.isDone && !this.isPaid;
	}

	@computed
	get dueToday() {
		return dateUtils.isToday(this.date) && !this.isDone;
	}

	@computed
	get dueTomorrow() {
		return dateUtils.isTomorrow(this.date);
	}

	@computed
	get dueYesterday() {
		return dateUtils.isYesterday(this.date);
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
		const d = dateUtils.comparableTime(new Date(this.date));
		return new Date(`${d.y}/${d.m + 1}/${d.d}`);
	}

	@computed get formattedTime() {
		return new Date(this.date)
			.toLocaleTimeString()
			.replace(/:[0-9]{2} /, " ");
	}

	@computed
	get spentTimeValue() {
		return (
			Number(settingsData.settings.getSetting("hourlyRate")) *
			(this.time / (1000 * 60 * 60))
		);
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
                ${this.missed ? "missed" : ""}
                ${this.dueToday ? "today" : ""}
				${this.dueTomorrow ? "tomorrow" : ""}
				${this.future ? "future" : ""}
				${this.patient.name}
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
		this.records = json.records;
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
			records: Array.from(this.records),
			units: this.units,
			notes: this.notes
		};
	}

	setDate(value: number) {
		this.date = value;
		this.staffID = [];
	}
}
