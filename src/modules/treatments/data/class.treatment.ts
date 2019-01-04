import { computed, observable } from 'mobx';
import { generateID } from '../../../assets/utils/generate-id';
import { TreatmentJSON } from './index';

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

	@computed
	get searchableString() {
		return `
			${this.type} expenses ${this.expenses}
		`.toLowerCase();
	}

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
