import { minute } from "./../../../assets/utils/date";
import { observable } from "mobx";
import { SettingsItem } from "./class.setting";
import { generateID } from "../../../assets/utils/generate-id";
import * as settings from "./index";
import { API, DropboxFile } from "../../../core/index";
import { day } from "../../../assets/utils/date";

class Settings {
	ignoreObserver: boolean = false;
	@observable list: SettingsItem[] = [];
	@observable dropboxBackups: DropboxFile[] = [];

	getSetting(id: keyof typeof settings.dictionary): string {
		return (this.list.find(x => x._id.endsWith(id)) || { val: "" }).val;
	}

	setSetting(id: keyof typeof settings.dictionary, val: string) {
		const i = this.list.findIndex(x => x._id.endsWith(id));
		if (i === -1) {
			// add
			this.list.push(new SettingsItem({ _id: generateID(20, id), val }));
		} else {
			// update
			this.list[i].val = val;
		}
	}

	async updateDropboxBackups() {
		const sortedResult = (await API.backup.list())
			.filter(x => x.client_modified && x.name.endsWith(".apx"))
			.sort(
				(a, b) =>
					new Date(a.client_modified).getTime() -
					new Date(b.client_modified).getTime()
			);

		this.dropboxBackups = sortedResult;
	}

	async automatedBackups() {
		const frequency: "d" | "w" | "m" | "n" = this.getSetting(
			"backup_freq"
		) as any;
		const retain = Number(this.getSetting("backup_retain")) || 3;

		// carry on, only if there's access token
		if (!API.login.dropboxActive) {
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
			await API.backup.toDropbox();
			await this.updateDropboxBackups();
		} else if (frequency === "w" && diffInDays > 7) {
			await API.backup.toDropbox();
			await this.updateDropboxBackups();
		} else if (frequency === "m" && diffInDays > 30) {
			await API.backup.toDropbox();
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
			await API.backup.deleteOld(file.path_lower);
			await this.updateDropboxBackups();
		});
	}

	constructor() {
		setInterval(() => {
			this.automatedBackups();
		}, 2 * minute); // check every 2 minutes
	}
}

const setting = new Settings();
export default setting;
