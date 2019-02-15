import {
	appointmentsComponents,
	appointmentsData,
	register as registerAppointments
} from "./appointments";
import { staffComponents, staffData, register as registerStaff } from "./staff";
import {
	patientsComponents,
	patientsData,
	register as registerPatients
} from "./patients";
import {
	prescriptionsComponents,
	prescriptionsData,
	register as registerPrescriptions
} from "./prescriptions";
import {
	register as registerSettings,
	settingsComponents,
	settingsData
} from "./settings";
import {
	register as registerStatistics,
	statisticsComponents,
	statisticsData
} from "./statistics";
import {
	register as registerTreatments,
	treatmentsComponents,
	treatmentsData
} from "./treatments";
import {
	register as registerOrthodontics,
	orthoComponents,
	orthoData
} from "./orthodontic";

export const data = {
	appointmentsData,
	patientsData,
	settingsData,
	statisticsData,
	treatmentsData,
	prescriptionsData,
	staffData,
	orthoData
};

(window as any).data = data;

export const components = {
	appointmentsComponents,
	patientsComponents,
	settingsComponents,
	statisticsComponents,
	treatmentsComponents,
	prescriptionsComponents,
	staffComponents,
	orthoComponents
};

export const register = [
	registerAppointments,
	registerPatients,
	registerSettings,
	registerStatistics,
	registerTreatments,
	registerPrescriptions,
	registerStaff,
	registerOrthodontics
];

let alreadyRegistered = false;

export async function registerModules() {
	return new Promise<boolean>(resolve => {
		if (alreadyRegistered) {
			resolve(true);
		}
		alreadyRegistered = true;
		let done = 0;
		register
			.sort((a, b) => a.order - b.order)
			.forEach(async module => {
				try {
					await module.register();
				} catch (e) {
					try {
						await module.register();
					} catch (e) {}
				}
				done++;
			});
		const checkRegistered = setInterval(() => {
			if (done === register.length) {
				resolve(true);
				clearInterval(checkRegistered);
			}
		}, 300);
	});
}
