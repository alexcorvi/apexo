import { computed, observable, observe } from 'mobx';
import { generateID } from '../../../assets/utils/generate-id';
import { patientsData } from '../../patients/index';
import { CaseJSON } from './interface.ortho-json';

export const Lips = {
	competent: 'competent',
	incompetent: 'incompetent',
	potentially_competent: 'potentially_competent'
};

export const FacialProfile = {
	brachycephalic: 'brachycephalic',
	dolichocephalic: 'dolichocephalic',
	mesocephalic: 'mesocephalic'
};

export const OralHygiene = {
	good: 'good',
	bad: 'bad',
	moderate: 'moderate'
};

export class OrthoCase {
	_id: string = generateID();
	@observable triggerUpdate: number = 0;
	@observable started: number = new Date().getTime();

	@observable patientID: string = '';
	@computed
	get patient() {
		return patientsData.patients.list.find((x) => x._id === this.patientID);
	}

	/**
	 * Extra-oral observations
	 */
	@observable lips: keyof typeof Lips = 'competent';
	@observable facialProfile: keyof typeof FacialProfile = 'mesocephalic';
	@observable nasioLabialAngle: number = 90;
	@observable oralHygiene: keyof typeof OralHygiene = 'moderate';

	/**
	 * jaw to jaw relationship
	 */
	@observable skeletalRelationship: number = 1;
	@observable molarsRelationship: number = 1;
	@observable canineRelationship: number = 1;

	/**
	 * Anterior teeth relationship
	 */
	@observable overJet: number = 2;
	@observable overBite: number = 3;

	@observable crossScissorBite: number[] = [];

	/**
	 * Space analysis: upper jaw
	 */
	@observable u_spaceAvailable: number = 0;
	@observable u_spaceNeeded: number = 0;
	@computed
	get u_spacing() {
		return this.u_spaceAvailable - this.u_spaceNeeded;
	}
	@computed
	get u_crowding() {
		return this.u_spaceNeeded - this.u_spaceAvailable;
	}

	/**
	 * Space analysis: lower jaw
	 */
	@observable l_spaceAvailable: number = 0;
	@observable l_spaceNeeded: number = 0;
	@computed
	get l_spacing() {
		return this.l_spaceAvailable - this.l_spaceNeeded;
	}
	@computed
	get l_crowding() {
		return this.l_spaceNeeded - this.l_spaceAvailable;
	}

	/**
	 * conclusions
	 */
	@observable problemsList: string[] = [];
	@observable treatmentPlan_extraction: number[] = [];
	@observable treatmentPlan_fill: number[] = [];
	@observable treatmentPlan_appliance: string[] = [];

	@observable orthoGallery: string[] = [];

	constructor(json?: CaseJSON) {
		if (json) {
			this.fromJSON(json);
		} else {
			observe(this.crossScissorBite, () => this.triggerUpdate++);
			observe(this.problemsList, () => this.triggerUpdate++);
			observe(this.treatmentPlan_extraction, () => this.triggerUpdate++);
			observe(this.treatmentPlan_fill, () => this.triggerUpdate++);
			observe(this.treatmentPlan_appliance, () => this.triggerUpdate++);
			observe(this.orthoGallery, () => this.triggerUpdate++);
		}
	}

	toJSON(): CaseJSON {
		return {
			_id: this._id,
			patientID: this.patientID,
			started: this.started,
			canineRelationship: this.canineRelationship,
			facialProfile: this.facialProfile,
			l_spaceAvailable: this.l_spaceAvailable,
			l_spaceNeeded: this.l_spaceNeeded,
			lips: this.lips,
			molarsRelationship: this.molarsRelationship,
			nasioLabialAngle: this.nasioLabialAngle,
			oralHygiene: this.oralHygiene,
			overBite: this.overBite,
			overJet: this.overJet,
			problemsList: Array.from(this.problemsList),
			skeletalRelationship: this.skeletalRelationship,
			treatmentPlan_appliance: Array.from(this.treatmentPlan_appliance),
			treatmentPlan_extraction: Array.from(this.treatmentPlan_extraction),
			treatmentPlan_fill: Array.from(this.treatmentPlan_fill),
			u_spaceAvailable: this.u_spaceAvailable,
			u_spaceNeeded: this.u_spaceNeeded,
			crossScissorBite: Array.from(this.crossScissorBite),
			orthoGallery: Array.from(this.orthoGallery)
		};
	}

	fromJSON(json: CaseJSON) {
		this._id = json._id;
		this.started = json.started;
		this.patientID = json.patientID;
		this.canineRelationship = json.canineRelationship;
		this.facialProfile = json.facialProfile;
		this.l_spaceAvailable = json.l_spaceAvailable;
		this.l_spaceNeeded = json.l_spaceNeeded;
		this.lips = json.lips;
		this.molarsRelationship = json.molarsRelationship;
		this.nasioLabialAngle = json.nasioLabialAngle;
		this.oralHygiene = json.oralHygiene;
		this.overBite = json.overBite;
		this.overJet = json.overJet;
		this.problemsList = json.problemsList;
		this.skeletalRelationship = json.skeletalRelationship;
		this.treatmentPlan_appliance = json.treatmentPlan_appliance;
		this.treatmentPlan_extraction = json.treatmentPlan_extraction;
		this.treatmentPlan_fill = json.treatmentPlan_fill;
		this.u_spaceAvailable = json.u_spaceAvailable;
		this.u_spaceNeeded = json.u_spaceNeeded;
		this.crossScissorBite = json.crossScissorBite;
		this.orthoGallery = json.orthoGallery || [];

		observe(this.orthoGallery, () => this.triggerUpdate++);
	}
}
