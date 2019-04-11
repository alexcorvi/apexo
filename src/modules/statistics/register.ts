import { menu, router, user } from "@core";
import { setting, StatisticsPage, statsNamespace } from "@modules";

export const registerStats = {
	async register() {
		router.register(
			statsNamespace,
			/^statistics\/?$/,
			StatisticsPage,
			() =>
				!!setting.getSetting("module_statistics") &&
				user.currentUser.canViewStats
		);
		menu.items.push({
			icon: "Chart",
			name: statsNamespace,
			key: statsNamespace,
			onClick: () => {
				router.go([statsNamespace]);
			},
			order: 50,
			url: "",
			condition: () =>
				user.currentUser.canViewStats &&
				!!setting.getSetting("module_statistics")
		});
		return true;
	},
	order: 10
};
