import { connectToDB, menu, router, user } from "@core";
import { setting, SettingsItem, settingsNamespace, SettingsPage } from "@modules";

export const registerSettings = {
	async register() {
		setting.setSetting("hourlyRate", "50");
		setting.setSetting("currencySymbol", "$");
		router.register(
			settingsNamespace,
			/^settings\/?$/,
			SettingsPage,
			() => user.currentUser.canViewSettings
		);
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
		await (connectToDB(settingsNamespace, settingsNamespace) as any)(
			SettingsItem,
			setting
		);
		return true;
	},
	order: 0
};
