const salt = location.host
	.split("")
	.map(x => x.charCodeAt(0))
	.reduce((a, b) => a + b, 0);

export function encrypt(str: string) {
	return str
		.split("")
		.map(x => x.charCodeAt(0) + salt)
		.join(",");
}

export function decrypt(str: string) {
	return str
		.split(",")
		.map(x => String.fromCharCode(Number(x) - salt))
		.join("");
}
