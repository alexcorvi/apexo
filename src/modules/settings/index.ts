import * as settingsComponents from "./components";
import * as settingsData from "./data";

import { API } from "../../core";

export const register = {
	async register() {
		settingsData.settings.setSetting("hourlyRate", "50");
		settingsData.settings.setSetting("currencySymbol", "$");
		API.router.register(
			settingsData.namespace,
			/^settings\/?$/,
			settingsComponents.SettingsComponent
		);
		API.menu.items.push({
			icon: "Settings",
			name: settingsData.namespace,
			key: settingsData.namespace,
			onClick: () => {
				API.router.go([settingsData.namespace]);
			},
			order: 999,
			url: "",
			condition: () => API.user.currentUser.canViewSettings
		});
		await (API.connectToDB(settingsData.namespace) as any)(
			settingsData.SettingsItem,
			settingsData.settings
		);
		return true;
	},
	order: 0
};

// export data
export { settingsData };
export { settingsComponents };
