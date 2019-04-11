import { ToothCondition, ToothJSON } from "@modules";
import { convert } from "@utils";
import { computed, observable } from "mobx";

export class Tooth {
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

	constructor(input: number | ToothJSON | null) {
		if (typeof input === "number") {
			this.ISO = input;
		} else if (!!input) {
			this.fromJSON(input);
		}
	}

	fromJSON(input: ToothJSON) {
		this.ISO = input.ISO;
		this.condition = input.condition;
		this.notes = input.notes;
	}

	toJSON(): ToothJSON {
		return {
			ISO: this.ISO,
			condition: this.condition,
			notes: Array.from(this.notes)
		};
	}
}
