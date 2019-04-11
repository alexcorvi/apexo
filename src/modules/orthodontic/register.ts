import { connectToDB, menu, router, user } from "@core";
import { OrthoCase, orthoCases, orthoNamespace, OrthoPage, setting } from "@modules";

export const registerOrthodontic = {
	async register() {
		router.register(
			orthoNamespace,
			/^orthodontic/,
			OrthoPage,
			() =>
				!!setting.getSetting("module_orthodontics") &&
				user.currentUser.canViewOrtho
		);
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
		await (connectToDB(orthoNamespace, orthoNamespace) as any)(
			OrthoCase,
			orthoCases
		);
		return true;
	},
	order: 8
};
