import { computed, observable, observe } from 'mobx';

import { API } from '../../../core';
import { Doctor } from './class.doctor';
import { escapeRegExp } from '../../../assets/utils/escape-regex';
import { patientsData } from '../../patients/index';
import { appointmentsData } from '../../appointments/index';

class DoctorsData {
	ignoreObserver: boolean = false;

	/**
     * List of doctors
     * 
     * @type {Doctor[]}
     * @memberof DoctorsData
     */
	@observable list: Doctor[] = [];

	/**
     * Filter to be applied to doctors list for searching purposes
     * 
     * @type {string}
     * @memberof PatientsData
     */
	@observable filter: string = '';

	/**
	 * Doctors that has the criteria of the search filter
	 * 
	 * @readonly
	 * @type {Patient[]}
	 * @memberof PatientsData
	 */
	@computed
	get filtered(): Doctor[] {
		if (this.filter === '') {
			return this.list;
		} else {
			const filters = this.filter.split(' ').map((filterString) => new RegExp(escapeRegExp(filterString), 'gim'));
			return this.list.filter((doctor) => {
				const entryString = `
					${doctor.name} ${doctor.email} ${doctor.phone}
					${doctor.appointments
						.map((x) => x.treatment.type + ' ' + x.prescriptions.map((x) => x.prescription).join(' '))
						.join(' ')}
				`;
				return filters.every((filter) => {
					return filter.test(entryString);
				});
			});
		}
	}

	/**
     * Get doctor index in the list by his id
     * 
     * @param {string} id 
     * @returns 
     * @memberof DoctorsData
     */
	getIndexByID(id: string) {
		return this.list.findIndex((x) => x._id === id);
	}

	/**
	 * Delete a doctor by ID
	 * 
	 * @param {string} id 
	 * @memberof PatientsData
	 */
	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		API.modals.newModal({
			message: `Are you sure you want to delete Dr. ${this.list[i].name}?`,
			onConfirm: () => this.deleteByID(id)
		});
	}

	deleteByID(id: string) {
		const currentID = API.user.currentDoctor._id;
		const i = this.getIndexByID(id);

		const doctor = this.list.splice(i, 1)[0];

		// remove doctor from appointments
		appointmentsData.appointments.list.forEach((appointment, index) => {
			const doc_id_i = appointment.doctorsID.indexOf(doctor._id);
			if (doc_id_i > -1) {
				appointmentsData.appointments.list[index].doctorsID.splice(doc_id_i, 1);
			}
		});

		// logout if it's the same doctor
		if (currentID === id) {
			API.user.logout();
		}
	}
}

export default new DoctorsData();
