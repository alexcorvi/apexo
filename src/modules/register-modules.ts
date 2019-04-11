import {
	registerAppointments,
	registerOrthodontic,
	registerPatients,
	registerPrescriptions,
	registerSettings,
	registerStaff,
	registerStats,
	registerTreatments
	} from "@modules";

const register = [
	registerAppointments,
	registerPatients,
	registerSettings,
	registerStats,
	registerTreatments,
	registerPrescriptions,
	registerStaff,
	registerOrthodontic
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
						console.error(
							"Failed to register module with order:",
							module.order,
							e,
							"Will try again"
						);
						await module.register();
					} catch (e) {
						console.error(
							"Failed to register module with order:",
							module.order,
							e
						);
					}
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
