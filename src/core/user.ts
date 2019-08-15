import { status } from "@core";
import * as core from "@core";
import { staff } from "@modules";
import * as utils from "@utils";
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

	@computed
	get tomorrowAppointments() {
		if (!this.currentUser) {
			return [];
		} else if (!this.currentUser.weeksAppointments) {
			return [];
		} else {
			return (
				this.currentUser.weeksAppointments[
					new Date(
						new Date().getTime() + utils.day + utils.hour
					).toLocaleDateString("en-us", { weekday: "long" })
				] || []
			);
		}
	}

	show() {
		core.router.selectMain("user");
		setTimeout(() => {
			core.router.selectTab("today");
		}, 100);
	}
	hide() {
		core.router.unSelect();
	}
}

export const user = new UserData();
