import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerPrescriptions = async () => {
	const dbs = await core.connect<modules.PrescriptionItemSchema>(
		modules.prescriptionsNamespace,
		modules.PrescriptionItem
	);

	modules.setPrescriptionsStore(
		new modules.Prescriptions({
			model: modules.PrescriptionItem,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.prescriptions!.updateFromPouch();

	core.router.register({
		namespace: modules.prescriptionsNamespace,
		regex: /^prescriptions/,
		component: async () => {
			const PrescriptionsPage = (
				await import("./components/page.prescriptions")
			).PrescriptionsPage;
			return <PrescriptionsPage />;
		},
		condition: () =>
			!!modules.setting!.getSetting("module_prescriptions") &&
			(core.user.currentUser || { canViewPrescriptions: false })
				.canViewPrescriptions &&
			!!modules.prescriptions,
	});

	core.menu.items.push({
		icon: "Pill",
		name: modules.prescriptionsNamespace,
		key: modules.prescriptionsNamespace,
		onClick: () => {
			core.router.go([modules.prescriptionsNamespace]);
		},
		order: 9,
		url: "",
		condition: () =>
			(core.user.currentUser || { canViewPrescriptions: false })
				.canViewPrescriptions &&
			!!modules.setting!.getSetting("module_prescriptions") &&
			!!modules.prescriptions,
	});
};
