import * as core from "@core";
import * as modules from "@modules";
import * as React from "react";
export const registerSettings = {
	async register() {
		modules.setting.setSetting("hourlyRate", "50");
		modules.setting.setSetting("currencySymbol", "$");

		core.router.register({
			namespace: modules.settingsNamespace,
			regex: /^settings/,
			component: async () => {
				const SettingsPage = (await import(
					"./components/page.settings"
				)).SettingsPage;
				return (
					<SettingsPage
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						dropboxBackups={modules.setting.dropboxBackups}
						updateDropboxBackups={() =>
							modules.setting.updateDropboxBackups()
						}
						validateDropboxToken={() =>
							core.status.validateDropBoxToken()
						}
						setSetting={(...args) =>
							modules.setting.setSetting(...args)
						}
						getSetting={id => modules.setting.getSetting(id)}
						compact={() => core.compact.compact()}
						restoreFromFile={file => core.restore.fromFile(file)}
						restoreFromDropbox={path =>
							core.restore.fromDropbox(path)
						}
						deleteDropboxBackup={path =>
							core.backup.deleteFromDropbox(path)
						}
						downloadCurrent={() =>
							core.downloadCurrentStateAsBackup()
						}
					/>
				);
			},
			condition: () =>
				(core.user.currentUser || { canViewSettings: false })
					.canViewSettings
		});

		core.menu.items.push({
			icon: "Settings",
			name: modules.settingsNamespace,
			key: modules.settingsNamespace,
			onClick: () => {
				core.router.go([modules.settingsNamespace]);
			},
			order: 999,
			url: "",
			condition: () =>
				(core.user.currentUser || { canViewSettings: false })
					.canViewSettings
		});
		await ((await core.connectToDB(
			modules.settingsNamespace,
			modules.settingsNamespace
		)) as any)(modules.SettingsItem, modules.setting);
		return true;
	},
	order: 0
};
