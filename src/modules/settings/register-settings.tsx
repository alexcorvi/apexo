import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerSettings = async () => {
	const dbs = await core.connect<modules.SettingItemSchema>(
		modules.settingsNamespace,
		modules.SettingsItem
	);

	modules.setSettingsStore(
		new modules.Settings({
			model: modules.SettingsItem,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.setting!.updateFromPouch();

	// defaults
	if (!modules.setting!.getSetting("hourlyRate")) {
		modules.setting!.setSetting("hourlyRate", "50");
	}
	if (!modules.setting!.getSetting("currencySymbol")) {
		modules.setting!.setSetting("currencySymbol", "$");
	}

	core.router.register({
		namespace: modules.settingsNamespace,
		regex: /^settings/,
		component: async () => {
			const SettingsPage = (await import("./components/page.settings"))
				.SettingsPage;
			return <SettingsPage />;
		},
		condition: () =>
			(core.user.currentUser || { canViewSettings: false })
				.canViewSettings,
	});

	core.menu.items.push({
		icon: "Settings",
		name: modules.settingsNamespace,
		key: modules.settingsNamespace,
		onClick: () => {
			core.router.go([modules.settingsNamespace]);
		},
		order: 999,
		url: "",
		condition: () =>
			(core.user.currentUser || { canViewSettings: false })
				.canViewSettings,
	});
};
