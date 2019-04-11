import { connectToDB, menu, router, user } from "@core";
import { Treatment, Treatments, treatments, treatmentsNamespace } from "@modules";

export const registerTreatments = {
	async register() {
		router.register(
			treatmentsNamespace,
			/^treatments/,
			Treatments,
			() => user.currentUser.canViewTreatments
		);
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
		await (connectToDB(treatmentsNamespace, treatmentsNamespace) as any)(
			Treatment,
			treatments
		);
		return true;
	},
	order: 3
};
