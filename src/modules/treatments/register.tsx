import { connectToDB, menu, router, user } from "@core";
import { Treatment, treatments, treatmentsNamespace } from "@modules";
import * as React from "react";
export const registerTreatments = {
	async register() {
		router.register({
			namespace: treatmentsNamespace,
			regex: /^treatments/,
			component: async () => {
				const Component = (await import("./components/page.treatments"))
					.Treatments;
				return <Component />;
			},
			condition: () => user.currentUser.canViewTreatments
		});

		menu.items.push({
			icon: "Cricket",
			name: treatmentsNamespace,
			onClick: () => {
				router.go([treatmentsNamespace]);
			},
			order: 5,
			url: "",
			key: treatmentsNamespace,
			condition: () => user.currentUser.canViewTreatments
		});
		await ((await connectToDB(
			treatmentsNamespace,
			treatmentsNamespace
		)) as any)(Treatment, treatments);
		return true;
	},
	order: 3
};
