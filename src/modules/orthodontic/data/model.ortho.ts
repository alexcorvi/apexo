import { text } from "@core";
import { formatDate, generateID } from "@utils";
import { computed, observable } from "mobx";
import { Model, observeModel, SubModel } from "pouchx";
import {
	OrthoCaseSchema,
	patients,
	PhotoSchema,
	setting,
	VisitSchema,
} from "@modules";

export const Lips = {
	competent: "competent lips",
	incompetent: "incompetent lips",
	potentially_competent: "potentially competent lips",
};

export const FacialProfile = {
	brachycephalic: "brachycephalic profile",
	dolichocephalic: "dolichocephalic profile",
	mesocephalic: "mesocephalic profile",
};

export const OralHygiene = {
	good: "good oral hygiene",
	bad: "bad oral hygiene",
	moderate: "moderate oral hygiene",
};

export class Photo extends SubModel<PhotoSchema> implements PhotoSchema {
	@observable id: string = generateID();
	@observable photoID: string = "";
	@observable comment: string = "";

	fromJSON(json: PhotoSchema) {
		this.id = json.id;
		this.photoID = json.photoID;
		this.comment = json.comment;
		return this;
	}
	toJSON(): PhotoSchema {
		return {
			id: this.id,
			photoID: this.photoID,
			comment: this.comment,
		};
	}
}

export class Visit extends SubModel<VisitSchema> implements VisitSchema {
	@observable id: string = generateID();
	@observable visitNumber: number = 1;
	@observable photos: Photo[] = [
		new Photo(), // 1 Labial
		new Photo(), // 2 Right
		new Photo(), // 3 Left
		new Photo(), // 4 Lingual
		new Photo(), // 5 Palatal
	];
	@observable date: number = new Date().getTime();
	@observable appliance: string = "";

	@observable target: string = "";

	withVisitNumber(visitNumber: number) {
		this.visitNumber = visitNumber;
		return this;
	}

	fromJSON(json: VisitSchema) {
		this.id = json.id;
		this.visitNumber = json.visitNumber;
		this.date = json.date;
		this.appliance = json.appliance;
		this.target = json.target || "";
		this.photos = json.photos.map((x) => new Photo().fromJSON(x));
		return this;
	}

	toJSON(): VisitSchema {
		return {
			id: this.id,
			visitNumber: this.visitNumber,
			date: this.date,
			appliance: this.appliance,
			target: this.target,
			photos: this.photos.map((x) => x.toJSON()),
		};
	}
}

