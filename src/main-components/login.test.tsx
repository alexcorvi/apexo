import { LoginView } from "./login";
import { store } from "@utils";
import { mount } from "enzyme";
import * as React from "react";

let success = true;

const props = {
	tryOffline: false,
	initialCheck: jest.fn(async (server: string) => undefined),
	loginWithCredentials: jest.fn(
		async ({
			username,
			password,
			server
		}: {
			username: string;
			password: string;
			server: string;
		}) => (success ? true : "custom error message")
	),
	loginWithCredentialsOffline: jest.fn(
		async ({
			username,
			password,
			server
		}: {
			username: string;
			password: string;
			server: string;
		}) => (success ? true : "custom error message")
	),
	startNoServer: jest.fn(async () => undefined)
};

store.remove("server_location");
let wrapper = mount<typeof props>(<LoginView {...props} />);

function setServer(value: string) {
	wrapper.find(".input-server input").simulate("change", {
		target: { value }
	});
}
function setIdentification(value: string) {
	wrapper.find(".input-identification input").simulate("change", {
		target: { value }
	});
}
function setPassword(value: string) {
	wrapper.find(".input-password input").simulate("change", {
		target: { value }
	});
}
function clickLogin() {
	wrapper.find(".proceed-login button").simulate("click");
}

function clickOfflineLogin() {
	wrapper.find(".proceed-offline button").simulate("click");
}

describe("@main-components: login", () => {
	it("initial check", () => {
		expect(props.initialCheck).toHaveBeenLastCalledWith(
			location.origin.replace(/:\d+$/g, ":5984")
		);
		store.set("server_location", "https://store.db.com");
		mount<typeof props>(<LoginView {...props} />);
		expect(props.initialCheck).toHaveBeenLastCalledWith(
			"https://store.db.com"
		);
		store.remove("server_location");
		(window as any).couchDBServer = "https://window.db.com";
		mount<typeof props>(<LoginView {...props} />);
		expect(props.initialCheck).toHaveBeenLastCalledWith(
			"https://window.db.com"
		);
	});
	it("Impossible to login", () => {
		Object.defineProperty(window.navigator, "onLine", {
			value: false,
			configurable: true
		});
		store.remove("LSL_hash");
		wrapper = mount<typeof props>(<LoginView {...props} />);
		expect(wrapper.find(".impossible")).toExist();
		// reset
		Object.defineProperty(window.navigator, "onLine", {
			value: true,
			configurable: true
		});
		wrapper = mount<typeof props>(<LoginView {...props} />);
	});
	describe("all fields are necessary", () => {
		it("password", done => {
			wrapper = mount<typeof props>(<LoginView {...props} />);
			setTimeout(() => {
				wrapper.update();
				setServer("server");
				setIdentification("id");
				setPassword("");
				clickLogin();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).toExist();
					expect(
						wrapper
							.find(".error-msg .ms-MessageBar-innerText")
							.text()
					).toBe("All fields are necessary");
					done();
				});
			});
		});

		it("identification", done => {
			wrapper = mount<typeof props>(<LoginView {...props} />);
			setTimeout(() => {
				wrapper.update();
				setServer("server");
				setIdentification("");
				setPassword("password");
				clickLogin();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).toExist();
					expect(
						wrapper
							.find(".error-msg .ms-MessageBar-innerText")
							.text()
					).toBe("All fields are necessary");
					done();
				});
			});
		});

		it("server", done => {
			wrapper = mount<typeof props>(<LoginView {...props} />);
			setTimeout(() => {
				wrapper.update();
				setServer("");
				setIdentification("id");
				setPassword("password");
				clickLogin();
				expect(
					wrapper.find(".error-msg .ms-MessageBar-innerText")
				).toExist();
				setTimeout(() => {
					expect(
						wrapper
							.find(".error-msg .ms-MessageBar-innerText")
							.text()
					).toBe("All fields are necessary");
					done();
				});
			});
		});
	});

	describe("online login", () => {
		it("successful login", done => {
			success = true;
			setIdentification("a");
			setPassword("a");
			setServer("a");
			clickLogin();
			expect(props.loginWithCredentials).toHaveBeenLastCalledWith({
				username: "a",
				password: "a",
				server: "a"
			});
			setTimeout(() => {
				wrapper.update();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).not.toExist();
					done();
				});
			});
		});
		it("unsuccessful login", done => {
			success = false;
			setIdentification("b");
			setPassword("b");
			setServer("b");
			clickLogin();
			expect(props.loginWithCredentials).toHaveBeenLastCalledWith({
				username: "b",
				password: "b",
				server: "b"
			});
			setTimeout(() => {
				wrapper.update();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).toExist();
					expect(
						wrapper
							.find(".error-msg .ms-MessageBar-innerText")
							.text()
					).toBe("custom error message");
					done();
				});
			});
		});
	});

	describe("offline login", () => {
		it("offline login button doesn't exists", () => {
			expect(wrapper.find(".proceed-offline")).not.toExist();
		});
		it("offline login button exists", () => {
			wrapper.setProps({
				tryOffline: true
			});
			expect(wrapper.find(".proceed-offline")).toExist();
		});

		it("successful login", done => {
			success = true;
			setIdentification("a");
			setPassword("a");
			setServer("a");
			clickOfflineLogin();
			expect(props.loginWithCredentialsOffline).toHaveBeenLastCalledWith({
				username: "a",
				password: "a",
				server: "a"
			});
			setTimeout(() => {
				wrapper.update();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).not.toExist();
					done();
				});
			});
		});
		it("unsuccessful login", done => {
			success = false;
			setIdentification("b");
			setPassword("b");
			setServer("b");
			clickOfflineLogin();
			expect(props.loginWithCredentialsOffline).toHaveBeenLastCalledWith({
				username: "b",
				password: "b",
				server: "b"
			});
			setTimeout(() => {
				wrapper.update();
				setTimeout(() => {
					expect(
						wrapper.find(".error-msg .ms-MessageBar-innerText")
					).toExist();
					expect(
						wrapper
							.find(".error-msg .ms-MessageBar-innerText")
							.text()
					).toBe("custom error message");
					done();
				});
			});
		});
	});

	it("starting no server mode", () => {
		expect(props.startNoServer).not.toBeCalled();
		wrapper.find(".no-server-mode button").simulate("click");
		expect(props.startNoServer).toBeCalled();
	});
});
