import { connectToDB, menu, router, user } from "@core";
import { Appointment, appointments, appointmentsNamespace, CalendarPage } from "@modules";

export const registerAppointments = {
	async register() {
		router.register(
			appointmentsNamespace,
			/^appointments/,
			CalendarPage,
			() => user.currentUser.canViewAppointments
		);
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
		await (connectToDB(
			appointmentsNamespace,
			appointmentsNamespace,
			true
		) as any)(Appointment, appointments);
		return true;
	},
	order: 9
};
