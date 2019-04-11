import { status } from "@core";
import { staff } from "@modules";
import { computed, observable } from "mobx";

class UserData {
	@observable visible: boolean = false;
	@computed
	get currentUser() {
		return staff.list[staff.getIndexByID(status.currentUserID)];
	}
	get todayAppointments() {
		if (!this.currentUser) {
			return [];
		} else if (!this.currentUser.weeksAppointments) {
			return [];
		} else {
			return this.currentUser.weeksAppointments[
				new Date().toLocaleDateString("en-us", { weekday: "long" })
			];
		}
	}
}

export const user = new UserData();
