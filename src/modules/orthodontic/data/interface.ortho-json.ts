import { FacialProfile, Lips, OralHygiene, Visit } from "@modules";

export interface CephalometricItem {
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
	photos: PhotoJSON[];
}

export interface CaseJSON {
	_id: string;
	patientID: string;
	lips: keyof typeof Lips;
	facialProfile: keyof typeof FacialProfile;
	nasioLabialAngle: number;
	oralHygiene: keyof typeof OralHygiene;
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
	cephalometricHistory: CephalometricItem[];
	isFinished: boolean;
	isStarted: boolean;
	startedDate: number;
	finishedDate: number;
	nextVisitNotes: string[];
	visits: VisitJSON[];
}
