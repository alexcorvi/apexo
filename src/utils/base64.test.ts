import * as base64 from "./base64";

describe("@utils: base64", () => {
	const latin = "apexo1234";
	const nonLatin = "عليひらがな";
	const symbols = "☤☥☦☧☨☩☪☫☬";
	const emoji = "😁";

	it("Encoding/Decoding latin", () => {
		expect(base64.decode(base64.encode(latin))).toBe(latin);
	});
	it("Encoding/Decoding non latin", () => {
		expect(base64.decode(base64.encode(nonLatin))).toBe(nonLatin);
	});
	it("Encoding/Decoding symbols", () => {
		expect(base64.decode(base64.encode(symbols))).toBe(symbols);
	});
	it("Encoding/Decoding emoji", () => {
		expect(base64.decode(base64.encode(emoji))).toBe(emoji);
	});
});
