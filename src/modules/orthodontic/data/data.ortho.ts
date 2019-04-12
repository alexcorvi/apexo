import { files, modals, text } from "@core";
import { CephalometricItem, OrthoCase, patients } from "@modules";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";

class OrthoCases {
	@observable triggerUpdate: number = 0;

	ignoreObserver: boolean = false;

	@observable list: OrthoCase[] = [];

	@observable filter: string = "";

	@computed
	get filtered(): OrthoCase[] {
		if (this.filter === "") {
			return this.list;
		} else {
			const filters = this.filter
				.split(" ")
				.map(
					filterString =>
						new RegExp(escapeRegExp(filterString), "gim")
				);
			return this.list.filter(orthoCase =>
				filters.every(filter => filter.test(JSON.stringify(orthoCase)))
			);
		}
	}

	@computed
	get allPatientsIDs() {
		return this.list.map(orthoCase => orthoCase.patientID);
	}

	@computed
	get patientsWithNoOrtho() {
		return patients.list.filter(
			patient => this.allPatientsIDs.indexOf(patient._id) === -1
		);
	}

	toCephString(obj: CephalometricItem): Promise<string> {
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

	getCephCoordinates(string: string): string {
		return JSON.stringify(JSON.parse(string).pointCoordinates);
	}

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteByPatientID(id: string) {
		const ortho = this.list.find(o => o.patientID === id);
		if (ortho) {
			this.deleteByID(ortho._id);
		}
	}

	private deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const orthoCase = this.list.splice(i, 1)[0];
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const orthoCase = this.list[i];
		modals.newModal({
			message: text(`Orthodontic case will be deleted`),
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
}

export const orthoCases = new OrthoCases();
