import * as orthoComponents from "./components";
import * as orthoData from "./data";

import { API } from "../../core";
import { settingsData } from "../settings/index";

export const register = {
	async register() {
		API.router.register(
			orthoData.namespace,
			/^orthodontic/,
			orthoComponents.OrthoList,
			() => !!settingsData.settings.getSetting("module_orthodontics")
		);
		API.menu.items.push({
			icon: "DietPlanNotebook",
			name: orthoData.namespace,
			key: orthoData.namespace,
			onClick: () => {
				API.router.go([orthoData.namespace]);
			},
			order: 3,
			url: "",

			condition: () =>
				API.user.currentUser.canViewOrtho &&
				!!settingsData.settings.getSetting("module_orthodontics")
		});
		await (API.connectToDB(orthoData.namespace) as any)(
			orthoData.OrthoCase,
			orthoData.cases
		);
		return true;
	},
	order: 8
};
// export data
export { orthoData };
export { orthoComponents };
