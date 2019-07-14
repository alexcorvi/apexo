import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerStats = {
	async register() {
		core.router.register({
			namespace: modules.statsNamespace,
			regex: /^statistics/,
			component: async () => {
				const StatisticsPage = (await import(
					"./components/page.statistics"
				)).StatisticsPage;
				return (
					<StatisticsPage
						dateFormat={modules.setting.getSetting("date_format")}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						operatingStaff={modules.staff.operatingStaff}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						prescriptionsEnabled={
							!!modules.setting.getSetting("module_prescriptions")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						onChooseStaffMember={id => {
							modules.statistics.specificMemberID = id;
						}}
						setStartingDate={t =>
							(modules.statistics.startingDate = t)
						}
						setEndingDate={t => (modules.statistics.endingDate = t)}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						doDeleteAppointment={id =>
							modules.appointments.deleteByID(id)
						}
					/>
				);
			},
			condition: () =>
				!!modules.setting.getSetting("module_statistics") &&
				(core.user.currentUser || { canViewStats: false }).canViewStats
		});
		core.menu.items.push({
			icon: "Chart",
			name: modules.statsNamespace,
			key: modules.statsNamespace,
			onClick: () => {
				core.router.go([modules.statsNamespace]);
			},
			order: 50,
			url: "",
			condition: () =>
				!!modules.setting.getSetting("module_statistics") &&
				(core.user.currentUser || { canViewStats: false }).canViewStats
		});
		return true;
	},
	order: 10
};