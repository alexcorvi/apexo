import { Schema } from "pouchx";
export interface LabworkSchema extends Schema {
	caseTitle: string;
	caseDetails: string;
	operatingStaffIDs: string[];
	patientID: string;
	involvedTeeth: number[];
	labName: string;
	labContact: string;
	price: number;
	sentDate: number;
	isPaid: boolean;
	isSent: boolean;
	receivedDate: number;
	isReceived: boolean;
}
