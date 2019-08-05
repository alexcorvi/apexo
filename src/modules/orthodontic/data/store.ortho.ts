import { dbAction, files, modals, text } from "@core";
import * as core from "@core";
import { CephalometricItemInterface, OrthoCase, OrthoCaseSchema, patients } from "@modules";
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
		return this.docs.map(orthoCase => orthoCase.patientID);
	}

	@computed
	get patientsWithNoOrtho() {
		return patients!.docs.filter(
			patient => this.orthoPatientsIDs.indexOf(patient._id) === -1
		);
	}

	cephLoader(obj: CephalometricItemInterface): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const img = await files.get(obj.imgPath);
			const i = new Image();
			i.onload = function() {
				const data = `{"imgSource":{"source":"${img}","height":${
					i.height
				},"width":${
					i.width
				}},"currentAnalysisName":"basic","pointCoordinates":${
					obj.pointCoordinates ? obj.pointCoordinates : "{}"
				}}`;
				resolve(data);
			};
			i.src = img;
		});
	}

	deleteByPatientID(id: string) {
		const ortho = this.docs.find(o => o.patientID === id);
		if (ortho) {
			this.delete(ortho._id);
		}
	}

	deleteModal(id: string) {
		modals.newModal({
			text: text(`Orthodontic case will be deleted`),
			onConfirm: () => this.delete(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
}

export let orthoCases: null | OrthoCases = null;

export const setOrthoCasesStore = (store: OrthoCases) => (orthoCases = store);
