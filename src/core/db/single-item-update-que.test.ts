import { singleItemUpdateQue } from "./single-item-update-que";
describe("@core: DB", () => {
	describe("single item update que", () => {
		let called = 0;
		singleItemUpdateQue["1"] = async () => called++;
		it("function is called, only once", done => {
			setTimeout(() => {
				expect(called).toBe(1);
				done();
			}, 3500);
		});
	});
});
