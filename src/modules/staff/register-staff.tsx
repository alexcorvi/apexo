import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerStaff = async () => {
	const dbs = await core.connect<modules.StaffMemberSchema>(
		"doctors",
		modules.StaffMember
	);

	modules.setStaffStore(
		new modules.Staff({
			model: modules.StaffMember,
			DBInstance: dbs.localDatabase,
		})
	);

	await modules.staff!.updateFromPouch();

	core.router.register({
		namespace: modules.staffNamespace,
		regex: /^staff/,
		component: async () => {
			const StaffPage = (await import("./components/page.staff"))
				.StaffPage;
			return <StaffPage />;
		},
		condition: () =>
			(core.user.currentUser || { canViewStaff: false }).canViewStaff,
	});
	core.menu.items.push({
		icon: "Medical",
		name: modules.staffNamespace,
		key: modules.staffNamespace,
		onClick: () => {
			core.router.go([modules.staffNamespace]);
		},
		order: 0,
		url: "",
		condition: () =>
			(core.user.currentUser || { canViewStaff: false }).canViewStaff,
	});
};
