import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerPatients = async () => {
	const dbs = await core.connect<modules.PatientSchema>(
		modules.patientsNamespace,
		modules.Patient
	);

	modules.setPatientsStore(
		new modules.Patients({
			model: modules.Patient,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.patients!.updateFromPouch();

	core.router.register({
		namespace: modules.patientsNamespace,
		regex: /^patients/,
		component: async () => {
			const PatientsPage = (await import("./components/page.patients"))
				.PatientsPage;
			return <PatientsPage />;
		},
		condition: () =>
			(core.user.currentUser || { canViewPatients: false })
				.canViewPatients,
	});

	core.menu.items.push({
		icon: "Contact",
		name: modules.patientsNamespace,
		key: modules.patientsNamespace,
		onClick: () => {
			core.router.go([modules.patientsNamespace]);
		},
		order: 1.5,
		url: "",
		condition: () =>
			(core.user.currentUser || { canViewPatients: false })
				.canViewPatients,
	});
};
