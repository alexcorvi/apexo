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
	getIndexByID(id: string) {
		return this.list.findIndex((item) => item._id === id);
	}

	/**
	 * Delete item by it's ID
	 * 
	 * @param {string} id 
	 * @memberof Prescriptions
	 */
	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		this.list.splice(i, 1);
	}
}

export default new Prescriptions();
