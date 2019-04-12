import { modals, text } from "@core";
import { PrescriptionItem } from "@modules";
import { observable } from "mobx";

class Prescriptions {
	ignoreObserver: boolean = false;

	@observable list: PrescriptionItem[] = [];

	findIndexByID(id: string) {
		return this.list.findIndex(item => item._id === id);
	}

	deleteByID(id: string) {
		const i = this.findIndexByID(id);
		this.list.splice(i, 1);
	}

	deleteModal(id: string) {
		const i = this.findIndexByID(id);

		modals.newModal({
			message: text(`Are you sure you want to delete the prescription?`),
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
}

export const prescriptions = new Prescriptions();
