import { TreatmentSchema } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";
import { Model, observeModel } from "pouchx";
@observeModel
export class Treatment extends Model<TreatmentSchema>
	implements TreatmentSchema {
	@observable type: string = "";

	@observable expenses: number = 0;

	@computed
	get searchableString() {
		return `
			${this.type} expenses ${this.expenses}
		`.toLowerCase();
	}

	public toJSON(): TreatmentSchema {
		return {
			_id: this._id,
			type: this.type,
			expenses: this.expenses
		};
	}

	fromJSON(json: TreatmentSchema) {
		this._id = json._id;
		this.type = json.type;
		this.expenses = json.expenses || 0;
		return this;
	}
}
