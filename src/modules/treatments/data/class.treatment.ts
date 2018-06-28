import { computed, observable } from 'mobx';
import { TreatmentJSON } from './index';
import { generateID } from '../../../assets/utils/generate-id';
import { settingsData } from '../../settings';

export class Treatment {
	// Observables

	/**
	 * A unique ID for every treatment
	 * 
	 * @type {string}
	 * @memberof Treatment
	 */
	_id: string = generateID();

	/**
	 * Type (name) of the treatment
	 * 
	 * @type {string}
	 * @memberof Treatment
	 */
	@observable type: string = '';

	/**
	 * Treatment expected expenses
	 * 
	 * @type {number}
	 * @memberof Treatment
	 */
	@observable expenses: number = 0;

	/**
	 * Convert this treatment data to JSON
	 * 
	 * @returns {TreatmentJSON} 
	 * @memberof Treatment
	 */
	public toJSON(): TreatmentJSON {
		return {
			_id: this._id,
			type: this.type,
			expenses: this.expenses
		};
	}

	/**
	 * Creates an instance of Treatment from JSON data
	 * @param {TreatmentJSON} [json] 
	 * @memberof Treatment
	 */
	constructor(json?: TreatmentJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	/**
	 * Updates based on JSON data
	 * 
	 * @param {TreatmentJSON} json 
	 * @memberof Treatment
	 */
	fromJSON(json: TreatmentJSON) {
		this._id = json._id;
		this.type = json.type;
		this.expenses = json.expenses || 0;
	}
}
