import { connectToDB, menu, router, user } from "@core";
import { setting, SettingsItem, settingsNamespace } from "@modules";
import * as React from "react";
export const registerSettings = {
	async register() {
		setting.setSetting("hourlyRate", "50");
		setting.setSetting("currencySymbol", "$");

		router.register({
			namespace: settingsNamespace,
			regex: /^settings/,
			component: async () => {
				const Component = (await import("./components/page.settings"))
					.SettingsPage;
				return <Component />;
			},
			condition: () => user.currentUser.canViewSettings
		});

		menu.items.push({
			icon: "Settings",
			name: settingsNamespace,
			key: settingsNamespace,
			onClick: () => {
				router.go([settingsNamespace]);
			},
			order: 999,
			url: "",
			condition: () => user.currentUser.canViewSettings
		});
		await ((await connectToDB(
			settingsNamespace,
			settingsNamespace
		)) as any)(SettingsItem, setting);
		return true;
	},
	order: 0
};
