import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerOrthodontic = {
	async register() {
		core.router.register({
			namespace: modules.orthoNamespace,
			regex: /^orthodontic/,
			component: async () => {
				const OrthoPage = (await import(
					"./components/page.orthodontic"
				)).OrthoPage;
				return (
					<OrthoPage
						dateFormat={modules.setting.getSetting("date_format")}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						cases={modules.orthoCases.list}
						filteredCases={modules.orthoCases.filtered}
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						patientsWithNoOrtho={
							modules.orthoCases.patientsWithNoOrtho
						}
						allPatients={modules.patients.list}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						prescriptionsEnabled={
							!!modules.setting.getSetting("module_prescriptions")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						operatingStaff={modules.staff.operatingStaff}
						onDeleteOrtho={id => modules.orthoCases.deleteModal(id)}
						onAddOrtho={orthoCase => {
							modules.orthoCases.list.push(orthoCase.orthoCase);
							if (orthoCase.patient) {
								modules.patients.list.push(orthoCase.patient);
							}
						}}
						onAddAppointment={appointment =>
							modules.appointments.list.push(appointment)
						}
						saveFile={x => core.files.save(x)}
						getFile={x => core.files.get(x)}
						removeFile={x => core.files.remove(x)}
						onDeleteAppointment={id => {
							modules.appointments.deleteModal(id);
						}}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						newModal={x => core.modals.newModal(x)}
						cephLoader={x => modules.orthoCases.cephLoader(x)}
						doDeleteOrtho={id => modules.orthoCases.deleteByID(id)}
					/>
				);
			},
			condition: () =>
				!!modules.setting.getSetting("module_orthodontics") &&
				(core.user.currentUser || { canViewOrtho: false }).canViewOrtho
		});
		core.menu.items.push({
			icon: "MiniLink",
			name: modules.orthoNamespace,
			key: modules.orthoNamespace,
			onClick: () => {
				core.router.go([modules.orthoNamespace]);
			},
			order: 3,
			url: "",

			condition: () =>
				(core.user.currentUser || { canViewOrtho: false })
					.canViewOrtho &&
				!!modules.setting.getSetting("module_orthodontics")
		});
		await ((await core.connectToDB(
			modules.orthoNamespace,
			modules.orthoNamespace
		)) as any)(modules.OrthoCase, modules.orthoCases);
		return true;
	},
	order: 8
};
