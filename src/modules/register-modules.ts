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

(window as any).getData = function getData() {
	return {
		staff: modules.staff!.docs.map((x) => x.toJSON()),
		treatments: modules.treatments!.docs.map((x) => x.toJSON()),
		patients: modules.patients!.docs.map((x) => x.toJSON()),
		appointments: modules.appointments!.docs.map((x) => x.toJSON()),
		orthoCases: modules.orthoCases!.docs.map((x) => x.toJSON()),
		labworks: modules.labworks!.docs.map((x) => x.toJSON()),
		prescriptions: modules.prescriptions!.docs.map((x) => x.toJSON()),
	};
};

export async function registerModules() {
	await Promise.all(register.map((singleModule) => singleModule()));
	// resync on load: only staff database initially
	// because we need it in login
	core.status.loadingIndicatorText = "Downloading your clinic data";
	if (core.status.server !== "http://cypress") {
		await dbAction("resync");
		setInterval(() => {
			dbAction("resync");
		}, 2 * utils.minute);
	}
}
