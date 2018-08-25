import { PrescriptionItem, PrescriptionItemForm, itemFormToString } from './index';
import { computed, observable } from 'mobx';

import { API } from '../../../core';
import { appointmentsData } from '../../appointments';
import { escapeRegExp } from '../../../assets/utils/escape-regex';

class Prescriptions {
	ignoreObserver: boolean = false;

	/**
	 * A list of all the available items
	 * 
	 * @type {PrescriptionItem[]}
	 * @memberof Prescriptions
	 */
	@observable list: PrescriptionItem[] = [];

	/**
	 * get item index by ID
	 * 
	 * @param {string} id 
	 * @returns 
	 * @memberof Prescriptions
	 */
	findIndexByID(id: string) {
		return this.list.findIndex((item) => item._id === id);
	}

	/**
	 * Delete item by it's ID
	 * 
	 * @param {string} id 
	 * @memberof Prescriptions
	 */
	deleteByID(id: string) {
		const i = this.findIndexByID(id);
		this.list.splice(i, 1);
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
			message: `Are you sure you want to delete ${this.list[i].name}'s prescription.`,
			onConfirm: () => this.deleteByID(id)
		});
	}
}

export default new Prescriptions();
