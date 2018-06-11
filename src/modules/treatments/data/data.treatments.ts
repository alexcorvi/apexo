import { computed, observable } from 'mobx';

import { API } from '../../../core';
import { Treatment } from './class.treatment';
import { appointmentsData } from '../../appointments';

class TreatmentData {
	ignoreObserver: boolean = false;
	/**
	 * List of all available treatments
	 * 
	 * @type {Treatment[]}
	 * @memberof TreatmentData
	 */
	@observable list: Treatment[] = [];

	/**
	 * get a treatment index on the list from its ID
	 * 
	 * @param {string} id 
	 * @returns 
	 * @memberof TreatmentData
	 */
	getIndexByID(id: string) {
		return this.list.findIndex((x) => x._id === id);
	}

	/**
	 * Delete a treatment by ID
	 * 
	 * @param {string} id 
	 * @memberof TreatmentData
	 */
	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const treatment = this.list[i];
		API.modals.newModal({
			message: `Treatment "${treatment.type}" will deleted`,
			onConfirm: () => {
				this.deleteByID(id);
			}
		});
	}

	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const treatment = this.list.splice(i, 1)[0];
		appointmentsData.appointments.list.forEach((appointment, index) => {
			if (appointment.treatmentID === treatment._id) {
				appointmentsData.appointments.list[index].treatmentID = `${treatment.type}|${treatment.expenses}`;
			}
		});
	}
}

export default new TreatmentData();
