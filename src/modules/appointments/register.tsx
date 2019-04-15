import { connectToDB, menu, router, user } from "@core";
import { Appointment, appointments, appointmentsNamespace } from "@modules";
import * as React from "react";

export const registerAppointments = {
	async register() {
		router.register({
			namespace: appointmentsNamespace,
			regex: /^appointments/,
			component: async () => {
				const Component = (await import("./components/page.calendar"))
					.CalendarPage;
				return <Component />;
			},
			condition: () => user.currentUser.canViewAppointments
		});
		menu.items.push({
			icon: "Calendar",
			name: appointmentsNamespace,
			key: appointmentsNamespace,
			onClick: () => {
				router.go([appointmentsNamespace]);
			},
			order: 3,
			url: "",
			condition: () => user.currentUser.canViewAppointments
		});
		await ((await connectToDB(
			appointmentsNamespace,
			appointmentsNamespace,
			true
		)) as any)(Appointment, appointments);
		return true;
	},
	order: 9
};
