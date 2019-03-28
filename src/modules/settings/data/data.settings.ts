import { observable } from "mobx";
import { SettingsItem } from "./class.setting";
import { generateID } from "../../../assets/utils/generate-id";
import * as settings from "./index";
import { API, DropboxFile } from "../../../core/index";
import { compact } from "../../../core/db";

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

	updateDropboxFilesList() {
		const accessToken = this.getSetting("dropbox_accessToken");
		API.backup
			.list(accessToken)
			.then(list => {
				this.dropboxBackups = list;
			})
			.catch(() => {});
	}

	automatedBackups() {
		const frequency: "d" | "w" | "m" = this.getSetting(
			"backup_freq"
		) as any;
		const accessToken = this.getSetting("dropbox_accessToken");
		const retain = Number(this.getSetting("backup_retain")) || 3;
		const arr: string[] = JSON.parse(this.getSetting("backup_arr") || "[]");

		// carry on, only if there's access token
		if (!accessToken || !frequency) {
			return;
		}

		if (["m", "w", "d"].indexOf(frequency) === -1) {
			return;
		}

		// delete if due
		if (arr.length > retain) {
			API.backup.deleteOld(accessToken, arr[0]).then(() => {
				arr.splice(0, 1);
				this.setSetting("backup_arr", JSON.stringify(arr));
				this.updateDropboxFilesList();
			});
		}

		// backup if due
		const lastBackupFileName = arr[arr.length - 1];
		if (lastBackupFileName) {
			const now = new Date().getTime();
			const then = new Date(Number(lastBackupFileName)).getTime();
			const diffInDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

			if (frequency === "m" && diffInDays < 30) {
				return;
			}
			if (frequency === "w" && diffInDays < 7) {
				return;
			}
			if (frequency === "d" && diffInDays < 1) {
				return;
			}
		}

		API.backup.toDropbox(accessToken).then(name => {
			arr.push(name.toString());
			this.setSetting("backup_arr", JSON.stringify(arr));
			this.updateDropboxFilesList();
		});

		compact
			.compact()
			.then(() => console.log("backup and compaction is done"));
	}

	constructor() {
		setInterval(() => {
			this.automatedBackups();
		}, 60 * 1000); // check every minutes
	}
}

const setting = new Settings();
export default setting;
