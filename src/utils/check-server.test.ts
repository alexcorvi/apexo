import { checkServer } from "./check-server";

describe("@utils: checking server", () => {
	const onlineServer = "http://localhost:5984";
	const offlineServer = "any";

	it("online server", async done => {
		const isOnline = await checkServer(onlineServer);
		expect(isOnline).toBe(true);
		done();
	});

	it("offline server", async done => {
		const isOnline = await checkServer(offlineServer);
		expect(isOnline).toBe(false);
		done();
	});
});
