import * as settingsComponents from './components';
import * as settingsData from './data';

import { API } from '../../core';

export const register = {
	register() {
		settingsData.settings.setSetting('hourlyRate', '50');
		settingsData.settings.setSetting('currencySymbol', '$');
		API.router.register(settingsData.namespace, /^settings\/?$/, settingsComponents.SettingsComponent);
		API.menu.items.push({
			icon: 'Settings',
			name: settingsData.namespace,
			key: settingsData.namespace,
			onClick: () => {
				API.router.go([ settingsData.namespace ]);
			},
			order: 999,
			url: ''
		});
		API.connectToDB<settingsData.SettingItemJSON>(settingsData.namespace)(
			settingsData.SettingsItem,
			settingsData.settings
		);
	},
	order: 0
};

// export data
export { settingsData };
export { settingsComponents };
