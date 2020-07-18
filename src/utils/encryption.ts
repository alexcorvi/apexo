import { decode, encode, num } from "@utils";

const salt = location.host
	.split("")
	.map((x) => x.charCodeAt(0))
	.reduce((a, b) => a + b, 0);

export function encrypt(str: string, specificSalt?: number) {
	return encode(
		str
			.split("")
			.map((x) => x.charCodeAt(0) + (specificSalt || salt))
			.join(",")
	);
}

export function decrypt(str: string, specificSalt?: number) {
	return decode(str)
		.split(",")
		.map((x) => String.fromCharCode(num(x) - (specificSalt || salt)))
		.join("");
}
