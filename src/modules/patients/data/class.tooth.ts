import { ToothCondition, ToothJSON } from './index';
import { computed, observable } from 'mobx';

import { convert } from '../../../assets/utils/teeth-numbering-systems';

export class Tooth {
	/**
	 * ISO number of the tooth
	 * 
	 * @type {number}
	 * @memberof Tooth
	 */
	ISO: number = 11;

	/**
	 * Universal nomenclature of the tooth
	 * 
	 * @readonly
	 * @memberof Tooth
	 */
	get Universal() {
		return convert(this.ISO).Universal;
	}

	/**
	 * Palmers nomenclature of the tooth
	 * 
	 * @readonly
	 * @memberof Tooth
	 */
	get Palmer() {
		return convert(this.ISO).Palmer;
	}

	/**
	 * Name of the tooth
	 * 
	 * @readonly
	 * @memberof Tooth
	 */
	get Name() {
		return convert(this.ISO).Name;
	}

	/**
	 * Tooth condition
	 * 
	 * @type {ToothCondition}
	 * @memberof Tooth
	 */
	@observable condition: keyof typeof ToothCondition = 'sound';

	/**
	 * Notes about the dental history of the tooth
	 * 
	 * @type {string[]}
	 * @memberof Tooth
	 */
	@observable notes: string[] = [];

	/**
	 * Creates an instance of Tooth from tooth number or full JSON data
	 * @param {(number | ToothJSON | null)} input 
	 * @memberof Tooth
	 */
	constructor(input: number | ToothJSON | null) {
		if (typeof input === 'number') {
			this.ISO = input;
		} else if (!!input) {
			this.fromJSON(input);
		}
	}

	/**
	 * Updates the class from json data
	 * 
	 * @param {ToothJSON} input 
	 * @memberof Tooth
	 */
	fromJSON(input: ToothJSON) {
		this.ISO = input.ISO;
		this.condition = input.condition;
		this.notes = input.notes;
	}

	/**
	 * Convert all tooth data to JSON
	 * 
	 * @returns {ToothJSON} 
	 * @memberof Tooth
	 */
	toJSON(): ToothJSON {
		return {
			ISO: this.ISO,
			condition: this.condition,
			notes: Array.from(this.notes)
		};
	}
}
