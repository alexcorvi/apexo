import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerTreatments = {
	async register() {
		core.router.register({
			namespace: modules.treatmentsNamespace,
			regex: /^treatments/,
			component: async () => {
				const Treatments = (await import("./components/page.treatments"))
					.Treatments;
				return (
					<Treatments
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						currentLocation={core.router.currentLocation}
						treatments={modules.treatments.list}
						appointments={modules.appointments.list}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
						onDelete={id => modules.treatments.deleteModal(id)}
						onAdd={treatment =>
							modules.treatments.list.push(treatment)
						}
					/>
				);
			},
			condition: () =>
				(core.user.currentUser || { canViewTreatments: false })
					.canViewTreatments
		});

		core.menu.items.push({
			icon: "Cricket",
			name: modules.treatmentsNamespace,
			onClick: () => {
				core.router.go([modules.treatmentsNamespace]);
			},
			order: 5,
			url: "",
			key: modules.treatmentsNamespace,
			condition: () =>
				(core.user.currentUser || { canViewTreatments: false })
					.canViewTreatments
		});
		await ((await core.connectToDB(
			modules.treatmentsNamespace,
			modules.treatmentsNamespace
		)) as any)(modules.Treatment, modules.treatments);
		return true;
	},
	order: 3
};
