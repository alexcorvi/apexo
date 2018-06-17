import { appointmentsComponents, appointmentsData, register as registerAppointments } from './appointments';
import { doctorsComponents, doctorsData, register as registerDoctors } from './doctors';
import { patientsComponents, patientsData, register as registerPatients } from './patients';
import { prescriptionsComponents, prescriptionsData, register as registerPrescriptions } from './prescriptions';
import { register as registerSettings, settingsComponents, settingsData } from './settings';
import { register as registerStatistics, statisticsComponents, statisticsData } from './statistics';
import { register as registerTreatments, treatmentsComponents, treatmentsData } from './treatments';
import { register as registerOrthodontics, orthoComponents, orthoData } from './orthodontic';

/**
 * All modules data
 * @export
 */
export const data = {
	appointmentsData,
	patientsData,
	settingsData,
	statisticsData,
	treatmentsData,
	prescriptionsData,
	doctorsData,
	orthoData
};

(window as any).data = data;

/**
 * All modules components
 * @export
 */
export const components = {
	appointmentsComponents,
	patientsComponents,
	settingsComponents,
	statisticsComponents,
	treatmentsComponents,
	prescriptionsComponents,
	doctorsComponents,
	orthoComponents
};

/**
 * Module registration array
 * @export
*/
export const register = [
	registerAppointments,
	registerPatients,
	registerSettings,
	registerStatistics,
	registerTreatments,
	registerPrescriptions,
	registerDoctors,
	registerOrthodontics
];

let alreadyRegistered = false;

/**
 * Modules registration function
 * @export
 */
export async function registerModules() {
	return new Promise<boolean>((resolve) => {
		if (alreadyRegistered) {
			resolve(true);
		}
		alreadyRegistered = true;
		let done = 0;
		register.sort((a, b) => a.order - b.order).forEach(async (module) => {
			await module.register();
			done++;
		});
		const checkRegistered = setInterval(() => {
			if (done === register.length) {
				resolve(true);
			}
		}, 300);
	});
}
