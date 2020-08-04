import * as core from "@core";
import { store } from "@utils";
import * as utils from "@utils";
export const connSetting = {
	emulateOffline: !!localStorage.getItem("emulate_offline"),
};

export async function checkServer(
	server: string
): Promise<false | { name: string | null }> {
	return new Promise((resolve) => {
		const supported = core.status.version === "supported";
		if (connSetting.emulateOffline) {
			resolve(false);
		}
		const xhr = new XMLHttpRequest();
		xhr.timeout = 2500;
		xhr.withCredentials = true;
		if (supported) {
			server = "https://sdb.apexo.app/status";
			xhr.withCredentials = false;
		}
		xhr.open("GET", server + `${supported ? "" : "/_session"}`, true);
		if (server === "https://sdb.apexo.app/status") {
			xhr.setRequestHeader(
				"Authorization",
				`Bearer ${store.get("LSL_time")}`
			);
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status > 199 && xhr.status < 300) {
					resolve(JSON.parse(xhr.response).userCtx);
				} else {
					resolve(false);
				}
			}
		};
		try {
			xhr.send(null);
		} catch (exception) {
			utils.log(exception);
			return resolve(false);
		}
	});
}
