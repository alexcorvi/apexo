import { menu, router, user } from "@core";
import { setting, statsNamespace } from "@modules";
import * as React from "react";

export const registerStats = {
	async register() {
		router.register({
			namespace: statsNamespace,
			regex: /^statistics/,
			component: async () => {
				const Component = (await import("./components/page.statistics"))
					.StatisticsPage;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_statistics") &&
				user.currentUser.canViewStats
		});
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
