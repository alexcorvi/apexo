import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerTreatments = async () => {
	const dbs = await core.connect<modules.TreatmentSchema>(
		modules.treatmentsNamespace,
		modules.Treatment
	);

	modules.setTreatmentsStore(
		new modules.Treatments({
			model: modules.Treatment,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.treatments!.updateFromPouch();

	core.router.register({
		namespace: modules.treatmentsNamespace,
		regex: /^treatments/,
		component: async () => {
			const Treatments = (await import("./components/page.treatments"))
				.Treatments;
			return <Treatments />;
		},
		condition: () =>
			(core.user.currentUser || { canViewTreatments: false })
				.canViewTreatments,
	});

	core.menu.items.push({
		icon: "Cricket",
		name: modules.treatmentsNamespace,
		onClick: () => {
			core.router.go([modules.treatmentsNamespace]);
		},
		order: 5,
		url: "",
		key: modules.treatmentsNamespace,
		condition: () =>
			(core.user.currentUser || { canViewTreatments: false })
				.canViewTreatments,
	});
};
