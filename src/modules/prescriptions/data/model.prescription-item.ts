import { text } from "@core";
import { prescriptionItemForm, PrescriptionItemSchema } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";
import { Model, observeModel } from "pouchx";

@observeModel
export class PrescriptionItem extends Model<PrescriptionItemSchema>
	implements PrescriptionItemSchema {
	@observable _id: string = generateID();

	@observable name: string = "";

	@observable unitsPerTime: number = 1;

	@observable doseInMg: number = 500;

	@observable timesPerDay: number = 3;

	@observable form: keyof typeof prescriptionItemForm = "capsule";

	@computed
	get searchableString() {
		return `
			${this.name} ${this.doseInMg}${text("mg")} ${this.doseInMg}
			${this.timesPerDay}X${this.unitsPerTime}
			${this.form}
		`.toLowerCase();
	}

	toJSON(): PrescriptionItemSchema {
		return {
			_id: this._id,
			name: this.name,
			doseInMg: this.doseInMg,
			timesPerDay: this.timesPerDay,
			form: this.form,
			unitsPerTime: this.unitsPerTime,
		};
	}

	fromJSON(json: Partial<PrescriptionItemSchema>) {
		this.name = json.name ? json.name : this.name;
		this._id = json._id ? json._id : this._id;
		this.doseInMg = json.doseInMg ? json.doseInMg : this.doseInMg;
		this.timesPerDay = json.timesPerDay
			? json.timesPerDay
			: this.timesPerDay;
		this.form = json.form ? (json as any).form : this.form;
		this.unitsPerTime = json.unitsPerTime || this.unitsPerTime;
		return this;
	}
}
