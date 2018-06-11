import { Prompt } from './class.prompt';
import { observable } from 'mobx';

class PromptsData {
	/**
	 * list of prompts (DO NOT PUSH/SPLICE TO/FROM IT)
	 * 
	 * @type {Prompt[]}
	 * @memberof PromptsData
	 */
	@observable prompts: Prompt[] = [];

	/**
	 * Add a prompt
	 * 
	 * @param {Prompt} prompt 
	 * @memberof PromptsData
	 */
	public addPrompt(prompt: Prompt) {
		this.prompts.push(prompt);
		setTimeout(() => {
			if (this.removePromptByID(prompt.id)) {
				prompt.onExpire();
			}
		}, prompt.expiresIn);
	}

	/**
	 * remove a prompt
	 * 
	 * @param {string} id 
	 * @returns {boolean} 
	 * @memberof PromptsData
	 */
	public removePromptByID(id: string): boolean {
		const i = this.prompts.findIndex((x) => x.id === id);
		if (i === -1) {
			return false;
		} else {
			this.prompts.splice(i, 1);
			return true;
		}
	}
}

const prompts = new PromptsData();
export { prompts };
export default prompts;
