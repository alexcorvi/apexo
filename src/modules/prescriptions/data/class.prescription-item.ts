import { PrescriptionItemForm, PrescriptionItemJSON, itemFormToString, stringToItemForm } from './index';
import { computed, observable } from 'mobx';

import { generateID } from '../../../assets/utils/generate-id';

export class PrescriptionItem {
	[key: string]: string | number | Function;

	_id: string = generateID();

	@observable name: string = '';

	@observable doseInMg: number = 0;

	@observable timesPerDay: number = 0;

	@observable form: PrescriptionItemForm = PrescriptionItemForm.capsule;

	/**
	 * Converts prescription's data to JSON
	 * 
	 * @returns {PrescriptionItemJSON} 
	 * @memberof PrescriptionItem
	 */
	toJSON(): PrescriptionItemJSON {
		return {
			_id: this._id,
			name: this.name,
			doseInMg: this.doseInMg,
			timesPerDay: this.timesPerDay,
			form: itemFormToString(this.form)
		};
	}

	/**
	 * Creates an instance of PrescriptionItem from JSON data
	 * @param {PrescriptionItemJSON} [json] 
	 * @memberof PrescriptionItem
	 */
	constructor(json?: PrescriptionItemJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	/**
	 * Updates from JSON
	 * 
	 * @param {PrescriptionItemJSON} json 
	 * @memberof PrescriptionItem
	 */
	fromJSON(json: PrescriptionItemJSON) {
		this.name = json.name;
		this._id = json._id;
		this.doseInMg = json.doseInMg;
		this.timesPerDay = json.timesPerDay;
		this.form = stringToItemForm(json.form);
	}
}
