import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerPrescriptions = {
	async register() {
		core.router.register({
			namespace: modules.prescriptionsNamespace,
			regex: /^prescriptions/,
			component: async () => {
				const PrescriptionsPage = (await import("./components/page.prescriptions"))
					.PrescriptionsPage;
				return (
					<PrescriptionsPage
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						currentLocation={core.router.currentLocation}
						prescriptions={modules.prescriptions.list}
						onDelete={id => modules.prescriptions.deleteModal(id)}
						onAdd={x => modules.prescriptions.list.push(x)}
					/>
				);
			},
			condition: () =>
				!!modules.setting.getSetting("module_prescriptions") &&
				(core.user.currentUser || { canViewPrescriptions: false })
					.canViewPrescriptions
		});

		core.menu.items.push({
			icon: "Pill",
			name: modules.prescriptionsNamespace,
			key: modules.prescriptionsNamespace,
			onClick: () => {
				core.router.go([modules.prescriptionsNamespace]);
			},
			order: 9,
			url: "",
			condition: () =>
				(core.user.currentUser || { canViewPrescriptions: false })
					.canViewPrescriptions &&
				!!modules.setting.getSetting("module_prescriptions")
		});
		await ((await core.connectToDB(
			modules.prescriptionsNamespace,
			modules.prescriptionsNamespace
		)) as any)(modules.PrescriptionItem, modules.prescriptions);
		return true;
	},
	order: 5
};
