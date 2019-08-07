import { dbAction, modals, text } from "@core";
import { appointments, Labwork, LabworkSchema } from "@modules";
import * as modules from "@modules";
import { Store } from "pouchx";

export class Labworks extends Store<LabworkSchema, Labwork> {
	async afterChange() {
		// resync on change
		dbAction("resync", modules.labworkNamespace);
	}

	deleteModal(id: string) {
		const labwork = this.docs.find(x => x._id === id);
		if (!labwork) {
			return;
		}
		modals.newModal({
			text: `${text("Labwork")} "${labwork.caseTitle}" ${text(
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
}

export let labworks: null | Labworks = null;

export const setLabworksStore = (store: Labworks) => (labworks = store);
