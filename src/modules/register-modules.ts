import { dbAction } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import * as utils from "@utils";

const register = [
	modules.registerSettings,
	modules.registerStaff,
	modules.registerTreatments,
	modules.registerPatients,
	modules.registerAppointments,
	modules.registerOrthodontic,
	modules.registerLabwork,
	modules.registerPrescriptions,
	modules.registerStats,
];

export async function registerModules() {
	await Promise.all(
		register.map(async (singleModule) => {
			await singleModule();
			core.status.finishedTasks++;
			return;
		})
	);
	// resync on load: only staff database initially
	// because we need it in login
	core.status.loadingIndicatorText = "Downloading your clinic data";
	if (core.status.server !== "http://cypress") {
		await dbAction("resync", "", true);
		setInterval(() => {
			dbAction("resync");
		}, 3 * utils.minute);
	}
}
