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
	 * A search filter to be applied to the list
	 * 
	 * @type {string}
	 * @memberof Prescriptions
	 */
	@observable filter: string = '';

	/**
	 * Search results
	 * 
	 * @readonly
	 * @type {PrescriptionItem[]}
	 * @memberof Prescriptions
	 */
	@computed
	get filtered(): PrescriptionItem[] {
		if (this.filter === '') {
			return this.list;
		} else {
			const filters = this.filter.split(' ').map((filterString) => new RegExp(escapeRegExp(filterString), 'gim'));
			return this.list.filter((entry) => {
				const entryString = JSON.stringify(entry);
				return filters.every((filter) => {
					return filter.test(entryString);
				});
			});
		}
	}

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
		this.list.splice(i, 1)[0];
	}
}

export default new Prescriptions();
