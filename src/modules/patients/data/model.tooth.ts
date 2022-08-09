import { Patient } from "./model.patient";
import { Appointment, ToothCondition, ToothSchema } from "@modules";
import { convert } from "@utils";
import { computed, observable, toJS } from "mobx";
import { SubModel } from "pouchx";

export class Tooth extends SubModel<ToothSchema> implements ToothSchema {
	ISO: number = 11;

	@computed get Universal() {
		return convert(this.ISO).Universal;
	}

	@computed get Palmer() {
		return convert(this.ISO).Palmer;
	}

	@computed get Name() {
		return convert(this.ISO).Name;
	}

	@computed get concern() {
		return !!(
			this.condition !== "sound" ||
			this.notes.length ||
			this.appointments.length
		);
	}

	@computed get appointments() {
		if (this.patient) {
			return this.patient.appointments.filter(
				(x) => x.involvedTeeth.indexOf(this.ISO) > -1
			);
		} else {
			return [];
		}
	}
	@observable patient: Patient | null = null;

	@observable condition: keyof typeof ToothCondition = "sound";

	@observable notes: string[] = [];

	fromISO(iso: number) {
		this.ISO = iso;
		return this;
	}

	fromJSON(input: ToothSchema) {
		this.ISO = input.ISO;
		this.condition = input.condition;
		this.notes = input.notes;
		return this;
	}

	toJSON(): ToothSchema {
		return {
			ISO: this.ISO,
			condition: this.condition,
			notes: toJS(this.notes),
		};
	}

	constructor(patient: Patient) {
		super();
		this.patient = patient;
	}
}
