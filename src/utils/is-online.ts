import { checkServer } from "@utils";
import isClientOnlineLib from "is-online";
export const connSetting = {
	emulateOffline: false
};
export async function isOnline(server: string) {
	if (!(await isClientOnline())) {
		return false;
	}
	return await checkServer(server);
}

export async function isClientOnline() {
	if (connSetting.emulateOffline) {
		return false;
	}
	return await isClientOnlineLib();
}
