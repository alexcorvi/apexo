import { HomeView } from "./home";
import "../mocks/state-mocks";
import * as core from "@core";
import * as modules from "@modules";
import { mount } from "enzyme";
import * as React from "react";

const props = {
	currentUsername: "",
	showChart: false,
	todayAppointments: [],
	tomorrowAppointments: [],
	dateFormat: "dd-mm-yyyy",
	selectedAppointmentsByDay: [],
	allAppointments: modules.appointments.list,
	doDeleteAppointment: (id: string) => modules.appointments.deleteByID(id),
	availableTreatments: modules.treatments.list,
	availablePrescriptions: modules.prescriptions.list,
	appointmentsForDay: (
		a: number,
		b: number,
		c: number,
		d: string,
		e: string
	) => modules.appointments.appointmentsForDay(a, b, c, d, e),
	prescriptionsEnabled: !!modules.setting.getSetting("module_prescriptions"),
	timeTrackingEnabled: !!modules.setting.getSetting("time_tracking"),
	operatingStaff: modules.staff.operatingStaff,
	currentUser: core.user.currentUser || new modules.StaffMember(),
	currencySymbol: modules.setting.getSetting("currencySymbol")
};

const wrapper = mount(<HomeView {...props} />);

describe("@main-components: home", () => {
	it("Welcome message corresponds to user name", () => {
		wrapper.setProps({
			currentUsername: "alex"
		});
		expect(wrapper.find(".welcome").text()).toBe("Welcome, alex");
	});
	it("Home chart", () => {
		expect(wrapper.find("#home-chart")).not.toExist();
		wrapper.setProps({
			showChart: true
		});
		expect(wrapper.find("#home-chart")).toExist();
	});
	it("Today appointments listing", () => {
		expect(wrapper.find(".today-appointment").length).toBe(0);
		expect(wrapper.find(".today-appointments .no-appointments")).toExist();
		wrapper.setProps({
			todayAppointments: modules.appointments.list.filter(
				x => x.notes === "A" || x.notes === "B"
			)
		});
		expect(wrapper.find(".today-appointment").length).toBe(2);
		expect(
			wrapper.find(".today-appointments .no-appointments")
		).not.toExist();
	});
	it("Tomorrow appointments listing", () => {
		expect(wrapper.find(".tomorrow-appointment").length).toBe(0);
		expect(
			wrapper.find(".tomorrow-appointments .no-appointments")
		).toExist();
		wrapper.setProps({
			tomorrowAppointments: modules.appointments.list.filter(
				x => x.notes === "C" || x.notes === "D"
			)
		});
		expect(wrapper.find(".tomorrow-appointment").length).toBe(2);
		expect(
			wrapper.find(".tomorrow-appointments .no-appointments")
		).not.toExist();
	});
});
