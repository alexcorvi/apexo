import { textualFilter } from "@utils";
describe("@utils: textual filters", () => {
	const values = [
		{
			name: "ali",
			searchableString: "ali@gmail.com"
		},
		{
			name: "adam",
			searchableString: "adam@outlook.com"
		},
		{
			name: "alex",
			searchableString: "alex@outlook.com"
		},
		{
			name: "bill",
			searchableString: "bill@outlook.com"
		},
		{
			name: "john",
			searchableString: "john@med.edu"
		}
	];

	it("Searching for name", () => {
		const result = textualFilter(values, "bill");
		expect(result.length).toBe(1);
		expect(result[0].name).toBe("bill");
	});

	it("Searching for @ sign", () => {
		const result = textualFilter(values, "@");
		expect(result.length).toBe(values.length);
	});

	it("Searching for .com", () => {
		const result = textualFilter(values, ".com");
		expect(result.length).toBe(4);
	});

	it("Searching for .edu", () => {
		const result = textualFilter(values, ".edu");
		expect(result.length).toBe(1);
	});

	it("Searching for @outlook", () => {
		const result = textualFilter(values, "@outlook");
		expect(result.length).toBe(3);
	});

	it("Searching does not change the order", () => {
		const result = textualFilter(values, "@outlook");
		expect(result[0].name).toBe("adam");
		expect(result[1].name).toBe("alex");
		expect(result[2].name).toBe("bill");
	});
});
