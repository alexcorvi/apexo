import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerPatients = {
	async register() {
		core.router.register({
			namespace: modules.patientsNamespace,
			regex: /^patients/,
			component: async () => {
				const PatientsPage = (await import(
					"./components/page.patients"
				)).PatientsPage;
				return (
					<PatientsPage
						dateFormat={modules.setting.getSetting("date_format")}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						patients={modules.patients.list}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						prescriptionsEnabled={
							!!modules.setting.getSetting("module_prescriptions")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						operatingStaff={modules.staff.operatingStaff}
						onAddAppointment={appointment =>
							modules.appointments.list.push(appointment)
						}
						saveFile={x => core.files.save(x)}
						getFile={x => core.files.get(x)}
						removeFile={x => core.files.remove(x)}
						onDeleteAppointment={id => {
							modules.appointments.deleteModal(id);
						}}
						doDeleteAppointment={id => {
							modules.appointments.deleteByID(id);
						}}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						currentLocation={core.router.currentLocation}
						onDeletePatient={id => modules.patients.deleteModal(id)}
						onAddPatient={patient =>
							modules.patients.list.push(patient)
						}
						doDeletePatient={id => modules.patients.deleteByID(id)}
					/>
				);
			},
			condition: () =>
				(core.user.currentUser || { canViewPatients: false })
					.canViewPatients
		});

		core.menu.items.push({
			icon: "ContactCard",
			name: modules.patientsNamespace,
			key: modules.patientsNamespace,
			onClick: () => {
				core.router.go([modules.patientsNamespace]);
			},
			order: 1.5,
			url: "",
			condition: () =>
				(core.user.currentUser || { canViewPatients: false })
					.canViewPatients
		});
		await ((await core.connectToDB(
			modules.patientsNamespace,
			modules.patientsNamespace
		)) as any)(modules.Patient, modules.patients);
		return true;
	},
	order: 4
};
