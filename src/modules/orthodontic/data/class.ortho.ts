import { text } from "@core";
import {
	CaseJSON,
	CephalometricItem,
	genderToString,
	patients,
	PhotoJSON,
	setting,
	VisitJSON
	} from "@modules";
import { formatDate, generateID } from "@utils";
import { computed, observable, observe } from "mobx";

export const Lips = {
	competent: "competent lips",
	incompetent: "incompetent lips",
	potentially_competent: "potentially competent lips"
};

export const FacialProfile = {
	brachycephalic: "brachycephalic profile",
	dolichocephalic: "dolichocephalic profile",
	mesocephalic: "mesocephalic profile"
};

export const OralHygiene = {
	good: "good oral hygiene",
	bad: "bad oral hygiene",
	moderate: "moderate oral hygiene"
};

export class Photo {
	@observable id: string = generateID();
	@observable photoID: string = "";
	@observable comment: string = "";

	constructor(json?: PhotoJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}
	fromJSON(json: PhotoJSON) {
		this.id = json.id;
		this.photoID = json.photoID;
		this.comment = json.comment;
	}
	toJSON(): PhotoJSON {
		return {
			id: this.id,
			photoID: this.photoID,
			comment: this.comment
		};
	}
}

export class Visit {
	@observable id: string = generateID();
	@observable visitNumber: number = 1;
	@observable photos: Photo[] = [
		new Photo(), // 1 Labial
		new Photo(), // 2 Right
		new Photo(), // 3 Left
		new Photo(), // 4 Lingual
		new Photo() // 5 Palatal
	];
	@observable date: number = new Date().getTime();
	@observable appliance: string = "";

	constructor(json?: VisitJSON, visitNumber?: number) {
		if (json) {
			this.fromJSON(json);
		}
		if (visitNumber) {
			this.visitNumber = visitNumber;
		}
	}

	fromJSON(json: VisitJSON) {
		this.id = json.id;
		this.visitNumber = json.visitNumber;
		this.date = json.date;
		this.appliance = json.appliance;
		this.photos = json.photos.map(x => new Photo(x));
	}

	toJSON(): VisitJSON {
		return {
			id: this.id,
			visitNumber: this.visitNumber,
			date: this.date,
			appliance: this.appliance,
			photos: this.photos.map(x => x.toJSON())
		};
	}
}

export class OrthoCase {
	_id: string = generateID();
	@observable triggerUpdate: number = 0;
	@observable startedDate: number = 0;

	@observable patientID: string = "";
	@computed
	get patient() {
		return patients.list.find(x => x._id === this.patientID);
	}

	/**
	 * Extra-oral observations
	 */
	@observable lips: keyof typeof Lips = "competent";
	@observable facialProfile: keyof typeof FacialProfile = "mesocephalic";
	@observable nasioLabialAngle: number = 90;
	@observable oralHygiene: keyof typeof OralHygiene = "moderate";

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
	@observable treatmentPlan_appliance: string[] = [];

	@observable orthoGallery: string[] = [];

	@observable cephalometricHistory: CephalometricItem[] = [];

	@observable isFinished: boolean = false;
	@observable isStarted: boolean = false;
	@observable finishedDate: number = 0;

	@observable nextVisitNotes: string[] = [];

	@observable visits: Visit[] = [];

	@computed
	get computedProblems() {
		const computedProblemsArr: string[] = [];
		if (this.lips !== "competent") {
			computedProblemsArr.push(text(Lips[this.lips]));
		}

		if (this.facialProfile !== "mesocephalic") {
			computedProblemsArr.push(text(FacialProfile[this.facialProfile]));
		}

		if (this.oralHygiene === "bad") {
			computedProblemsArr.push(text(OralHygiene[this.oralHygiene]));
		}

		if (this.nasioLabialAngle < 90 || this.nasioLabialAngle > 93) {
			computedProblemsArr.push(
				`${text("Nasio-labial angle")}: ${this.nasioLabialAngle} ${text(
					"degrees"
				)}`
			);
		}

		if (this.skeletalRelationship !== 1) {
			computedProblemsArr.push(
				`${text("Skeletal relationship: Class ")}${
					this.skeletalRelationship
				}`
			);
		}

		if (this.molarsRelationship !== 1) {
			computedProblemsArr.push(
				`${text("Molars relationship: Class ")}${
					this.molarsRelationship
				}`
			);
		}

		if (this.canineRelationship !== 1) {
			computedProblemsArr.push(
				`${text("Canine relationship: Class ")}${
					this.canineRelationship
				}`
			);
		}

		if (this.overJet > 3 || this.overJet < 1) {
			computedProblemsArr.push(
				`${text("Overjet")} :${this.overJet} ${text("mm")}`
			);
		}

		if (this.overBite > 4 || this.overBite < 2) {
			computedProblemsArr.push(
				`${text("Overbite")} :${this.overBite} ${text("mm")}`
			);
		}

		if (this.crossScissorBite.length) {
			computedProblemsArr.push(
				`${text("Cross/scissors bite")}: ${this.crossScissorBite.join(
					", "
				)}`
			);
		}

		if (this.u_crowding > 0) {
			computedProblemsArr.push(
				`${text("Upper arch crowding by")} ${this.u_crowding}${text(
					"mm"
				)}`
			);
		}

		if (this.u_spacing > 0) {
			computedProblemsArr.push(
				`${text("Upper arch spacing by")} ${this.u_spacing}${text(
					"mm"
				)}`
			);
		}

		if (this.l_crowding > 0) {
			computedProblemsArr.push(
				`${text("Lower arch crowding by")} ${this.l_crowding}${text(
					"mm"
				)}`
			);
		}

		if (this.l_spacing > 0) {
			computedProblemsArr.push(
				`${text("Lower arch spacing by")} ${this.l_spacing}${text(
					"mm"
				)}`
			);
		}

		return computedProblemsArr;
	}

