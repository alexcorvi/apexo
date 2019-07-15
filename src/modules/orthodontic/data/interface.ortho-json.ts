import { FacialProfile, Lips, OralHygiene, Visit } from "@modules";

export interface CephalometricItemInterface {
	pointCoordinates: string;
	date: number;
	imgPath: string;
}

export interface PhotoJSON {
	id: string;
	photoID: string;
	comment: string;
}

export interface VisitJSON {
	id: string;
	visitNumber: number;
	date: number;
	appliance: string;
	target: string | undefined;
	photos: PhotoJSON[];
}

export interface CaseJSON {
	_id: string;
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
	orthoGallery: string[];
	cephalometricHistory: CephalometricItemInterface[];
	isFinished: boolean;
	isStarted: boolean;
	startedDate: number;
	finishedDate: number;
	nextVisitNotes: string[];
	visits: VisitJSON[];
}
