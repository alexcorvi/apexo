import { compact } from "./../../core/db/index";
import { files, BACKUPS_DIR } from "./../../core/files/files";
import { Message } from "./../../core/messages/class.message";
import { API } from "../../core";
import { decode, encode } from "./base64";
import { resync, destroyLocal } from "../../core/db";
import { saveAs } from "file-saver";
import { modals } from "../../core/modal/data.modal";
import messages from "../../core/messages/data.messages";
import { decrypt } from "./encryption";

import pouchDB = require("pouchdb-browser");
import { appointmentsData } from "../../modules/appointments";
import { staffData } from "../../modules/staff";
import { orthoData } from "../../modules/orthodontic";
import { patientsData } from "../../modules/patients";
import { prescriptionsData } from "../../modules/prescriptions";
import { settingsData } from "../../modules/settings";
import { treatmentsData } from "../../modules/treatments";
const PouchDB: PouchDB.Static = (pouchDB as any).default;
const ext = "apx";

export interface DropboxFile {
	name: string;
	path_lower: string;
	id: string;
	size: number;
	client_modified: string;
}

export interface DatabaseDump {
	dbName: string;
	data: any[];
}

export const backup = {
	toJSON: function() {
		return new Promise(async (resolve, reject) => {
			await compact.compact();

			const databases = [
				appointmentsData.namespace,
				"doctors",
				orthoData.namespace,
				patientsData.namespace,
				prescriptionsData.namespace,
				settingsData.namespace,
				treatmentsData.namespace
			];

			const dumps: DatabaseDump[] = [];

			let done = 0;

			databases.forEach(async dbName => {
				let credentials = { username: "", password: "" };
				if (localStorage.getItem("ec")) {
					credentials = JSON.parse(
						decrypt(localStorage.getItem("ec") || "")
					);
				}
				const remoteDatabase = new PouchDB(
					`${API.login.server}/${dbName}`,
					{
						auth: {
							username: credentials.username,
							password: credentials.password
						}
					}
				);

				const data = (await remoteDatabase.allDocs({
					include_docs: true,
					attachments: true
				})).rows.map(entry => {
					if (entry.doc) {
						delete entry.doc._rev;
					}
					return entry.doc;
				});

				dumps.push({ dbName, data });

				done++;
				return;
			});

			const checkInterval = setInterval(() => {
				if (done === databases.length) {
					clearInterval(checkInterval);
					resolve(dumps);
				}
			}, 500);
		});
	},

	toBase64: async function() {
		const JSONDump = await backup.toJSON();
		return encode(JSON.stringify(JSONDump));
	},

	toBlob: async function() {
		const base64 = await backup.toBase64();
		return new Blob(["apexo-backup:" + base64], {
			type: "text/plain;charset=utf-8"
		});
	},

	toDropbox: async function(): Promise<string> {
		const blob = await backup.toBlob();
		const path = await files.save(blob, ext, BACKUPS_DIR);
		return path;
	},

	list: async function() {
		return await files.list(BACKUPS_DIR);
	},

	deleteOld: async function(path: string) {
		return await files.remove(path);
	}
};

export const restore = {
	fromJSON: async function(json: DatabaseDump[]) {
		API.login.resetUser();
		let done = 0;

		return new Promise((resolve, reject) => {
			json.forEach(async dump => {
				const dbName = dump.dbName;

				let credentials = { username: "", password: "" };
				if (localStorage.getItem("ec")) {
					credentials = JSON.parse(
						decrypt(localStorage.getItem("ec") || "")
					);
				}
				const remoteDatabase1 = new PouchDB(
					`${API.login.server}/${dbName}`,
					{
						auth: {
							username: credentials.username,
							password: credentials.password
						},
						skip_setup: false
					}
				);
				await remoteDatabase1.destroy();
				const remoteDatabase2 = new PouchDB(
					`${API.login.server}/${dbName}`,
					{
						auth: {
							username: credentials.username,
							password: credentials.password
						},
						skip_setup: false
					}
				);
				const a = await remoteDatabase2.bulkDocs(dump.data);
				done++;
				return;
			});

			const checkInterval = setInterval(async () => {
				if (done === json.length) {
					clearInterval(checkInterval);
					await destroyLocal.destroy();
					await resync.resync();
					location.reload();
				}
			});
		});
	},

	fromBase64: async function(base64Data: string, ignoreConfirm?: boolean) {
		return new Promise(async (resolve, reject) => {
			if (ignoreConfirm) {
				const json = JSON.parse(decode(base64Data));
				await restore.fromJSON(json);
				resolve();
			} else {
				modals.newModal({
					message: `All unsaved data will be lost. All data will be removed and replaced by the backup file. Type "yes" to confirm`,
					onConfirm: async (input: string) => {
						if (input.toLowerCase() === "yes") {
							const json = JSON.parse(decode(base64Data));
							await restore.fromJSON(json);
							resolve();
						} else {
							const msg = new Message("Restoration cancelled");
							messages.addMessage(msg);
							reject();
						}
					},
					input: true,
					showCancelButton: false,
					showConfirmButton: true,
					id: Math.random()
				});
			}
		});
	},

	fromFile: async function(file: Blob) {
		return new Promise((resolve, reject) => {
			function terminate() {
				const msg = new Message("Invalid file");
				messages.addMessage(msg);
				reject();
			}
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = async function() {
				const base64data = reader.result;
				if (typeof base64data === "string") {
					const fileData = atob(base64data.split("base64,")[1]).split(
						"apexo-backup:"
					)[1];
					if (fileData) {
						await restore.fromBase64(fileData);
						resolve();
					} else {
						terminate();
					}
				} else {
					terminate();
				}
			};
		});
	},

	fromDropbox: async function(filePath: string) {
		const base64File = (await files.get(filePath)).split(";base64,")[1];
		const base64Data = decode(base64File).split("apexo-backup:")[1];
		this.fromBase64(base64Data);
	}
};

export async function downloadCurrent() {
	const blob = await backup.toBlob();
	return new Promise(resolve => {
		modals.newModal({
			id: Math.random(),
			message: "Please enter file name",
			onConfirm: fileName => {
				saveAs(blob, `${fileName || "apexo-backup"}.${ext}`);
				resolve();
			},
			input: true,
			showCancelButton: true,
			showConfirmButton: true
		});
	});
}
