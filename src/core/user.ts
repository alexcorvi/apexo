import { status } from "@core";
import { staff } from "@modules";
import { computed, observable } from "mobx";

class UserData {
	@observable isVisible: boolean = false;
	@computed
	get currentUser() {
		return staff.list.find(x => x._id === status.currentUserID);
	}
	@computed
	get todayAppointments() {
		if (!this.currentUser) {
			return [];
		} else if (!this.currentUser.weeksAppointments) {
			return [];
		} else {
			return (
				this.currentUser.weeksAppointments[
					new Date().toLocaleDateString("en-us", { weekday: "long" })
				] || []
			);
		}
	}
	show() {
		this.isVisible = true;
	}
	hide() {
		this.isVisible = false;
	}
}

export const user = new UserData();