	@computed
	get searchableString() {
		return !this.patient
			? ""
			: `
			${this.patient.age} ${this.patient.birthYear}
			${this.patient.phone} ${this.patient.email} ${
					this.patient.address
			  } ${genderToString(this.patient.gender)}
			${this.patient.name} ${this.patient.labels
					.map(x => x.text)
					.join(" ")} ${this.patient.medicalHistory.join(" ")}
			${this.patient.teeth.map(x => x.notes.join(" ")).join(" ")}
			${
				this.patient.nextAppointment
					? (this.patient.nextAppointment.treatment || { type: "" })
							.type
					: ""
			}
			${
				this.patient.nextAppointment
					? formatDate(
							this.patient.nextAppointment.date,
							setting.getSetting("date_format")
					  )
					: ""
			}
			${
				this.patient.lastAppointment
					? (this.patient.lastAppointment.treatment || { type: "" })
							.type
					: ""
			}
			${
				this.patient.lastAppointment
					? formatDate(
							this.patient.lastAppointment.date,
							setting.getSetting("date_format")
					  )
					: ""
			}
			${
				this.patient.differenceAmount < 0
					? "outstanding " + this.patient.outstandingAmount
					: ""
			}
			${
				this.patient.differenceAmount > 0
					? "Overpaid " + this.patient.overpaidAmount
					: ""
			}
		`.toLowerCase();
	}

	constructor(json?: CaseJSON) {
		if (json) {
			this.fromJSON(json);
		} else {
			observe(this.crossScissorBite, () => this.triggerUpdate++);
			observe(this.problemsList, () => this.triggerUpdate++);
			observe(this.treatmentPlan_appliance, () => this.triggerUpdate++);
			observe(this.orthoGallery, () => this.triggerUpdate++);
			observe(this.cephalometricHistory, () => this.triggerUpdate++);
			observe(this.visits, () => {
				this.triggerUpdate++;
			});
		}
	}

	toJSON(): CaseJSON {
		return {
			_id: this._id,
			patientID: this.patientID,
			startedDate: this.startedDate,
			isStarted: this.isStarted,
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
			u_spaceAvailable: this.u_spaceAvailable,
			u_spaceNeeded: this.u_spaceNeeded,
			crossScissorBite: Array.from(this.crossScissorBite),
			orthoGallery: Array.from(this.orthoGallery),
			cephalometricHistory: Array.from(this.cephalometricHistory),
			isFinished: this.isFinished,
			finishedDate: this.finishedDate,
			nextVisitNotes: Array.from(this.nextVisitNotes),
			visits: Array.from(this.visits).map(x => x.toJSON())
		};
	}

	fromJSON(json: CaseJSON) {
		this._id = json._id;
		this.startedDate = json.startedDate || 0;
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
		this.u_spaceAvailable = json.u_spaceAvailable;
		this.u_spaceNeeded = json.u_spaceNeeded;
		this.crossScissorBite = json.crossScissorBite;
		this.orthoGallery = json.orthoGallery || [];
		this.cephalometricHistory = json.cephalometricHistory || [];
		this.isFinished = !!json.isFinished;
		this.finishedDate = json.finishedDate || 0;
		this.nextVisitNotes = json.nextVisitNotes || [];
		this.visits = json.visits ? json.visits.map(x => new Visit(x)) : [];
		this.isFinished = !!json.isFinished;
		this.isStarted = !!json.isStarted;
		observe(this.crossScissorBite, () => this.triggerUpdate++);
		observe(this.problemsList, () => this.triggerUpdate++);
		observe(this.treatmentPlan_appliance, () => this.triggerUpdate++);
		observe(this.orthoGallery, () => this.triggerUpdate++);
		observe(this.cephalometricHistory, () => this.triggerUpdate++);
		observe(this.visits, () => {
			this.triggerUpdate++;
		});
	}
}