@observeModel
export class OrthoCase extends Model<OrthoCaseSchema>
	implements OrthoCaseSchema {
	@observable startedDate: number = 0;

	@observable patientID: string = "";
	@computed
	get patient() {
		return patients!.docs.find((x) => x._id === this.patientID);
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
	@observable isFinished: boolean = false;
	@observable isStarted: boolean = false;
	@observable finishedDate: number = 0;

	@observable nextVisitNotes: string[] = [];

	@observable visits: Visit[] = [];

	@computed
	get computedProblems() {
		const computedProblemsArr: string[] = [];
		if (this.lips !== "competent") {
			computedProblemsArr.push(text(Lips[this.lips] as any).r);
		}

		if (this.facialProfile !== "mesocephalic") {
			computedProblemsArr.push(
				text(FacialProfile[this.facialProfile] as any).r
			);
		}

		if (this.oralHygiene === "bad") {
			computedProblemsArr.push(
				text(OralHygiene[this.oralHygiene] as any).r
			);
		}

		if (this.nasioLabialAngle < 90 || this.nasioLabialAngle > 93) {
			computedProblemsArr.push(
				`${text("nasio-labial angle")}: ${this.nasioLabialAngle} ${text(
					"degrees"
				)}`
			);
		}

		if (this.skeletalRelationship !== 1) {
			computedProblemsArr.push(
				`${text("skeletal relationship")} ${text("class")}: ${
					this.skeletalRelationship
				}`
			);
		}

		if (this.molarsRelationship !== 1) {
			computedProblemsArr.push(
				`${text("molars relationship")} ${text("class")}: ${
					this.molarsRelationship
				}`
			);
		}

		if (this.canineRelationship !== 1) {
			computedProblemsArr.push(
				`${text("canine relationship")} ${text("class")}: ${
					this.canineRelationship
				}`
			);
		}

		if (this.overJet > 3 || this.overJet < 1) {
			computedProblemsArr.push(
				`${text("overjet")} :${this.overJet} ${text("mm")}`
			);
		}

		if (this.overBite > 4 || this.overBite < 2) {
			computedProblemsArr.push(
				`${text("overbite")} :${this.overBite} ${text("mm")}`
			);
		}

		if (this.crossScissorBite.length) {
			computedProblemsArr.push(
				`${text("cross/scissors bite")}: ${this.crossScissorBite.join(
					", "
				)}`
			);
		}

		if (this.u_crowding > 0) {
			computedProblemsArr.push(
				`${text("upper arch crowding by")} ${this.u_crowding}${text(
					"mm"
				)}`
			);
		}

		if (this.u_spacing > 0) {
			computedProblemsArr.push(
				`${text("upper arch spacing by")} ${this.u_spacing}${text(
					"mm"
				)}`
			);
		}

		if (this.l_crowding > 0) {
			computedProblemsArr.push(
				`${text("lower arch crowding by")} ${this.l_crowding}${text(
					"mm"
				)}`
			);
		}

		if (this.l_spacing > 0) {
			computedProblemsArr.push(
				`${text("lower arch spacing by")} ${this.l_spacing}${text(
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
			${this.patient.phone} ${this.patient.email} ${this.patient.address} ${
					this.patient.gender
			  }
			${this.patient.name} ${this.patient.labels
					.map((x) => x.text)
					.join(" ")} ${this.patient.medicalHistory.join(" ")}
			${this.patient.teeth.map((x) => x.notes.join(" ")).join(" ")}
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
							setting!.getSetting("date_format")
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
							setting!.getSetting("date_format")
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
			${this.computedProblems}
		`.toLowerCase();
	}

	toJSON(): OrthoCaseSchema {
		return {
			_id: this._id,
			patientID: this.patientID,
			startedDate: this.startedDate,
			isStarted: this.isStarted,
			canineRelationship: this.canineRelationship,
			facialProfile: this.facialProfile.charAt(0),
			l_spaceAvailable: this.l_spaceAvailable,
			l_spaceNeeded: this.l_spaceNeeded,
			lips: this.lips.charAt(0),
			molarsRelationship: this.molarsRelationship,
			nasioLabialAngle: this.nasioLabialAngle,
			oralHygiene: this.oralHygiene.charAt(0),
			overBite: this.overBite,
			overJet: this.overJet,
			problemsList: Array.from(this.problemsList),
			skeletalRelationship: this.skeletalRelationship,
			treatmentPlan_appliance: Array.from(this.treatmentPlan_appliance),
			u_spaceAvailable: this.u_spaceAvailable,
			u_spaceNeeded: this.u_spaceNeeded,
			crossScissorBite: Array.from(this.crossScissorBite),
			isFinished: this.isFinished,
			finishedDate: this.finishedDate,
			nextVisitNotes: Array.from(this.nextVisitNotes),
			visits: Array.from(this.visits).map((x) => x.toJSON()),
		};
	}

	fromJSON(json: OrthoCaseSchema) {
		this._id = json._id;
		this.startedDate = json.startedDate || 0;
		this.patientID = json.patientID;
		this.canineRelationship = json.canineRelationship;
		this.facialProfile =
			json.facialProfile.charAt(0) === "b"
				? "brachycephalic"
				: json.facialProfile.charAt(0) === "d"
				? "dolichocephalic"
				: "mesocephalic";
		this.l_spaceAvailable = json.l_spaceAvailable;
		this.l_spaceNeeded = json.l_spaceNeeded;
		this.lips =
			json.lips.charAt(0) === "i"
				? "incompetent"
				: json.lips.charAt(0) === "p"
				? "potentially_competent"
				: "competent";
		this.molarsRelationship = json.molarsRelationship;
		this.nasioLabialAngle = json.nasioLabialAngle;
		this.oralHygiene =
			json.oralHygiene.charAt(0) === "g"
				? "good"
				: json.oralHygiene.charAt(0) === "b"
				? "bad"
				: "moderate";
		this.overBite = json.overBite;
		this.overJet = json.overJet;
		this.problemsList = json.problemsList;
		this.skeletalRelationship = json.skeletalRelationship;
		this.treatmentPlan_appliance = json.treatmentPlan_appliance;
		this.u_spaceAvailable = json.u_spaceAvailable;
		this.u_spaceNeeded = json.u_spaceNeeded;
		this.crossScissorBite = json.crossScissorBite;
		this.isFinished = !!json.isFinished;
		this.finishedDate = json.finishedDate || 0;
		this.nextVisitNotes = json.nextVisitNotes || [];
		this.visits = json.visits
			? json.visits.map((x) => new Visit().fromJSON(x))
			: [];
		this.isFinished = !!json.isFinished;
		this.isStarted = !!json.isStarted;
		return this;
	}
}
