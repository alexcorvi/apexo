import { computed, observable } from 'mobx';

import { API } from '../';
import { data } from '../../modules';

class UserData {
	@observable visible: boolean = false;
	@computed
	get currentDoctor() {
		return data.doctorsData.doctors.list[data.doctorsData.doctors.getIndexByID(API.login.currentDoctorID)];
	}
	get todayAppointments() {
		if (!this.currentDoctor) {
			return [];
		} else if (!this.currentDoctor.weeksAppointments) {
			return [];
		} else {
			return this.currentDoctor.weeksAppointments[new Date().getDay()];
		}
	}
	logout() {
		API.login.loggedIn = false;
		API.login.username = '';
		API.login.password = '';
		API.login.server = '';
		API.login.currentDoctorID = '';
	}
}

export const user = new UserData();
