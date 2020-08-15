import { BotMessageSchema } from "@modules";
import * as modules from "@modules";
import * as utils from "@utils";
import { computed, observable } from "mobx";
import { patients } from "modules/patients";
import { Model, observeModel } from "pouchx";

@observeModel
export class BotMessage extends Model<BotMessageSchema>
	implements BotMessageSchema {
	@observable _id: string = utils.generateID();

	name: string = "";
	phone: string = "";
	gender: string = "";
	age: number = 0;
	complaint: string = "";
	operator: string = "";
	daysOfWeek: string = "";
	timeOfDay: string = "";
	incoming: boolean = false;
	title: string = "";
	body: string = "";

	@computed
	get searchableString() {
		return `
			${this.name} ${this.phone} ${this.complaint} ${this.gender} ${this.daysOfWeek}
		`.toLowerCase();
	}

	public toJSON(): BotMessageSchema {
		return {
			_id: this._id,
			name: this.name,
			phone: this.phone,
			gender: this.gender,
			age: this.age,
			complaint: this.complaint,
			operator: this.operator,
			daysOfWeek: this.daysOfWeek,
			timeOfDay: this.timeOfDay,
			incoming: this.incoming,
			title: this.title,
			body: this.body,
		};
	}

	fromJSON(json: BotMessageSchema) {
		this._id = json._id;
		this.name = json.name;
		this.phone = json.phone;
		this.gender = json.gender;
		this.age = json.age;
		this.complaint = json.complaint;
		this.operator = json.operator;
		this.daysOfWeek = json.daysOfWeek;
		this.timeOfDay = json.timeOfDay;
		this.incoming = json.incoming;
		this.title = json.title;
		this.body = json.body;
		return this;
	}
}
