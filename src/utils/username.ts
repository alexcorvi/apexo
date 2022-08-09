import * as core from "@core";
import * as utils from "@utils";
export function username() {
	const pl = utils.store.get("LSL_time").split(".")[1];
	if (!pl) {
		return "";
	}
	try {
		return JSON.parse(atob(pl)).data.user.login as string;
	} catch (e) {
		return "";
	}
}
