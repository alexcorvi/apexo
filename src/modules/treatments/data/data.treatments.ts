import { modals, text } from "@core";
import { appointments, Treatment } from "@modules";
import { computed, observable } from "mobx";

class TreatmentData {
	ignoreObserver: boolean = false;

	@observable list: Treatment[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const treatment = this.list[i];
		modals.newModal({
			message: `${text("Treatment")} "${treatment.type}" ${text(
				"will be deleted"
			)}`,
			onConfirm: () => {
				this.deleteByID(id);
			},
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}

	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const treatment = this.list.splice(i, 1)[0];
		appointments.list.forEach((appointment, index) => {
			if (appointment.treatmentID === treatment._id) {
				appointments.list[index].treatmentID = `${treatment.type}|${
					treatment.expenses
				}`;
			}
		});
	}
}

export const treatments = new TreatmentData();
