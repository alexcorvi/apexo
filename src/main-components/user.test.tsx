import { UserPanelView } from "./user";
import { Appointment, StaffMember } from "@modules";
import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";

const onClick = jest.fn(() => undefined);
const props = {
	staffName: "alex",
	todayAppointments: [],
	isOpen: true,
	onDismiss: jest.fn(() => undefined),
	logout: jest.fn(() => undefined),
	resetUser: jest.fn(() => undefined),
	dateFormat: "dd-mm-yyyy",
	availableTreatments: [],
	availablePrescriptions: [],
	currentUser: new StaffMember(),
	appointmentsForDay: jest.fn(
		(
			year: number,
			month: number,
			day: number,
			filter?: string | undefined,
			operatorID?: string | undefined
		) => []
	),
	currencySymbol: "$",
	prescriptionsEnabled: false,
	timeTrackingEnabled: false,
	operatingStaff: [],
	doDeleteAppointment: () => undefined
};

const div = window.document.createElement("div");
window.document.body.appendChild(div);

describe("@main-components: user panel", () => {
	const node = render(<UserPanelView {...props} />);
	afterAll(cleanup);
	it("displays user name", () => {
		expect(
			node.container.parentElement!.querySelector(".ms-TooltipHost")!
				.textContent
		).toBe("alex");
	});
	it("clicking logout", () => {
		fireEvent.click(node.getByTestId("logout"));
		expect(props.logout).toBeCalled();
	});
	it("clicking switch", () => {
		fireEvent.click(node.getByTestId("switch"));
		expect(props.resetUser).toBeCalled();
	});
	it("clicking dismiss", () => {
		fireEvent.click(node.getByTestId("dismiss"));
		expect(props.onDismiss).toBeCalled();
	});
	it("when no appointments exists for today", () => {
		expect(node.queryAllByTestId("no-appointments").length).toBe(1);
		expect(node.queryAllByTestId("appointments-list").length).toBe(0);
	});

	it("when some appointments exists for today", () => {
		const nProps = props;
		(nProps.todayAppointments as any) = [
			new Appointment(),
			new Appointment(),
			new Appointment()
		];
		node.rerender(<UserPanelView {...nProps} />);
		expect(node.queryAllByTestId("no-appointments").length).toBe(0);
		expect(node.queryAllByTestId("appointments-list").length).toBe(1);
		expect(
			node.container.parentElement!.querySelectorAll(
				".appointments-listing .profile-squared"
			).length
		).toBe(3);
	});
});
