import { modals, status, text, user } from "@core";
import { appointments, StaffMember } from "@modules";
import { observable } from "mobx";

class StaffData {
	ignoreObserver: boolean = false;

	@observable list: StaffMember[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		modals.newModal({
			message: `${text("Are you sure you want to delete")} ${
				this.list[i].name
			}`,
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}

	private deleteByID(id: string) {
		const currentID = user.currentUser._id;
		const i = this.getIndexByID(id);

		const member = this.list.splice(i, 1)[0];

		// remove member from appointments
		appointments.list.forEach((appointment, index) => {
			const doc_id_i = appointment.staffID.indexOf(member._id);
			if (doc_id_i > -1) {
				appointments.list[index].staffID.splice(doc_id_i, 1);
			}
		});

		// logout if it's the same user
		if (currentID === id) {
			status.resetUser();
		}
	}
}

export const staff = new StaffData();
