import { connectToDB, menu, router, user } from "@core";
import { staff, StaffMember, staffNamespace } from "@modules";
import * as React from "react";
export const registerStaff = {
	async register() {
		router.register({
			namespace: staffNamespace,
			regex: /^staff/,
			component: async () => {
				const Component = (await import("./components/page.staff"))
					.StaffPage;
				return <Component />;
			},
			condition: () => user.currentUser.canViewStaff
		});
		menu.items.push({
			icon: "Contact",
			name: staffNamespace,
			key: staffNamespace,
			onClick: () => {
				router.go([staffNamespace]);
			},
			order: 0,
			url: "",
			condition: () => user.currentUser.canViewStaff
		});
		await ((await connectToDB("doctors", staffNamespace)) as any)(
			StaffMember,
			staff
		);
		return true;
	},
	order: 7
};
