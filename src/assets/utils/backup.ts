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
import { resync } from "../../core/db";
import { saveAs } from "file-saver";
import { SettingItemJSON, SettingsItem } from "../../modules/settings/data";
import { settingsData } from "../../modules/settings";
import { Treatment, TreatmentJSON } from "../../modules/treatments/data";
import { treatmentsData } from "../../modules/treatments";

const ext = "apx";

interface BackupJSON {
	appointments: AppointmentJSON[];
	staff: StaffMemberJSON[];
	ortho: CaseJSON[];
	patients: PatientJSON[];
	prescriptions: PrescriptionItemJSON[];
	settings: SettingItemJSON[];
	treatments: TreatmentJSON[];
}

export interface DropboxFile {
	name: string;
	path_lower: string;
	id: string;
	size: number;
	client_modified: string;
}

export const backup = {
	toJSON: function(): BackupJSON {
		const appointments = appointmentsData.appointments.list.map(x =>
			x.toJSON()
		);
		const staff = staffData.staffMembers.list.map(x => x.toJSON());
		const ortho = orthoData.cases.list.map(x => x.toJSON());
		const patients = patientsData.patients.list.map(x => x.toJSON());
		const prescriptions = prescriptionsData.prescriptions.list.map(x =>
			x.toJSON()
		);
		const settings = settingsData.settings.list.map(x => x.toJSON());
		const treatments = treatmentsData.treatments.list.map(x => x.toJSON());

		return {
			appointments,
			staff,
			ortho,
			patients,
			prescriptions,
			settings,
			treatments
		};
	},

	toBase64: function() {
		return encode(JSON.stringify(backup.toJSON()));
	},

	toBlob: function() {
		return new Blob(["apexo-backup:" + backup.toBase64()], {
			type: "text/plain;charset=utf-8"
		});
	},

	toDropbox: function(accessToken: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const file = backup.toBlob();
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
	fromJSON: async function(json: BackupJSON) {
		API.login.resetUser();

		appointmentsData.appointments.list.splice(
			0,
			appointmentsData.appointments.list.length
		);
		staffData.staffMembers.list.splice(
			0,
			staffData.staffMembers.list.length
		);
		orthoData.cases.list.splice(0, orthoData.cases.list.length);
		patientsData.patients.list.splice(0, patientsData.patients.list.length);
		prescriptionsData.prescriptions.list.splice(
			0,
			prescriptionsData.prescriptions.list.length
		);
		settingsData.settings.list.splice(0, settingsData.settings.list.length);
		treatmentsData.treatments.list.splice(
			0,
			treatmentsData.treatments.list.length
		);

		json.appointments.forEach(item => {
			appointmentsData.appointments.list.push(new Appointment(item));
		});
		(json.staff || (json as any).doctors) /* in case using an old backup */
			.forEach(item => {
				staffData.staffMembers.list.push(new StaffMember(item));
			});
		json.ortho.forEach(item => {
			orthoData.cases.list.push(new OrthoCase(item));
		});
		json.patients.forEach(item => {
			patientsData.patients.list.push(new Patient(item));
		});
		json.prescriptions.forEach(item => {
			prescriptionsData.prescriptions.list.push(
				new PrescriptionItem(item)
			);
		});
		json.settings.forEach(item => {
			settingsData.settings.list.push(new SettingsItem(item));
		});
		json.treatments.forEach(item => {
			treatmentsData.treatments.list.push(new Treatment(item));
		});
	},

	fromBase64: async function(base64Data: string, ignoreConfirm?: boolean) {
		if (!ignoreConfirm) {
			const confirmation = prompt(`All unsaved data will be lost.
			All data will be removed and replaced by the backup file.
			Type "yes" to confirm`);

			if (!confirmation || confirmation.toLowerCase() !== "yes") {
				return alert("Backup canceled");
			}
		}

		restore.fromJSON(JSON.parse(decode(base64Data)));
		API.router.reSyncing = true;
		await resync.resync();
		API.router.reSyncing = false;
	},

	fromFile: async function(file: Blob) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function() {
			const base64data = reader.result;
			if (typeof base64data === "string") {
				const fileData = atob(base64data.split("base64,")[1]).split(
					"apexo-backup:"
				)[1];
				if (fileData) {
					return restore.fromBase64(fileData);
				}
			}
			return alert("Invalid file");
		};
	},

	fromDropbox: function(accessToken: string, filePath: string) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = function() {
				if (xhr.status === 200) {
					const backupBlob = new Blob([xhr.response], {
						type: "application/octet-stream"
					});

					restore.fromFile(backupBlob);
				} else {
					const errorMessage =
						xhr.response || "Unable to download file";
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

export function downloadCurrent() {
	const blob = backup.toBlob();
	const fileName = prompt("File name:");
	saveAs(blob, `${fileName || "apexo-backup"}.${ext}`);
}
