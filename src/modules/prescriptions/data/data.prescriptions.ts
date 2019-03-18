import { PrescriptionItem } from "./index";
import { observable } from "mobx";

import { API } from "../../../core";
import { lang } from "../../../core/i18/i18";

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
			message: lang(`Are you sure you want to delete the prescription?`),
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
}

export default new Prescriptions();
