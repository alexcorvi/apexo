import { connectToDB, menu, router, user } from "@core";
import { PrescriptionItem, prescriptions, prescriptionsNamespace, PrescriptionsPage, setting } from "@modules";

export const registerPrescriptions = {
	async register() {
		router.register(
			prescriptionsNamespace,
			/^prescriptions/,
			PrescriptionsPage,
			() =>
				!!setting.getSetting("module_prescriptions") &&
				user.currentUser.canViewPrescriptions
		);
		menu.items.push({
			icon: "Pill",
			name: prescriptionsNamespace,
			key: prescriptionsNamespace,
			onClick: () => {
				router.go([prescriptionsNamespace]);
			},
			order: 9,
			url: "",
			condition: () =>
				user.currentUser.canViewPrescriptions &&
				!!setting.getSetting("module_prescriptions")
		});
		await (connectToDB(
			prescriptionsNamespace,
			prescriptionsNamespace
		) as any)(PrescriptionItem, prescriptions);
		return true;
	},
	order: 5
};
