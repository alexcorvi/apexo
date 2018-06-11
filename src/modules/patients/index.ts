import * as patientsComponents from './components';
import * as patientsData from './data';

import { API } from '../../core';

export const register = {
	register() {
		API.router.register(patientsData.namespace, /^patients\/?$/, patientsComponents.PatientsListing);
		API.router.register(patientsData.namespace, /^patients\/\w+\/?$/, patientsComponents.SinglePatient);
		API.menu.items.push({
			icon: 'ContactCard',
			name: patientsData.namespace,
			key: patientsData.namespace,
			onClick: () => {
				API.router.go([ patientsData.namespace ]);
			},
			order: 1.5,
			url: ''
		});
		API.connectToDB<patientsData.PatientJSON>(patientsData.namespace)(patientsData.Patient, patientsData.patients);
	},
	order: 4
};

// export data
export { patientsData };
export { patientsComponents };
