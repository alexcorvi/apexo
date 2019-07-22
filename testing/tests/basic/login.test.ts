import { app, assert, interact } from "../../utils";
import { TestResult, TestSuite } from "../interface";
/**
 * TODO: login while online
 * TODO: login while offline
 * TODO: login while online using cookies
 * TODO: login while offline using saved session
 * TODO: login for user with PIN
 */
export const loginSuite: TestSuite = {
	async noServer(): TestResult {
		// start new server
		await app.hardReset();
		await interact.waitAndClick(".no-server-mode");
		// create new staff member
		await interact.waitAndInput("#new-user-name", "staff A");
		interact.click("#create-new-user-btn");

		// go to staff page and make sure it's there
		await interact.waitForEl(".main-component");
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		assert.elContains(".staff-component", "staff A");

		// after resetting the application, staff member must still be there
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		await interact.waitForEl("#choose-user");
		assert.elContains("#choose-user", "staff A");
	}
};
