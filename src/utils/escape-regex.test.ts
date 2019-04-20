import { escapeRegExp } from "@utils";

describe("@utils: escape regex", () => {
	const string = `All of these should be escaped: \\ ^ $ * + ? . ( ) | { } [ ]`;
	const notHaving = "any";

	it("Escaping regex", () => {
		expect(escapeRegExp(string)).toBe(
			`All of these should be escaped: \\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]`
		);
	});

	it("Non regex remains untouched", () => {
		expect(escapeRegExp(notHaving)).toBe(notHaving);
	});
});
