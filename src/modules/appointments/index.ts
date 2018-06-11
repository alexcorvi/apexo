import * as appointmentsComponents from './components';
import * as appointmentsData from './data';

import { API } from '../../core';
import { settingsData } from '../settings/index';

export const register = {
	register() {
		API.router.register(appointmentsData.namespace, /^appointments/, appointmentsComponents.Calendar);
		API.menu.items.push({
			icon: 'Calendar',
			name: appointmentsData.namespace,
			key: appointmentsData.namespace,
			onClick: () => {
				API.router.go([ appointmentsData.namespace ]);
			},
			order: 3,
			url: ''
		});
		API.connectToDB<appointmentsData.AppointmentJSON>(appointmentsData.namespace)(
			appointmentsData.Appointment,
			appointmentsData.appointments
		);
	},
	order: 9
};

// export data
export { appointmentsData };
export { appointmentsComponents };
