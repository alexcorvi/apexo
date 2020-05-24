import { dbAction, modals, router, text } from "@core";
import { PrescriptionItem, PrescriptionItemSchema } from "@modules";
import * as modules from "@modules";
import { observable } from "mobx";
import { Store } from "pouchx";

export class Prescriptions extends Store<
	PrescriptionItemSchema,
	PrescriptionItem
> {
	@observable selectedID: string = router.currentLocation.split("/")[1] || "";
	deleteModal(id: string) {
		modals.newModal({
			text: text(`are you sure you want to delete the prescription?`).c,
			onConfirm: () => this.delete(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random(),
		});
	}

	async afterChange() {
		// resync on change
		dbAction("resync", modules.prescriptionsNamespace);
	}
}

export let prescriptions: Prescriptions | null = null;
export function setPrescriptionsStore(store: Prescriptions) {
	prescriptions = store;
}
