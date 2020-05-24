import { dbAction, files, modals, text } from "@core";
import * as core from "@core";
import { OrthoCase, OrthoCaseSchema, patients } from "@modules";
import * as modules from "@modules";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";
import { Store } from "pouchx";

export class OrthoCases extends Store<OrthoCaseSchema, OrthoCase> {
	async afterDelete(orthoCase: OrthoCase) {
		// remove files
		for (let x = 0; x < orthoCase.visits.length; x++) {
			const visit = orthoCase.visits[x];
			for (let y = 0; y < visit.photos.length; y++) {
				const photo = visit.photos[y];
				await files.remove(photo.photoID);
			}
		}
	}

	async afterChange() {
		// resync on change
		dbAction("resync", modules.orthoNamespace);
	}

	@computed
	get orthoPatientsIDs() {
		return this.docs.map((orthoCase) => orthoCase.patientID);
	}

	@computed
	get patientsWithNoOrtho() {
		return patients!.docs.filter(
			(patient) => this.orthoPatientsIDs.indexOf(patient._id) === -1
		);
	}

	deleteByPatientID(id: string) {
		const ortho = this.docs.find((o) => o.patientID === id);
		if (ortho) {
			this.delete(ortho._id);
		}
	}

	deleteModal(id: string) {
		modals.newModal({
			text: text(`orthodontic case will be deleted`).c,
			onConfirm: () => this.delete(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random(),
		});
	}
}

export let orthoCases: null | OrthoCases = null;

export const setOrthoCasesStore = (store: OrthoCases) => (orthoCases = store);
