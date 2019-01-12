import { ToothCondition, ToothJSON } from "./index";
import { computed, observable } from "mobx";

import { convert } from "../../../assets/utils/teeth-numbering-systems";

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
