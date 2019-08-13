import isClientOnlineLib from "is-online";
export const connSetting = {
	emulateOffline: !!localStorage.getItem("emulate_offline")
};

export async function checkServer(
	server: string
): Promise<false | { name: string | null }> {
	return new Promise(resolve => {
		if (connSetting.emulateOffline) {
			resolve(false);
		}
		const http = new XMLHttpRequest();
		http.timeout = 2500;
		http.withCredentials = true;
		http.open("GET", server + "/_session", true);
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status > 199 && http.status < 300) {
					resolve(JSON.parse(http.response).userCtx);
				} else {
					resolve(false);
				}
			}
		};
		try {
			http.send(null);
		} catch (exception) {
			console.log(exception);
			return resolve(false);
		}
	});
}

export async function checkClient() {
	if (connSetting.emulateOffline) {
		return false;
	}
	return await isClientOnlineLib();
}
