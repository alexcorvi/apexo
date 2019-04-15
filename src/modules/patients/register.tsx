import { connectToDB, menu, router, user } from "@core";
import { Patient, patients, patientsNamespace } from "@modules";
import * as React from "react";

export const registerPatients = {
	async register() {
		router.register({
			namespace: patientsNamespace,
			regex: /^patients/,
			component: async () => {
				const Component = (await import("./components/page.patients"))
					.PatientsPage;
				return <Component />;
			},
			condition: () => user.currentUser.canViewPatients
		});

		menu.items.push({
			icon: "ContactCard",
			name: patientsNamespace,
			key: patientsNamespace,
			onClick: () => {
				router.go([patientsNamespace]);
			},
			order: 1.5,
			url: "",
			condition: () => user.currentUser.canViewPatients
		});
		await ((await connectToDB(
			patientsNamespace,
			patientsNamespace
		)) as any)(Patient, patients);
		return true;
	},
	order: 4
};
