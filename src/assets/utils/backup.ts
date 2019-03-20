import { Message } from "./../../core/messages/class.message";
import { API } from "../../core";
import { Appointment, AppointmentJSON } from "../../modules/appointments/data";
import { appointmentsData } from "../../modules/appointments";
import { CaseJSON, OrthoCase } from "../../modules/orthodontic/data";
import { decode, encode } from "./base64";
import { StaffMember, StaffMemberJSON } from "../../modules/staff/data";
import { staffData } from "../../modules/staff";
import { orthoData } from "../../modules/orthodontic";
import { Patient, PatientJSON } from "../../modules/patients/data";
import { patientsData } from "../../modules/patients";
import {
	PrescriptionItem,
	PrescriptionItemJSON
} from "../../modules/prescriptions/data";
import { prescriptionsData } from "../../modules/prescriptions";
import { resync, destroyLocal } from "../../core/db";
import { saveAs } from "file-saver";
import { SettingItemJSON, SettingsItem } from "../../modules/settings/data";
import { settingsData } from "../../modules/settings";
import { Treatment, TreatmentJSON } from "../../modules/treatments/data";
import { treatmentsData } from "../../modules/treatments";
import { modals } from "../../core/modal/data.modal";
import messages from "../../core/messages/data.messages";
import { decrypt } from "./encryption";
import PouchDB from "pouchdb-browser";

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
			const databases = [
				"appointments",
				"doctors",
				"files",
				"orthodontic",
				"patients",
				"prescriptions",
				"settings",
				"treatments"
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

	toDropbox: function(accessToken: string): Promise<number> {
		return new Promise(async (resolve, reject) => {
			const file = await backup.toBlob();
			const xhr = new XMLHttpRequest();
			const fileName = new Date().getTime();
			xhr.onload = function() {
				if (xhr.status === 200) {
					return resolve(fileName);
				} else {
					return reject(xhr.response || "Unable to upload file");
				}
			};

			xhr.open("POST", "https://content.dropboxapi.com/2/files/upload");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader("Content-Type", "application/octet-stream");
			xhr.setRequestHeader(
				"Dropbox-API-Arg",
				JSON.stringify({
					path: "/" + `${fileName}.${ext}`,
					mode: "add",
					autorename: true,
					mute: false
				})
			);

			xhr.send(file);
		});
	},

	deleteOld: function(accessToken: string, name: string) {
		const path = `/${name}.${ext}`;
		return new Promise((resolve, reject) => {
			const file = backup.toBlob();
			const xhr = new XMLHttpRequest();
			const fileName = new Date().getTime();

			xhr.onload = function() {
				if (xhr.status === 200) {
					return resolve();
				} else {
					return reject(xhr.response || "Unable to delete file");
				}
			};

			xhr.open("POST", "https://api.dropboxapi.com/2/files/delete_v2");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");

			xhr.send(JSON.stringify({ path }));
		});
	},

	list: function(accessToken: string): Promise<DropboxFile[]> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onload = function() {
				if (xhr.status === 200) {
					return resolve(JSON.parse(xhr.response).entries);
				} else {
					return reject(xhr.response || "Unable to upload file");
				}
			};

			xhr.open("POST", "https://api.dropboxapi.com/2/files/list_folder");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(
				JSON.stringify({
					path: "",
					recursive: false,
					include_media_info: false,
					include_deleted: false,
					include_has_explicit_shared_members: false
				})
			);
		});
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

	fromDropbox: async function(accessToken: string, filePath: string) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = async function() {
				if (xhr.status === 200) {
					const backupBlob = new Blob([xhr.response], {
						type: "application/octet-stream"
					});
					await restore.fromFile(backupBlob);
					resolve();
				} else {
					const errorMessage =
						xhr.response || "Unable to download file";
					reject(errorMessage);
				}
			};

			xhr.open("POST", "https://content.dropboxapi.com/2/files/download");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader(
				"Dropbox-API-Arg",
				JSON.stringify({
					path: filePath
				})
			);
			xhr.send();
		});
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
