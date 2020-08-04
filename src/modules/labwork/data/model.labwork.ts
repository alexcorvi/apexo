import { LabworkSchema } from "@modules";
import * as modules from "@modules";
import * as utils from "@utils";
import { computed, observable } from "mobx";
import { patients } from "modules/patients";
import { Model, observeModel } from "pouchx";

@observeModel
export class Labwork extends Model<LabworkSchema> implements LabworkSchema {
	@observable _id: string = utils.generateID();
	@observable caseTitle = "";
	@observable caseDetails = "";
	@observable patientID = "";
	@observable operatingStaffIDs: string[] = [];
	@observable involvedTeeth: number[] = [];
	@observable labName = "";
	@observable labContact = "";
	@observable price = 0;
	@observable isPaid = false;
	@observable sentDate = new Date().getTime();
	@observable isSent = false;
	@observable receivedDate = new Date().getTime();
	@observable isReceived = false;

	@computed get patient() {
		return modules.patients!.docs.find((x) => x._id === this.patientID);
	}

	@computed get operatingStaff() {
		return modules.staff!.docs.filter(
			(x) => this.operatingStaffIDs.indexOf(x._id) !== -1
		);
	}

	@computed
	get searchableString() {
		return `
			${this.caseTitle} ${this.caseDetails} ${this.labName}
		`.toLowerCase();
	}

	public toJSON(): LabworkSchema {
		return {
			_id: this._id,
			caseTitle: this.caseTitle,
			caseDetails: this.caseDetails,
			operatingStaffIDs: this.operatingStaffIDs,
			patientID: this.patientID,
			involvedTeeth: this.involvedTeeth,
			labName: this.labName,
			labContact: this.labContact,
			price: this.price,
			sentDate: this.sentDate,
			isPaid: this.isPaid,
			isSent: this.isSent,
			receivedDate: this.receivedDate,
			isReceived: this.isReceived,
		};
	}

	fromJSON(json: LabworkSchema) {
		this._id = json._id;
		this.caseTitle = json.caseTitle;
		this.caseDetails = json.caseDetails;
		this.operatingStaffIDs = json.operatingStaffIDs;
		this.patientID = json.patientID;
		this.involvedTeeth = json.involvedTeeth;
		this.labName = json.labName;
		this.labContact = json.labContact;
		this.price = json.price;
		this.sentDate = json.sentDate;
		this.isPaid = json.isPaid;
		this.isSent = json.isSent;
		this.receivedDate = json.receivedDate;
		this.isReceived = json.isReceived;
		return this;
	}
}
