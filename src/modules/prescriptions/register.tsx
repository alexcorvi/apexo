import { connectToDB, menu, router, user } from "@core";
import { PrescriptionItem, prescriptions, prescriptionsNamespace, setting } from "@modules";
import * as React from "react";
export const registerPrescriptions = {
	async register() {
		router.register({
			namespace: prescriptionsNamespace,
			regex: /^prescriptions/,
			component: async () => {
				const Component = (await import("./components/page.prescriptions"))
					.PrescriptionsPage;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_prescriptions") &&
				user.currentUser.canViewPrescriptions
		});

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
		await ((await connectToDB(
			prescriptionsNamespace,
			prescriptionsNamespace
		)) as any)(PrescriptionItem, prescriptions);
		return true;
	},
	order: 5
};
