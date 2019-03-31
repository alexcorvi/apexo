import * as statisticsComponents from "./components";
import * as statisticsData from "./data";

import { API } from "../../core";
import { settingsData } from "../settings/index";

export const register = {
	async register() {
		API.router.register(
			statisticsData.namespace,
			/^statistics\/?$/,
			statisticsComponents.StatisticsComponent,
			() =>
				!!settingsData.settings.getSetting("module_statistics") &&
				API.user.currentUser.canViewStats
		);
		API.menu.items.push({
			icon: "Chart",
			name: statisticsData.namespace,
			key: statisticsData.namespace,
			onClick: () => {
				API.router.go([statisticsData.namespace]);
			},
			order: 50,
			url: "",
			condition: () =>
				API.user.currentUser.canViewStats &&
				!!settingsData.settings.getSetting("module_statistics")
		});
		return true;
	},
	order: 10
};

// export data
export { statisticsData };
export { statisticsComponents };
