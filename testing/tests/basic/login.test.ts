import { app, assert, interact } from "../../utils";
import { TestResult, TestSuite } from "../interface";
/**
 * TODO: login while online
 * TODO: login while offline
 * TODO: login while online using cookies
 * TODO: login while offline using saved session
 * TODO: login for user with PIN
 */

const staffName = "Alex Corvi";

export const loginSuite: TestSuite = {
	async noServer(): TestResult {
		// start no server
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		// create new staff member
		await interact.waitAndInput("#new-user-name", staffName);
		interact.waitAndClick("#create-new-user-btn");

		// go to staff page and make sure it's there
		await interact.waitForEl(".main-component");
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		assert.elContains(".staff-component", staffName);

		// after resetting the application, staff member must still be there
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		await interact.waitForEl("#choose-user");
		assert.elContains("#choose-user", staffName);
	},

	async defaultServerField() {
		app.reset();
		await interact.waitForEl(".input-server input");
		assert.elValue(".input-server input", "http://localhost:5984");
	},

	async loginWithPIN() {
		// start no server
		await interact.waitAndClick(".no-server-mode");
		await interact.waitAndClick(".ms-Persona");
		// go to staff page and input a PIN
		await interact.waitForEl(".main-component");
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		await interact.waitAndClick(".alexcorvi .permission");
		await interact.waitForEl("#login-pin");
		await interact.typeIn("#login-pin", "1234");
		// visit a couple of routes
		await app.goToPage("patients");
		await interact.waitForEl(`.patients-component`);
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		// and then back to PIN to make sure its there
		await interact.waitAndClick(".alexcorvi .permission");
		assert.elValue("#login-pin", "1234");
		// reset and go to no server mode again
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		await interact.waitForEl("#choose-user");
		// now should be asked for a PIN
		// we'll enter an invalid one first
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl("#modal-input");
		await interact.typeIn("#modal-input", "12345"); // invalid
		interact.waitAndClick("#confirm-modal-btn");
		// expect an error message
		await interact.waitForEl(".message-inner");
		// we'll enter the valid one now
		interact.waitAndClick(".ms-Persona");
		await interact.waitForEl("#modal-input");
		await interact.typeIn("#modal-input", "1234"); // valid
		interact.waitAndClick("#confirm-modal-btn");
		// we should be in
		await interact.waitForEl(".header-component");
	},

	async loginWhenOnline() {
		// resetting
		await app.reset();
		await app.removeCookies();

		// entering login data and login
		await interact.waitForEl(".input-server");
		await interact.typeIn(".input-identification input", "test");
		await interact.typeIn(".input-password input", "test");
		await interact.waitAndClick(".proceed-login");

		// check if actually logged in
		await interact.waitForEl("#choose-user");
	},

	async loginWhenOnlineUsingCookies() {
		// resetting
		await app.reset();
		await app.removeCookies();

		// entering login data and login
		await interact.waitForEl(".input-server");
		await interact.typeIn(".input-identification input", "test");
		await interact.typeIn(".input-password input", "test");
		await interact.waitAndClick(".proceed-login");

		// check if actually logged in
		await interact.waitForEl("#choose-user");

		// then do a reset
		await app.reset();

		/// we should be logged in again
		await interact.waitForEl("#choose-user");
	}
};
