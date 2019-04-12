import { text } from "@core";
import { itemFormToString, PrescriptionItemForm, PrescriptionItemJSON, stringToItemForm } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";

export class PrescriptionItem {
	[key: string]: string | number | Function;

	_id: string = generateID();

	@observable name: string = "";

	@observable unitsPerTime: number = 1;

	@observable doseInMg: number = 500;

	@observable timesPerDay: number = 3;

	@observable form: PrescriptionItemForm = PrescriptionItemForm.capsule;

	@computed
	get searchableString() {
		return `
			${this.name} ${this.doseInMg}${text("mg")} ${this.doseInMg}
			${this.timesPerDay}X${this.unitsPerTime}
			${itemFormToString(this.form)}
		`.toLowerCase();
	}

	toJSON(): PrescriptionItemJSON {
		return {
			_id: this._id,
			name: this.name,
			doseInMg: this.doseInMg,
			timesPerDay: this.timesPerDay,
			form: itemFormToString(this.form),
			unitsPerTime: this.unitsPerTime
		};
	}

	constructor(json?: PrescriptionItemJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: PrescriptionItemJSON) {
		this.name = json.name;
		this._id = json._id;
		this.doseInMg = json.doseInMg;
		this.timesPerDay = json.timesPerDay;
		this.form = stringToItemForm(json.form);
		this.unitsPerTime = json.unitsPerTime || 1;
	}
}
