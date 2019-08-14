import { status } from "@core";
import * as core from "@core";
import { staff } from "@modules";
import { computed, observable } from "mobx";

class UserData {
	@computed
	get currentUser() {
		return staff!.docs.find(x => x._id === status.currentUserID);
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
		core.router.selectMain("user");
	}
	hide() {
		core.router.unSelectMain();
	}
}

export const user = new UserData();
