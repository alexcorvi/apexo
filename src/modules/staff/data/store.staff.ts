import { dbAction, modals, status, text } from "@core";
import { StaffMember, StaffMemberSchema } from "@modules";
import * as modules from "@modules";
import { computed } from "mobx";
import { Store } from "pouchx";

export class Staff extends Store<StaffMemberSchema, StaffMember> {
	@computed get operatingStaff() {
		return this.docs.filter(x => x.operates);
	}

	async afterChange() {
		// resync on change
		dbAction("resync", "doctors");
	}

	deleteModal(id: string) {
		const item = this.docs.find(x => x._id === id);
		if (!item) {
			return;
		}
		modals.newModal({
			text: `${text("Are you sure you want to delete")} ${item.name}`,
			onConfirm: () => this.delete(item._id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}

	async afterDelete(staffMember: StaffMember) {
		for (let index = 0; index < staffMember.appointments.length; index++) {
			// remove staff from operating on appointments
			staffMember.appointments[index].staffID = staffMember.appointments[
				index
			].staffID.filter(x => x !== staffMember._id);
		}

		// logout if it's the same user
		if (status.currentUserID === staffMember._id) {
			status.resetUser();
		}
	}
}

export let staff: Staff | null = null;
export const setStaffStore = (store: Staff) => (staff = store);
