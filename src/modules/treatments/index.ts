import * as treatmentsComponents from './components';
import * as treatmentsData from './data';

import { API } from '../../core';

export const register = {
	register() {
		API.router.register(treatmentsData.namespace, /^treatments/, treatmentsComponents.Treatments);
		API.menu.items.push({
			icon: 'Cricket',
			name: treatmentsData.namespace,
			onClick: () => {
				API.router.go([ treatmentsData.namespace ]);
			},
			order: 5,
			url: '',
			key: treatmentsData.namespace
		});
		(API.connectToDB(treatmentsData.namespace) as any)(treatmentsData.Treatment, treatmentsData.treatments);
	},
	order: 3
};

// export data
export { treatmentsData };
export { treatmentsComponents };
