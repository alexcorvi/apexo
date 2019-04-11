import { connectToDB, menu, router, user } from "@core";
import { staff, StaffMember, staffNamespace, StaffPage } from "@modules";

export const registerStaff = {
	async register() {
		router.register(
			staffNamespace,
			/^staff/,
			StaffPage,
			() => user.currentUser.canViewStaff
		);
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
		await (connectToDB("doctors", staffNamespace) as any)(
			StaffMember,
			staff
		);
		return true;
	},
	order: 7
};
