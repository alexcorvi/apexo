import * as prescriptionsComponents from "./components";
import * as prescriptionsData from "./data";

import { API } from "../../core";
import { settingsData } from "../settings/index";

export const register = {
	async register() {
		API.router.register(
			prescriptionsData.namespace,
			/^prescriptions/,
			prescriptionsComponents.PrescriptionsTable,
			() =>
				!!settingsData.settings.getSetting("module_prescriptions") &&
				API.user.currentUser.canViewPrescriptions
		);
		API.menu.items.push({
			icon: "Pill",
			name: prescriptionsData.namespace,
			key: prescriptionsData.namespace,
			onClick: () => {
				API.router.go([prescriptionsData.namespace]);
			},
			order: 9,
			url: "",
			condition: () =>
				API.user.currentUser.canViewPrescriptions &&
				!!settingsData.settings.getSetting("module_prescriptions")
		});
		await (API.connectToDB(prescriptionsData.namespace) as any)(
			prescriptionsData.PrescriptionItem,
			prescriptionsData.prescriptions
		);
		return true;
	},
	order: 5
};
// export data
export { prescriptionsData };
export { prescriptionsComponents };
