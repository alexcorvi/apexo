import { generateID } from '../../assets/utils/generate-id';
import { observable } from 'mobx';

export class Prompt {
	/**
	 * Unique ID for the prompt
	 * 
	 * @type {string}
	 * @memberof Prompt
	 */
	id: string = generateID();

	/**
	 * Textual message for the prompt
	 * 
	 * @type {string}
	 * @memberof Prompt
	 */
	@observable message: string = '';

	/**
	 * list of buttons
	 * 
	 * @memberof Prompt
	 */
	@observable buttons: { iconName?: string; title: string; onClick: () => void }[] = [];

	/**
	 * Icon to be viewed with the prompt
	 * 
	 * @type {string}
	 * @memberof Prompt
	 */
	iconName: string = '';

	/**
	 * Expire in (milliseconds)
	 * 
	 * @type {number}
	 * @memberof Prompt
	 */
	expiresIn: number = 10000;

	/**
	 * Callback on expire
	 * 
	 * @memberof Prompt
	 */
	onExpire: () => void = () => {};
}
