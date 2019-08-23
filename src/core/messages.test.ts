import { Messages } from "@core";
describe("@core: modals", () => {
	const messages = new Messages();
	let expired = false;
	describe("creating and expiring", () => {
		messages.newMessage({
			id: "a",
			text: "a",
			onExpire: () => {
				expired = true;
			},
			expiresIn: 1000
		});

		it("created successfully", () => {
			expect(messages.activeMessages.length).toBe(1);
		});
		it("expires successfully", done => {
			setTimeout(() => {
				expect(messages.activeMessages.length).toBe(0);
				expect(expired).toBe(true);
				done();
			}, 1500);
		});
	});
});
