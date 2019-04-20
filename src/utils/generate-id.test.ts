import { generateID } from "@utils";
function generateSet(len?: number, cons?: string) {
	const set: string[] = [];
	let a = 1000;
	while (a--) {
		set.push(generateID(len, cons));
	}
	return set;
}

describe("@utils: generate IDs", () => {
	const noLength = generateSet();
	const length20 = generateSet(20);
	const both = noLength.concat(length20);
	const constant = generateID(0, "constant");

	it("generates IDs while not giving length", () => {
		expect(noLength.filter(x => x.length !== 10).length).toBe(0);
	});
	it("generates IDs while giving length", () => {
		expect(length20.filter(x => x.length !== 20).length).toBe(0);
	});
	it("generates IDs as constants", () => {
		expect(constant).toBe("constant");
	});
	it("generates IDs that does not start with a number", () => {
		expect(both.filter(x => x.match(/^\d/)).length).toBe(0);
	});
});
