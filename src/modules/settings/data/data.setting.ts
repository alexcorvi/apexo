import { backup, DropboxFile, status } from "@core";
import { dictionary, SettingsItem } from "@modules";
import { day, generateID, minute, num } from "@utils";
import { observable, observe } from "mobx";

class Settings {
	ignoreObserver: boolean = false;
	@observable list: SettingsItem[] = [];
	@observable dropboxBackups: DropboxFile[] = [];

	private settingChangeCallbacks: (() => void)[] = [];

	getSetting(id: keyof typeof dictionary): string {
		return (this.list.find(x => x._id.endsWith(id)) || { val: "" }).val;
	}

	setSetting(id: keyof typeof dictionary, val: string) {
		const i = this.list.findIndex(x => x._id.endsWith(id));
		if (i === -1) {
			// add
			this.list.push(new SettingsItem({ _id: generateID(20, id), val }));
		} else {
			// update
			this.list[i].val = val;
		}
		this.settingChangeCallbacks.forEach(callback => callback());
	}

	onSettingChange(callback: () => void) {
		this.settingChangeCallbacks.push(callback);
	}

	async updateDropboxBackups() {
		try {
			const sortedResult = (await backup.list())
				.filter(x => x.client_modified && x.name.endsWith(".apx"))
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
		if (!status.dropboxActive) {
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
			client_modified: new Date(0).getTime()
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

		backupsToDeleteFiles.forEach(async file => {
			await backup.deleteOld(file.path_lower);
			await this.updateDropboxBackups();
		});
	}

	constructor() {
		setInterval(() => {
			this.automatedBackups();
		}, 2 * minute); // check every 2 minutes
	}
}
export const setting = new Settings();
