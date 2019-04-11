import { TreatmentJSON } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";

export class Treatment {
	// Observables

	_id: string = generateID();

	@observable type: string = "";

	@observable expenses: number = 0;

	@computed
	get searchableString() {
		return `
			${this.type} expenses ${this.expenses}
		`.toLowerCase();
	}

	public toJSON(): TreatmentJSON {
		return {
			_id: this._id,
			type: this.type,
			expenses: this.expenses
		};
	}

	constructor(json?: TreatmentJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: TreatmentJSON) {
		this._id = json._id;
		this.type = json.type;
		this.expenses = json.expenses || 0;
	}
}
