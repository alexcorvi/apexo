import { dropboxAccessToken } from "../secrets";
import { files } from "@core";
import { setting } from "@modules";
import { decode } from "@utils";
describe("@core: files", () => {
	const dir = "temp";
	describe("DropBox storage status", () => {
		it("With no DropBox AT", () => {
			let caught = false;
			files
				.status()
				.then()
				.catch(() => (caught = true))
				.finally(() => expect(caught).toBe(true));
		});

		it("With invalid DropBox AT", () => {
			let caught = false;
			setting.setSetting("dropbox_accessToken", "something invalid");
			files
				.status()
				.then()
				.catch(() => (caught = true))
				.finally(() => expect(caught).toBe(true));
		});

		it("With valid DropBox AT", () => {
			let valid = false;
			setting.setSetting("dropbox_accessToken", dropboxAccessToken);
			files
				.status()
				.then(() => (valid = true))
				.catch(() => (valid = false))
				.finally(() => expect(valid).toBe(true));
		});
	});
	describe("Saving/getting files", () => {
		const fileA = new Blob(["a"], {
			type: "text/plain"
		});
		it("saves, gets, removes files", async done => {
			jest.setTimeout(90000);
			setting.setSetting("dropbox_accessToken", dropboxAccessToken);
			const pathA = await files.save({
				blob: fileA,
				ext: "temp",
				dir
			});
			expect(typeof pathA).toBe("string");
			const resA = await files.get(pathA);
			expect(decode(resA.split(";base64,")[1])).toBe("a");
			await files.remove(pathA);
			let thrown = false;
			files
				.get(pathA)
				.then()
				.catch(() => (thrown = true))
				.finally(() => expect(thrown).toBe(true));
			done();
		});
	});
});
