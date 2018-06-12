import * as doctorsComponents from './components';
import * as doctorsData from './data';

import { API } from '../../core';

export const register = {
	register() {
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
		(API.connectToDB(doctorsData.namespace, true) as any)(doctorsData.Doctor, doctorsData.doctors);
	},
	order: 7
};
// export data
export { doctorsData };
export { doctorsComponents };
