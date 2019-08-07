import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerLabwork = async () => {
	const dbs = await core.connect<modules.LabworkSchema>(
		modules.labworkNamespace
	);

	modules.setLabworksStore(
		new modules.Labworks({
			model: modules.Labwork,
			DBInstance: dbs.localDatabase
		})
	);

	await modules.labworks!.updateFromPouch();

	core.router.register({
		namespace: modules.labworkNamespace,
		regex: /^labwork/,
		component: async () => {
			const LabworkPage = (await import("./components/page.labwork"))
				.LabworkPage;
			return <LabworkPage />;
		},
		condition: () =>
			!!modules.setting!.getSetting("module_labwork") &&
			(core.user.currentUser || { canViewLabwork: false }).canViewLabwork
	});

	core.menu.items.push({
		icon: "teeth",
		name: modules.labworkNamespace,
		onClick: () => {
			core.router.go([modules.labworkNamespace]);
		},
		order: 4.5,
		url: "",
		key: modules.labworkNamespace,
		condition: () =>
			!!modules.setting!.getSetting("module_labwork") &&
			(core.user.currentUser || { canViewLabwork: false }).canViewLabwork
	});
};
