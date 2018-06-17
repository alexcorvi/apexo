import * as doctorsComponents from './components';
import * as doctorsData from './data';

import { API } from '../../core';

export const register = {
	async register() {
		API.router.register(doctorsData.namespace, /^doctors/, doctorsComponents.DoctorsListing);
		API.menu.items.push({
			icon: 'Contact',
			name: doctorsData.namespace,
			key: doctorsData.namespace,
			onClick: () => {
				API.router.go([ doctorsData.namespace ]);
			},
			order: 0,
			url: ''
		});
		await (API.connectToDB(doctorsData.namespace, true) as any)(doctorsData.Doctor, doctorsData.doctors);
		return true;
	},
	order: 7
};
// export data
export { doctorsData };
export { doctorsComponents };
