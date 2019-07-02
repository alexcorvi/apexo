import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerStaff = {
	async register() {
		core.router.register({
			namespace: modules.staffNamespace,
			regex: /^staff/,
			component: async () => {
				const StaffPage = (await import("./components/page.staff"))
					.StaffPage;
				return (
					<StaffPage
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						currentLocation={core.router.currentLocation}
						staffMembers={modules.staff.list}
						dateFormat={modules.setting.getSetting("date_format")}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						enabledOrthodontics={
							!!modules.setting.getSetting("module_orthodontics")
						}
						enabledPrescriptions={
							!!modules.setting.getSetting("module_prescriptions")
						}
						enabledStatistics={
							!!modules.setting.getSetting("module_statistics")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						operatingStaff={modules.staff.operatingStaff}
						onDeleteStaff={id => modules.staff.deleteModal(id)}
						onAddStaff={staff => modules.staff.list.push(staff)}
						onDeleteAppointment={id =>
							modules.appointments.deleteModal(id)
						}
						doDeleteAppointment={id =>
							modules.appointments.deleteByID(id)
						}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						doDeleteStaff={id => modules.staff.deleteByID(id)}
					/>
				);
			},
			condition: () =>
				(core.user.currentUser || { canViewStaff: false }).canViewStaff
		});
		core.menu.items.push({
			icon: "Contact",
			name: modules.staffNamespace,
			key: modules.staffNamespace,
			onClick: () => {
				core.router.go([modules.staffNamespace]);
			},
			order: 0,
			url: "",
			condition: () =>
				(core.user.currentUser || { canViewStaff: false }).canViewStaff
		});
		await ((await core.connectToDB(
			"doctors",
			modules.staffNamespace
		)) as any)(modules.StaffMember, modules.staff);
		return true;
	},
	order: 7
};
