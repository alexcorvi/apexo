import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerStats = async () => {
	core.router.register({
		namespace: modules.statsNamespace,
		regex: /^statistics/,
		component: async () => {
			const StatisticsPage = (await import(
				"./components/page.statistics"
			)).StatisticsPage;
			return <StatisticsPage />;
		},
		condition: () =>
			!!modules.setting!.getSetting("module_statistics") &&
			(core.user.currentUser || { canViewStats: false }).canViewStats
	});
	core.menu.items.push({
		icon: "Chart",
		name: modules.statsNamespace,
		key: modules.statsNamespace,
		onClick: () => {
			core.router.go([modules.statsNamespace]);
		},
		order: 50,
		url: "",
		condition: () =>
			!!modules.setting!.getSetting("module_statistics") &&
			(core.user.currentUser || { canViewStats: false }).canViewStats
	});
};
