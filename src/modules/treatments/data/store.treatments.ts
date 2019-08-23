import { dbAction, modals, text } from "@core";
import { appointments, Treatment, TreatmentSchema } from "@modules";
import * as modules from "@modules";
import { Store } from "pouchx";

export class Treatments extends Store<TreatmentSchema, Treatment> {
	async afterChange() {
		// resync on change
		dbAction("resync", modules.treatmentsNamespace);
	}

	deleteModal(id: string) {
		const treatment = this.docs.find(x => x._id === id);
		if (!treatment) {
			return;
		}
		modals.newModal({
			text: `${text("Treatment")} "${treatment.type}" ${text(
				"will be deleted"
			)}`,
			onConfirm: () => {
				this.delete(id);
			},
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}

	async afterDelete(treatment: Treatment) {
		appointments!.docs.forEach((appointment, index) => {
			if (appointment.treatmentID === treatment._id) {
				appointments!.docs[index].treatmentID = `${treatment.type}|${
					treatment.expenses
				}`;
			}
		});
	}
}

export let treatments: null | Treatments = null;

export const setTreatmentsStore = (store: Treatments) => (treatments = store);
