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
	modules.registerStats
];

async function initResync() {
	// resync on function call
	await dbAction("resync");
	// resync on interval of 2 minutes
	setTimeout(initResync, 2 * utils.minute);
}

export async function registerModules() {
	for (let index = 0; index < register.length; index++) {
		core.status.loadingIndicatorText = "Registering module " + index;
		const reg = register[index];
		await reg();
	}

	// resync on load: only staff database initially
	// because we need it in login
	core.status.loadingIndicatorText = "Resyncing basic info";
	await dbAction("resync", "doctors");

	initResync();
}
