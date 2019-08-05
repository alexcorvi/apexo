import { ToothCondition, ToothSchema } from "@modules";
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
			notes: toJS(this.notes)
		};
	}
}
