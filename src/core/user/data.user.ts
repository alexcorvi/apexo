import { computed, observable } from "mobx";

import { API } from "../";
import { data } from "../../modules";

class UserData {
	@observable visible: boolean = false;
	@computed
	get currentUser() {
		return data.staffData.staffMembers.list[
			data.staffData.staffMembers.getIndexByID(API.login.currentUserID)
		];
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
