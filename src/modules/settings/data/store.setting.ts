import { backup, dbAction, DropboxFile, status } from "@core";
import { dictionary, SettingItemSchema, SettingsItem } from "@modules";
import * as modules from "@modules";
import { day, generateID, minute, num } from "@utils";
import { observable, observe } from "mobx";
import { Store } from "pouchx";

export class Settings extends Store<SettingItemSchema, SettingsItem> {
	@observable dropboxBackups: DropboxFile[] = [];
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

	async updateDropboxBackups() {
		try {
			const sortedResult = (await backup.list())
				.filter((x) => x.client_modified && x.name.endsWith(".apx"))
				.sort(
					(a, b) =>
						new Date(a.client_modified).getTime() -
						new Date(b.client_modified).getTime()
				);

			this.dropboxBackups = sortedResult;
		} catch (e) {
			console.log("Could not update dropbox backups", e);
		}
	}

	async automatedBackups() {
		const frequency: "d" | "w" | "m" | "n" = this.getSetting(
			"backup_freq"
		) as any;
		const retain = num(this.getSetting("backup_retain")) || 3;

		// carry on, only if there's access token
		if (!status.isOnline.files) {
			return;
		}

		if (["m", "w", "d"].indexOf(frequency) === -1) {
			return;
		}

		await this.updateDropboxBackups();

		const lastBackupFile = this.dropboxBackups[
			this.dropboxBackups.length - 1
		] || {
			name: "",
			path_lower: "",
			id: "",
			size: 0,
			client_modified: new Date(0).getTime(),
		};

		const now = new Date().getTime();
		const then = new Date(lastBackupFile.client_modified).getTime();
		const diffInDays = Math.floor((now - then) / day);

		if (frequency === "d" && diffInDays > 1) {
			await backup.toDropbox();
			await this.updateDropboxBackups();
		} else if (frequency === "w" && diffInDays > 7) {
			await backup.toDropbox();
			await this.updateDropboxBackups();
		} else if (frequency === "m" && diffInDays > 30) {
			await backup.toDropbox();
			await this.updateDropboxBackups();
		}

		let backupsToDeleteNumber = this.dropboxBackups.length - retain;
		const backupsToDeleteFiles: DropboxFile[] = [];

		while (backupsToDeleteNumber > 0) {
			backupsToDeleteFiles.push(
				this.dropboxBackups[backupsToDeleteNumber - 1]
			);
			backupsToDeleteNumber--;
		}

		backupsToDeleteFiles.forEach(async (file) => {
			await backup.deleteFromDropbox(file.path_lower);
			await this.updateDropboxBackups();
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
	}, 2 * minute); // check every 2 minutes
};
