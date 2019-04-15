import { connectToDB, menu, router, user } from "@core";
import { OrthoCase, orthoCases, orthoNamespace, setting } from "@modules";
import * as React from "react";
export const registerOrthodontic = {
	async register() {
		router.register({
			namespace: orthoNamespace,
			regex: /^orthodontic/,
			component: async () => {
				const Component = (await import("./components/page.orthodontic"))
					.OrthoPage;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_orthodontics") &&
				user.currentUser.canViewOrtho
		});
		menu.items.push({
			icon: "MiniLink",
			name: orthoNamespace,
			key: orthoNamespace,
			onClick: () => {
				router.go([orthoNamespace]);
			},
			order: 3,
			url: "",

			condition: () =>
				user.currentUser.canViewOrtho &&
				!!setting.getSetting("module_orthodontics")
		});
		await ((await connectToDB(orthoNamespace, orthoNamespace)) as any)(
			OrthoCase,
			orthoCases
		);
		return true;
	},
	order: 8
};
