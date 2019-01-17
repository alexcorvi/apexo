import { FacialProfile, Lips, OralHygiene } from "./class.ortho";

export interface CephalometricItem {
	data: string;
	date: number;
}

export interface CaseJSON {
	_id: string;
	started: number;
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
	treatmentPlan_extraction: number[];
	treatmentPlan_fill: number[];
	treatmentPlan_appliance: string[];
	crossScissorBite: number[];
	orthoGallery: string[];
	cephalometricHistory: CephalometricItem[];
}
