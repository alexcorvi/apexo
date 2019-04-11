import { connectToDB, menu, router, user } from "@core";
import { Patient, patients, patientsNamespace, PatientsPage } from "@modules";

export const registerPatients = {
	async register() {
		router.register(
			patientsNamespace,
			/^patients\/?/,
			PatientsPage,
			() => user.currentUser.canViewPatients
		);
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
		await (connectToDB(patientsNamespace, patientsNamespace) as any)(
			Patient,
			patients
		);
		return true;
	},
	order: 4
};
