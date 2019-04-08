import { DropboxFile } from "./../../assets/utils/backup";
import * as pouchDB from "pouchdb-browser";
const PouchDB: PouchDB.Static = (pouchDB as any).default;
import { generateID } from "../../assets/utils/generate-id";
import setting from "../../modules/settings/data/data.settings";

export const BACKUPS_DIR = "/backups";
export const GALLERIES_DIR = "/galleries";
export const ORTHO_RECORDS_DIR = "/ortho";
export const CEPHALOMETRIC_DIR = "/ceph";

function arrayBufferToBase64(
	buffer: ArrayBuffer,
	ext: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		const blob = new Blob([buffer], { type: `image/${ext}` });
		const reader = new FileReader();
		reader.onload = function(evt: any) {
			const dataURL: string = evt.target.result;
			resolve(dataURL);
		};
		reader.readAsDataURL(blob);
	});
}

export const files = {
	async save(blob: Blob, ext: string, dir: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const accessToken = setting.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}

			const xhr = new XMLHttpRequest();
			const path = `/${dir}/${new Date().getTime()}-${generateID(
				4
			)}.${ext}`
				.split("//")
				.join("/");

			xhr.onload = function() {
				if (xhr.status === 200) {
					return resolve(path);
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
					path,
					mode: "add",
					autorename: true,
					mute: false
				})
			);

			xhr.send(blob);
		});
	},

	async get(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const accessToken = setting.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = async function() {
				if (xhr.status === 200) {
					const splittedPath = path.split(".");
					const ext = splittedPath[splittedPath.length - 1];
					const base64 = await arrayBufferToBase64(xhr.response, ext);
					resolve(base64);
				} else {
					const errorMessage =
						xhr.response || "Unable to download file";
					return reject(errorMessage);
				}
			};

			xhr.open("POST", "https://content.dropboxapi.com/2/files/download");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader(
				"Dropbox-API-Arg",
				JSON.stringify({
					path: path.split("//").join("/")
				})
			);
			xhr.send();
		});
	},

	async remove(path: string) {
		return new Promise((resolve, reject) => {
			const accessToken = setting.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();

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

			xhr.send(JSON.stringify({ path: path.split("//").join("/") }));
		});
	},

	async status() {
		return new Promise((resolve, reject) => {
			const accessToken = setting.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();

			xhr.onload = function() {
				if (xhr.status === 200) {
					return resolve();
				} else {
					return reject(xhr.response || "Not valid");
				}
			};

			xhr.open(
				"POST",
				"https://api.dropboxapi.com/2/users/get_current_account"
			);
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);

			xhr.send();
		});
	},

	async list(path: string): Promise<DropboxFile[]> {
		return new Promise((resolve, reject) => {
			const accessToken = setting.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
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
					path: path.split("//").join("/"),
					recursive: false,
					include_media_info: false,
					include_deleted: false,
					include_has_explicit_shared_members: false
				})
			);
		});
	}
};
