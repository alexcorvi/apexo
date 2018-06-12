import * as prescriptionsComponents from './components';
import * as prescriptionsData from './data';

import { API } from '../../core';
import { settingsData } from '../settings/index';

export const register = {
	register() {
		API.router.register(
			prescriptionsData.namespace,
			/^prescriptions\/?$/,
			prescriptionsComponents.PrescriptionsTable,
			() => !!settingsData.settings.getSetting('module_prescriptions')
		);
		API.menu.items.push({
			icon: 'Pill',
			name: prescriptionsData.namespace,
			key: prescriptionsData.namespace,
			onClick: () => {
				API.router.go([ prescriptionsData.namespace ]);
			},
			order: 9,
			url: '',
			condition: () => !!settingsData.settings.getSetting('module_prescriptions')
		});
		(API.connectToDB(prescriptionsData.namespace) as any)(
			prescriptionsData.PrescriptionItem,
			prescriptionsData.prescriptions
		);
	},
	order: 5
};
// export data
export { prescriptionsData };
export { prescriptionsComponents };
