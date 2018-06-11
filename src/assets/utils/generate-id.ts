import { API } from '../../core';

export function generateID(len: number = 20, constant?: string) {
	function dec2hex(dec: number) {
		return ('0' + dec.toString(16)).substr(-2);
	}
	if (!constant) {
		const arr = new Uint8Array((len || 20) / 2);
		window.crypto.getRandomValues(arr);
		return API.login.clinicID + '_' + Array.from(arr, dec2hex).join('');
	} else {
		return API.login.clinicID + '_' + constant;
	}
}
