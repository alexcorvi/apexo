import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerOrthodontic = async () => {
	const dbs = await core.connect<modules.OrthoCaseSchema>(
		modules.orthoNamespace
	);

	modules.setOrthoCasesStore(
		new modules.OrthoCases({
			model: modules.OrthoCase,
			DBInstance: dbs.localDatabase
		})
	);

	await modules.orthoCases!.updateFromPouch();

	core.router.register({
		namespace: modules.orthoNamespace,
		regex: /^orthodontic/,
		component: async () => {
			const OrthoPage = (await import("./components/page.orthodontic"))
				.OrthoPage;
			return <OrthoPage />;
		},
		condition: () =>
			!!modules.setting!.getSetting("module_orthodontics") &&
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
			(core.user.currentUser || { canViewOrtho: false }).canViewOrtho &&
			!!modules.setting!.getSetting("module_orthodontics")
	});
};
