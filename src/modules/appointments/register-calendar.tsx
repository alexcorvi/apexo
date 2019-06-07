import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerAppointments = {
	async register() {
		core.router.register({
			namespace: modules.appointmentsNamespace,
			regex: /^appointments/,
			component: async () => {
				const CalendarPage = (await import(
					"./components/page.calendar"
				)).CalendarPage;
				return (
					<CalendarPage
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						currentLocation={core.router.currentLocation}
						dateFormat={modules.setting.getSetting("date_format")}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						prescriptionsEnabled={
							!!modules.setting.getSetting("module_prescriptions")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						operatingStaff={modules.staff.operatingStaff}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						onNavigation={arr => core.router.go(arr)}
						doDeleteAppointment={id => {
							modules.appointments.deleteByID(id);
						}}
					/>
				);
			},
			condition: () =>
				(core.user.currentUser || { canViewAppointments: false })
					.canViewAppointments
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
					.canViewAppointments
		});
		await ((await core.connectToDB(
			modules.appointmentsNamespace,
			modules.appointmentsNamespace,
			true
		)) as any)(modules.Appointment, modules.appointments);
		return true;
	},
	order: 9
};
