import { round } from "@utils";
describe("@utils: round", () => {
	it("Rounds floats: 1.232323", () => {
		expect(round(1.232323)).toBe(1.23);
	});
	it("Rounds floats: 1.237", () => {
		expect(round(1.237)).toBe(1.24);
	});
	it("Rounds floats: 1.1", () => {
		expect(round(1.1)).toBe(1.1);
	});
	it("Rounds floats: 1", () => {
		expect(round(1)).toBe(1);
	});
});
