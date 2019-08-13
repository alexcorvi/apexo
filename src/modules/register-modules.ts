import { dbAction } from "@core";
import * as core from "@core";
import * as modules from "@modules";

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

export async function registerModules() {
	for (let index = 0; index < register.length; index++) {
		core.status.loadingIndicatorText = "Registering module " + index;
		const reg = register[index];
		await reg();
	}


	core.status.loadingIndicatorText = "Resyncing remote and local databases";
	// resync on registering modules
	await dbAction("resync");

	// resync on elapsed time by 10
	// we're calculating it again to see
	// the elapsed time for a sync with no changes
	core.status.loadingIndicatorText = "Calculating elapsed time";
	const t = new Date().getTime();
	await dbAction("resync");
	const elapsed = new Date().getTime() - t;
	setInterval(async () => {
		await dbAction("resync");
	}, 10 * elapsed);
	core.status.loadingIndicatorText =
		"Finished working on modules and databases";
}
