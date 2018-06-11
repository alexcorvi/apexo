import * as orthoComponents from './components';
import * as orthoData from './data';

import { API } from '../../core';
import { settingsData } from '../settings/index';

export const register = {
	register() {
		API.router.register(
			orthoData.namespace,
			/^orthodontic$/,
			orthoComponents.OrthoList,
			() => !!settingsData.settings.getSetting('module_orthodontics')
		);
		API.router.register(orthoData.namespace, /^orthodontic\/.*/, orthoComponents.OrthoSingle);
		API.menu.items.push({
			icon: 'DietPlanNotebook',
			name: orthoData.namespace,
			key: orthoData.namespace,
			onClick: () => {
				API.router.go([ orthoData.namespace ]);
			},
			order: 3,
			url: '',

			condition: () => !!settingsData.settings.getSetting('module_orthodontics')
		});
		API.connectToDB<orthoData.CaseJSON>(orthoData.namespace)(orthoData.OrthoCase, orthoData.cases);
	},
	order: 8
};
// export data
export { orthoData };
export { orthoComponents };
