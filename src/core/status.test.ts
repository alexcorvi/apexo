import "../mocks/browser-mocks";
import { mockResponse } from "../mocks/browser-mocks";
import "../mocks/state-mocks";
import { LoginStep, Status } from "@core";
import { staff } from "@modules";
import { store } from "@utils";
import { Md5 } from "ts-md5";

describe("@core: status: login & logout", () => {
	const server = "http://any";
	const username = "any";
	const password = "any";

	let status = new Status();

	beforeEach(() => {
		status = new Status();
	});

	describe("Online login", () => {
		it("false credentials", async done => {
			const errorMessage = "Incorrect credentials were given";
			mockResponse("post", 401, {
				reason: errorMessage
			});
			const res = await status.loginWithCredentialsOnline({
				username,
				password,
				server,
				noStart: true
			});
			expect(res).toBe(errorMessage);
			done();
		});
		it("correct credentials", async done => {
			mockResponse("post", 200, {});
			const res = await status.loginWithCredentialsOnline({
				username,
				password,
				server,
				noStart: true
			});
			expect(res).toBe(true);
			done();
		});
	});

	describe("Offline login", () => {
		store.set(
			"LSL_hash",
			Md5.hashStr(server + username + password).toString()
		);

		it("Login while offline: false credentials", async done => {
			const res = await status.loginWithCredentialsOffline({
				username,
				password: "else",
				server,
				noStart: true
			});
			expect(res).toBe(
				"This was not the last username/password combination you used!"
			);
			done();
		});

		it("Login while offline: correct credentials", async done => {
			const res = await status.loginWithCredentialsOffline({
				username,
				password,
				server,
				noStart: true
			});
			expect(res).toBe(true);
			done();
		});
	});

	describe("user setting", () => {
		it("checking setting a valid user", () => {
			const id = staff!.docs[0]._id;
			store.set("user_id", id);
			const res = status.checkAndSetUserID();
			expect(res).toBe(true);
			expect(status.currentUserID).toBe(id);
			expect(status.step).toBe(LoginStep.allDone);
		});
		it("checking setting an invalid user", () => {
			const id = "else";
			store.set("user_id", id);
			const res = status.checkAndSetUserID();
			expect(res).toBe(false);
			expect(status.currentUserID).toBe("");
			expect(status.step === LoginStep.allDone).toBe(false);
		});
		it("checking resetting user", () => {
			const id = staff!.docs[0]._id;
			store.set("user_id", id);
			const res = status.checkAndSetUserID();
			status.resetUser();
			expect(status.step).toBe(LoginStep.chooseUser);
			expect(status.currentUserID).toBe("");
			expect(store.found("user_id")).toBe(false);
		});
	});
});
