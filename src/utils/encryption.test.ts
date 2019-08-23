import { decrypt, encrypt } from "@utils";

describe("@utils: encryption and decryption", () => {
	const latin = "apexo1234";
	const nonLatin = "عليひらがな";
	const symbols = "☤☥☦☧☨☩☪☫☬";
	const emoji = "😁";
	const all = latin + nonLatin + symbols + emoji;

	it("encrypting/decrypting latin", () => {
		expect(decrypt(encrypt(latin))).toBe(latin);
	});

	it("encrypting/decrypting non-latin", () => {
		expect(decrypt(encrypt(nonLatin))).toBe(nonLatin);
	});

	it("encrypting/decrypting symbols", () => {
		expect(decrypt(encrypt(symbols))).toBe(symbols);
	});

	it("encrypting/decrypting latin", () => {
		expect(decrypt(encrypt(emoji))).toBe(emoji);
	});

	it("encrypting/decrypting all-together", () => {
		expect(decrypt(encrypt(all))).toBe(all);
	});
});
