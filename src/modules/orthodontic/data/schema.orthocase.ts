import { Schema } from "pouchx";

export interface PhotoSchema {
	id: string;
	photoID: string;
	comment: string;
}

export interface VisitSchema {
	id: string;
	visitNumber: number;
	date: number;
	appliance: string;
	target: string | undefined;
	photos: PhotoSchema[];
}

export interface OrthoCaseSchema extends Schema {
	patientID: string;
	lips: string;
	facialProfile: string;
	nasioLabialAngle: number;
	oralHygiene: string;
	skeletalRelationship: number;
	molarsRelationship: number;
	canineRelationship: number;
	overJet: number;
	overBite: number;
	u_spaceAvailable: number;
	u_spaceNeeded: number;
	l_spaceAvailable: number;
	l_spaceNeeded: number;
	problemsList: string[];
	treatmentPlan_appliance: string[];
	crossScissorBite: number[];
	isFinished: boolean;
	isStarted: boolean;
	startedDate: number;
	finishedDate: number;
	nextVisitNotes: string[];
	visits: VisitSchema[];
}
