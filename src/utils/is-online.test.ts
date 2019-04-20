import { isOnline } from "@utils";

describe("@utils: isOnline", () => {
	const onlineServer = "http://localhost:5984";
	const offlineServer = "any";

	it("online server", async done => {
		const thisOnline = await isOnline(onlineServer);
		expect(thisOnline).toBe(true);
		done();
	});

	it("offline server", async done => {
		const thisOnline = await isOnline(offlineServer);
		expect(thisOnline).toBe(false);
		done();
	});
});
