import "../mocks/browser-mocks";
import "../mocks/state-mocks";
import { user } from "@core";
import * as core from "@core";
import * as modules from "@modules";

function setUserA() {
	core.status.setUser(modules.staff!.docs.find(x => x.name === "A")!._id);
}

function setUserB() {
	core.status.setUser(modules.staff!.docs.find(x => x.name === "B")!._id);
}

describe("@core: user panel", () => {
	it("User panel is hidden by default", () => {
		user.hide();
		expect(core.router.selectedMain).toBe("");
	});

	it("Showing the user panel", () => {
		user.show();
		expect(core.router.selectedMain).toBe("user");
	});

	it("Hiding the user panel", () => {
		user.hide();
		expect(core.router.selectedMain).toBe("");
	});
});

describe("@core: user A info", function(this: any) {
	it("Staff name", () => {
		setUserA();
		expect(user.currentUser!.name).toBe("A");
	});

	it("Today appointments", () => {
		setUserA();
		expect(user.todayAppointments.length).toBe(1);
		expect(user.todayAppointments[0].notes).toBe("A");
	});
});

describe("@core: user B info", () => {
	it("Staff name", () => {
		setUserB();
		expect(user.currentUser!.name).toBe("B");
	});

	it("Today appointments", () => {
		setUserB();
		expect(user.todayAppointments.length).toBe(1);
		expect(user.todayAppointments[0].notes).toBe("B");
	});
});
