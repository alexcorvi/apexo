import { computed, observable } from 'mobx';

import { API } from '../../../core';
import { Patient } from './index';
import { appointmentsData } from '../../appointments';
import { escapeRegExp } from '../../../assets/utils/escape-regex';
import { genderToString } from './enum.gender';
import { orthoData } from '../../orthodontic/index';

class PatientsData {
	ignoreObserver: boolean = false;
	/**
	 * A list of all the patients
	 * 
	 * @type {Patient[]}
	 * @memberof PatientsData
	 */
	@observable list: Patient[] = [];

	/**
	 * Get index of the patient (in the list) by the ID
	 * 
	 * @param {string} id 
	 * @returns 
	 * @memberof PatientsData
	 */
	findIndexByID(id: string) {
		return this.list.findIndex((x) => x._id === id);
	}

	deleteByID(id: string) {
		const i = this.findIndexByID(id);
		// delete from list
		const patient = this.list.splice(i, 1)[0];

		// delete appointments
		patient.appointments.forEach((appointment) => {
			appointmentsData.appointments.deleteByID(appointment._id);
		});

		// delete photos
		patient.gallery.forEach(async (fileID) => {
			await API.files.remove(fileID);
		});

		// delete orthodontic case
		orthoData.cases.deleteByPatientID(patient._id);
	}

	/**
	 * Delete a patient by ID
	 * 
	 * @param {string} id 
	 * @memberof PatientsData
	 */
	deleteModal(id: string) {
		const i = this.findIndexByID(id);

		API.modals.newModal({
			message: `All of the patient ${this.list[i].name}'s data will be deleted along with ${this.list[i]
				.appointments.length} appointments.`,
			onConfirm: () => this.deleteByID(id)
		});
	}
}

export default new PatientsData();
