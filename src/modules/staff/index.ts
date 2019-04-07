import * as staffComponents from "./components";
import * as staffData from "./data";

import { API } from "../../core";

export const register = {
	async register() {
		API.router.register(
			staffData.namespace,
			/^staff/,
			staffComponents.StaffListing,
			() => API.user.currentUser.canViewStaff
		);
		API.menu.items.push({
			icon: "Contact",
			name: staffData.namespace,
			key: staffData.namespace,
			onClick: () => {
				API.router.go([staffData.namespace]);
			},
			order: 0,
			url: "",
			condition: () => API.user.currentUser.canViewStaff
		});
		await (API.connectToDB("doctors", staffData.namespace) as any)(
			staffData.StaffMember,
			staffData.staffMembers
		);
		return true;
	},
	order: 7
};
// export data
export { staffData };
export { staffComponents };
