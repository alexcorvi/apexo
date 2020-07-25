import { backup, dbAction, status, UploadedFile } from "@core";
import { dictionary, SettingItemSchema, SettingsItem } from "@modules";
import * as modules from "@modules";
import { day, generateID, minute, num } from "@utils";
import * as utils from "@utils";
import { observable, observe } from "mobx";
import { Store } from "pouchx";

export class Settings extends Store<SettingItemSchema, SettingsItem> {
	@observable autoBackups: UploadedFile[] = [];

	private settingChangeCallbacks: (() => void)[] = [];

	async afterChange() {
		// resync on change
		dbAction("resync", modules.settingsNamespace);
	}

	getSetting(id: keyof typeof dictionary): string {
		return (this.docs.find((x) => x._id.endsWith(id)) || { val: "" }).val;
	}

	setSetting(id: keyof typeof dictionary, val: string) {
		const i = this.docs.findIndex((x) => x._id.endsWith(id));
		if (i === -1) {
			// add
			this.add(this.new({ _id: generateID(20, id), val }));
		} else {
			// update
			this.docs[i].val = val;
		}
		this.settingChangeCallbacks.forEach((callback) => callback());
	}

	onSettingChange(callback: () => void) {
		this.settingChangeCallbacks.push(callback);
	}

	async updateAutoBackups() {
		try {
			const sortedResult = (await backup.list()).sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime()
			);

			this.autoBackups = sortedResult;
		} catch (e) {
			utils.log("Could not update auto backups", e);
		}
	}

	async automatedBackups() {
		// carry on, only if file server is online
		if (!status.isOnline.files) {
			return;
		}

		await this.updateAutoBackups();
		const lastBackupFile = this.autoBackups[this.autoBackups.length - 1];
		const now = new Date().getTime();
		const then = new Date((lastBackupFile || { date: 0 }).date).getTime();
		const diffInDays = Math.floor((now - then) / day);
		if (diffInDays > 1) {
			await backup.toFilesServer();
			await this.updateAutoBackups();
		}

		let backupsToDeleteNumber = this.autoBackups.length - 30;
		const backupsToDeleteFiles: UploadedFile[] = [];

		while (backupsToDeleteNumber > 0) {
			backupsToDeleteFiles.push(
				this.autoBackups[backupsToDeleteNumber - 1]
			);
			backupsToDeleteNumber--;
		}

		backupsToDeleteFiles.forEach(async (file) => {
			await backup.deleteFromFilesServer(file.path);
			await this.updateAutoBackups();
		});
	}
}
export let setting: Settings | null = null;

export const setSettingsStore = (store: Settings) => {
	setting = store;
	setInterval(() => {
		if (setting) {
			setting.automatedBackups();
		}
	}, 2 * minute);
};
