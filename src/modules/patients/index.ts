import * as patientsComponents from './components';
import * as patientsData from './data';

import { API } from '../../core';

export const register = {
	async register() {
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
		await (API.connectToDB(patientsData.namespace) as any)(patientsData.Patient, patientsData.patients);
		return true;
	},
	order: 4
};

// export data
export { patientsData };
export { patientsComponents };
