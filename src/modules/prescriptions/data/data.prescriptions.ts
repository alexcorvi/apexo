import { PrescriptionItem } from "./index";
import { observable } from "mobx";

import { API } from "../../../core";

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

		API.modals.newModal({
			message: `Are you sure you want to delete ${
				this.list[i].name
			}'s prescription.`,
			onConfirm: () => this.deleteByID(id)
		});
	}
}

export default new Prescriptions();
