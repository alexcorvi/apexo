import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";

export const registerBot = async () => {
	const dbs = await core.connect<modules.BotMessageSchema>(
		modules.botNamespace,
		modules.BotMessage
	);

	modules.setBotMessages(
		new modules.BotMessages({
			model: modules.BotMessage,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.botMessages!.updateFromPouch();

	core.router.register({
		namespace: modules.botNamespace,
		regex: /^bot/,
		component: async () => {
			const BotPage = (await import("./components/page.bot")).BotPage;
			return <BotPage />;
		},
		condition: () =>
			false &&
			core.status.version === "supported" &&
			(core.user.currentUser || { canViewBotPage: false }).canViewBotPage,
	});

	core.menu.items.push({
		icon: "Robot",
		name: modules.botNamespace,
		onClick: () => {
			core.router.go([modules.botNamespace]);
		},
		order: 10,
		url: "",
		key: modules.botNamespace,
		condition: () =>
			false &&
			core.status.version === "supported" &&
			(core.user.currentUser || { canViewBotPage: false }).canViewBotPage,
	});
};
