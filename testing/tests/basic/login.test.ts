import { fixtures } from "../fixtures";
import { TestResult, TestSuite } from "../interface";
import { app, assert, interact, test } from "../utils";

export const loginSuite: TestSuite = {
	async loginNoServer(): TestResult {
		// start no server
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		// create new staff member
		await interact.waitAndInput("#new-user-name", fixtures.staffNames[0]);
		await interact.waitAndClick("#create-new-user-btn");

		// go to staff page and make sure it's there
		await interact.waitForEl(".main-component");
		await interact.waitForEl(".header-component");
		assert.attribute(".header-component", "data-login-type", "no-server");
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		assert.elContains(".staff-component", fixtures.staffNames[0]);

		// after resetting the application, staff member must still be there
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		await interact.waitForEl("#choose-user");
		assert.elContains("#choose-user", fixtures.staffNames[0]);
	},

	async loginWithCredentialsWhenOnline() {
		// resetting
		await app.reset();
		await app.removeCookies();

		// entering login data and login
		await interact.waitForEl(".input-server");
		await interact.typeIn(
			".input-identification input",
			fixtures.login.username
		);
		await interact.typeIn(".input-password input", fixtures.login.password);
		await interact.waitAndClick(".proceed-login");

		// check if actually logged in
		await interact.waitForEl("#choose-user");
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl(".header-component");

		assert.attribute(
			".header-component",
			"data-login-type",
			"login-credentials-online"
		);
	},

	async loginWhenOnlineWithActiveSession() {
		await loginSuite.loginWithCredentialsWhenOnline();

		// then do a reset
		await app.reset();
		//
		// we should be logged in again
		await interact.waitForEl("#choose-user");
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl(".header-component");
		assert.attribute(
			".header-component",
			"data-login-type",
			"initial-active-session"
		);
	},

	async loginOfflineWithSavedSession() {
		await loginSuite.loginWithCredentialsWhenOnline();
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl(".header-component");
		await test.offline();
		await app.reset({ retainLSLHash: true });
		await interact.waitAndClick(".ms-Persona");
		assert.attribute(
			".header-component",
			"data-login-type",
			"initial-lsl-hash-ts"
		);
		await test.online();
	},

	async loginOfflineWithCredentials() {
		await loginSuite.loginWithCredentialsWhenOnline();
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl(".header-component");
		await test.offline();
		console.log(navigator.onLine);
		await app.reset({ retainLSLHash: true });
		localStorage.removeItem("LSL_TS");
		await interact.waitForEl(".offline");
		await interact.typeIn(
			".input-identification input",
			fixtures.login.username
		);
		await interact.typeIn(".input-password input", fixtures.login.password);
		await interact.waitAndClick(".proceed-login");

		// check if actually logged in
		await interact.waitForEl("#choose-user");
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl(".header-component");

		assert.attribute(
			".header-component",
			"data-login-type",
			"login-credentials-offline"
		);
		await test.online();
	},

	async defaultServerField() {
		await app.reset();
		await app.removeCookies();
		await interact.waitForEl(".input-server input");
		assert.elValue(".input-server input", "http://localhost:5984");
	},

	async loginWithPIN() {
		await app.reset();
		await app.removeCookies();
		// start no server
		await interact.waitAndClick(".no-server-mode");
		await interact.waitAndClick(".ms-Persona");
		// go to staff page and input a PIN
		await interact.waitForEl(".main-component");
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		await interact.waitAndClick(".dralex .permission");
		await interact.waitForEl("#login-pin");
		await interact.typeIn("#login-pin", "1234");
		// visit a couple of routes
		await app.goToPage("patients");
		await interact.waitForEl(`.patients-component`);
		await app.goToPage("staff");
		await interact.waitForEl(`.staff-component`);
		// and then back to PIN to make sure its there
		await interact.waitAndClick(".dralex .permission");
		assert.elValue("#login-pin", fixtures.PIN.valid);
		// reset and go to no server mode again
		await app.reset();
		await interact.waitAndClick(".no-server-mode");
		await interact.waitForEl("#choose-user");
		// now should be asked for a PIN
		// we'll enter an invalid one first
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl("#modal-input");
		await interact.typeIn("#modal-input", fixtures.PIN.invalid);
		await interact.waitAndClick("#confirm-modal-btn");
		// expect an error message
		await interact.waitForEl(".message-inner");
		// we'll enter the valid one now
		await interact.waitAndClick(".ms-Persona");
		await interact.waitForEl("#modal-input");
		await interact.typeIn("#modal-input", fixtures.PIN.valid);
		await interact.waitAndClick("#confirm-modal-btn");
		// we should be in
		await interact.waitForEl(".header-component");
	},

	async impossibleToLogin() {
		await app.removeCookies();
		await test.offline();
		await app.reset();
		await interact.waitForEl(".impossible");
		await test.online();
	}
};
