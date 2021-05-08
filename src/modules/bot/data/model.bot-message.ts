import { BotMessageSchema } from "@modules";
import * as modules from "@modules";
import * as utils from "@utils";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { patients } from "modules/patients";
import { Model, observeModel } from "pouchx";

@observeModel
export class BotMessage extends Model<BotMessageSchema>
	implements BotMessageSchema {
	@observable _id: string = utils.generateID();

	@observable name: string = "";
	@observable phone: string = "";
	@observable gender: string = "";
	@observable age: number = 0;
	@observable complaint: string = "";
	@observable notes: string = "";
	@observable daysOfWeek: string = "";
	@observable timeOfDay: string = "";
	@observable incoming: boolean = false;
	@observable title: string = "";
	@observable body: string = "";

	@observable date: number = new Date().getTime();
	@observable confirmed: boolean = false;
	@observable confirmationMessage: string = "";
	@observable appointmentID: string = "";

	@observable hide: boolean = false;

	@computed
	get computedAge() {
		const diff = new Date().getFullYear() - this.age;
		return diff > this.age ? this.age : diff;
	}

	@computed
	get searchableString() {
		return `
			${this.name} ${this.phone} ${this.complaint} ${this.gender} ${this.daysOfWeek}
		`.toLowerCase();
	}
	defaultConfirmationMessage(date: number) {
		return `Hello ${this.name},
Your appointment regarding "${this.complaint}", has been confirmed.
Your appointment will be on ${formatDate(
			date,
			modules.setting!.getSetting("date_format")
		)} ${new Date(date).toLocaleTimeString().replace(/:\d+ /g, " ")}.
Please call the clinic directly for more details or if you want cancel the appointment.
Thanks!`;
	}

	public toJSON(): BotMessageSchema {
		return {
			_id: this._id,
			name: this.name,
			phone: this.phone,
			gender: this.gender,
			age: this.age,
			complaint: this.complaint,
			notes: this.notes,
			daysOfWeek: this.daysOfWeek,
			timeOfDay: this.timeOfDay,
			incoming: this.incoming,
			title: this.title,
			body: this.body,
			date: this.date,
			confirmed: this.confirmed,
			confirmationMessage: this.confirmationMessage,
			appointmentID: this.appointmentID,
			hide: this.hide,
		};
	}

	fromJSON(json: BotMessageSchema) {
		this._id = json._id;
		this.name = json.name;
		this.phone = json.phone;
		this.gender = json.gender;
		this.age = json.age;
		this.complaint = json.complaint;
		this.notes = json.notes;
		this.daysOfWeek = json.daysOfWeek;
		this.timeOfDay = json.timeOfDay;
		this.incoming = json.incoming;
		this.title = json.title;
		this.body = json.body;
		this.date = json.date;
		this.confirmed = json.confirmed;
		this.confirmationMessage = json.confirmationMessage;
		this.appointmentID = json.appointmentID;
		this.hide = json.hide;
		return this;
	}
}
