import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerAppointments = async () => {
	const dbs = await core.connect<modules.AppointmentSchema>(
		modules.appointmentsNamespace,
		modules.Appointment
	);

	modules.setAppointmentsStore(
		new modules.Appointments({
			model: modules.Appointment,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.appointments!.updateFromPouch();

	core.router.register({
		namespace: modules.appointmentsNamespace,
		regex: /^appointments/,
		component: async () => {
			const CalendarPage = (await import("./components/page.calendar"))
				.CalendarPage;
			return <CalendarPage />;
		},
		condition: () =>
			(core.user.currentUser || { canViewAppointments: false })
				.canViewAppointments,
	});
	core.menu.items.push({
		icon: "Calendar",
		name: modules.appointmentsNamespace,
		key: modules.appointmentsNamespace,
		onClick: () => {
			core.router.go([modules.appointmentsNamespace]);
		},
		order: 3,
		url: "",
		condition: () =>
			(core.user.currentUser || { canViewAppointments: false })
				.canViewAppointments,
	});
};
