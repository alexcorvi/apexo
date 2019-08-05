import { decode, encode, num } from "@utils";

const salt = location.host
	.split("")
	.map(x => x.charCodeAt(0))
	.reduce((a, b) => a + b, 0);

export function encrypt(str: string) {
	return encode(
		str
			.split("")
			.map(x => x.charCodeAt(0) + salt)
			.join(",")
	);
}

export function decrypt(str: string) {
	return decode(str)
		.split(",")
		.map(x => String.fromCharCode(num(x) - salt))
		.join("");
}
