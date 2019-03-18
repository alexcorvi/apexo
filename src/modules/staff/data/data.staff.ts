import { observable } from "mobx";

import { API } from "../../../core";
import { StaffMember } from "./class.member";
import { appointmentsData } from "../../appointments/index";
import { lang } from "../../../core/i18/i18";

class StaffData {
	ignoreObserver: boolean = false;

	@observable list: StaffMember[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		API.modals.newModal({
			message: `${lang("Are you sure you want to delete")} ${
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
		const currentID = API.user.currentUser._id;
		const i = this.getIndexByID(id);

		const member = this.list.splice(i, 1)[0];

		// remove member from appointments
		appointmentsData.appointments.list.forEach((appointment, index) => {
			const doc_id_i = appointment.staffID.indexOf(member._id);
			if (doc_id_i > -1) {
				appointmentsData.appointments.list[index].staffID.splice(
					doc_id_i,
					1
				);
			}
		});

		// logout if it's the same user
		if (currentID === id) {
			API.login.resetUser();
		}
	}
}

export default new StaffData();
