import { num } from "@utils";
describe("@utils: num", () => {
	it("return number if actually given one", () => {
		expect(num(1)).toBe(1);
	});
	it("return number if given stringified Number", () => {
		expect(num("1.6")).toBe(1.6);
	});
	it("return 0 if the string would return NaN", () => {
		expect(num("any")).toBe(0);
	});
});
