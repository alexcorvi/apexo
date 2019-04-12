export function generateID(len: number = 10, constant?: string) {
	function dec2hex(dec: number) {
		return ("0" + dec.toString(16)).substr(-2);
	}
	if (!constant) {
		const arr = new Uint8Array((len || 10) / 2);
		window.crypto.getRandomValues(arr);
		return Array.from(arr, dec2hex).join("");
	} else {
		return constant;
	}
}
