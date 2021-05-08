import { status } from "@core";
import * as core from "@core";
import { setting } from "@modules";
import { decrypt, encrypt, generateID, store } from "@utils";
import * as utils from "@utils";
import { del, get, keys, set } from "idb-keyval";

export interface UploadedFile {
	date: number;
	path: string;
	type: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise((resolve) => {
		reader.onloadend = () => {
			resolve(reader.result as string);
		};
	});
};

async function recordSupportedFile(path: string, dir: string) {
	const allFiles = await supportedFiles.allFiles();
	return new Promise((resolve, reject) => {
		allFiles.push({
			type: dir,
			path,
			date: new Date().getTime(),
		});
		const LSL_time = store.get("LSL_time");
		const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user.id;
		const data = JSON.stringify({
			meta: {
				apexofiles: encrypt(
					JSON.stringify(allFiles),
					core.uniqueString()
				),
			},
		});
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				if (this.status < 300 && this.status > 199) {
					resolve(true);
				} else {
					try {
						reject(JSON.parse(this.responseText).message);
					} catch (e) {
						reject("Error: Could not decode server response");
					}
				}
			}
		});
		xhr.open("POST", `https://apexo.app/wp-json/wp/v2/users/${userID}`);
		xhr.setRequestHeader("Authorization", `Bearer ${LSL_time}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);
	});
}

async function resetSupportedRecords() {
	return new Promise((resolve, reject) => {
		const LSL_time = store.get("LSL_time");
		const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user.id;
		const data = JSON.stringify({
			meta: {
				apexofiles: encrypt(JSON.stringify([]), core.uniqueString()),
			},
		});
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				if (this.status < 300 && this.status > 199) {
					resolve(true);
				} else {
					try {
						reject(JSON.parse(this.responseText).message);
					} catch (e) {
						reject("Error: Could not decode server response");
					}
				}
			}
		});
		xhr.open("POST", `https://apexo.app/wp-json/wp/v2/users/${userID}`);
		xhr.setRequestHeader("Authorization", `Bearer ${LSL_time}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);
	});
}

async function unRecordSupportedFile(path: string) {
	return new Promise(async (resolve, reject) => {
		const prevFiles = await supportedFiles.allFiles();
		const updatedFiles = prevFiles.filter((x) => x.path !== path);
		const LSL_time = store.get("LSL_time");
		const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user.id;
		const data = JSON.stringify({
			meta: {
				apexofiles: encrypt(
					JSON.stringify(updatedFiles),
					core.uniqueString()
				),
			},
		});
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				if (this.status < 300 && this.status > 199) {
					resolve(true);
				} else {
					try {
						reject(JSON.parse(this.responseText).message);
					} catch (e) {
						reject("Error: Could not decode server response");
					}
				}
			}
		});
		xhr.open("POST", `https://apexo.app/wp-json/wp/v2/users/${userID}`);
		xhr.setRequestHeader("Authorization", `Bearer ${LSL_time}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);
	});
}

interface FileService {
	save({
		blob,
		ext,
		dir,
	}: {
		blob: Blob;
		ext: string;
		dir: string;
	}): Promise<string>;
	get(path: string, download?: boolean): Promise<string>;
	remove(path: string): Promise<any>;
	status(): Promise<boolean>;
	backups(): Promise<UploadedFile[]>;
}

export const BACKUPS_DIR = "/backups";
export const GALLERIES_DIR = "/galleries";
export const ORTHO_RECORDS_DIR = "/ortho";

function padNumbers(input: number | string): string {
	input = input.toString();
	return input.length < 5 ? padNumbers("0" + input) : input;
}

function arrayBufferToBase64(
	buffer: ArrayBuffer,
	ext: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		const blob = new Blob([buffer], { type: `image/${ext}` });
		const reader = new FileReader();
		reader.onload = function (evt: any) {
			const dataURL: string = evt.target.result;
			resolve(dataURL);
		};
		reader.readAsDataURL(blob);
	});
}

const supportedFiles: FileService & {
	allFiles: () => Promise<UploadedFile[]>;
} = {
	async save({
		blob,
		ext,
		dir,
	}: {
		blob: Blob;
		ext: string;
		dir: string;
	}): Promise<string> {
		return new Promise((resolve, reject) => {
			const LSL_time = store.get("LSL_time");
			const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user
				.id;
			const paddedUserID = padNumbers(userID);
			const fileName = `${paddedUserID}-${generateID()}.${ext}`;
			const data = new FormData();
			data.append("file", blob, fileName);
			const xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", async function () {
				if (this.readyState === 4) {
					try {
						const res = JSON.parse(this.responseText);
						const link = res.id.toString();
						if (link) {
							if (dir === BACKUPS_DIR) {
								await recordSupportedFile(link, dir);
							}
							resolve(link);
						} else {
							reject(res.message);
						}
					} catch (e) {
						reject("Unable to decode server response");
					}
				}
			});
			xhr.open("POST", "https://apexo.app/wp-json/wp/v2/media");
			xhr.setRequestHeader("Authorization", `Bearer ${LSL_time}`);
			xhr.send(data);
		});
	},
	async get(path: string) {
		return `https://apexo.app/?attachment_id=${path}`;
	},
	async remove(path: string) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", async function () {
				if (this.readyState === 4) {
					await unRecordSupportedFile(path);
					resolve(true);
				}
			});
			xhr.open(
				"DELETE",
				`https://apexo.app/wp-json/wp/v2/media/${path}?force=true`
			);
			xhr.setRequestHeader(
				"Authorization",
				`Bearer ${store.get("LSL_time")}`
			);
			xhr.send();
		});
	},
	async status() {
		return status.isOnline.server;
	},
	async backups() {
		return (await supportedFiles.allFiles()).filter(
			(x) => x.type === BACKUPS_DIR
		);
	},
	async allFiles(): Promise<UploadedFile[]> {
		return new Promise((resolve, reject) => {
			const LSL_time = store.get("LSL_time");
			const userID = JSON.parse(atob(LSL_time.split(".")[1])).data.user
				.id;
			const xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", async function () {
				if (this.readyState === 4) {
					try {
						const data = JSON.parse(this.responseText);
						const filesString: string = data.meta.apexofiles;
						if (filesString.length > 0) {
							resolve(
								JSON.parse(
									decrypt(filesString, core.uniqueString())
								)
							);
						} else {
							resolve([]);
						}
					} catch (e) {
						utils.log("Could not read dir, resetting");
						await resetSupportedRecords();
						resolve(await supportedFiles.allFiles());
					}
				}
			});
			xhr.open("GET", `https://apexo.app/wp-json/wp/v2/users/${userID}`);
			xhr.setRequestHeader("Authorization", `Bearer ${LSL_time}`);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send();
		});
	},
};

const communityFiles: FileService = {
	async save({
		blob,
		ext,
		dir,
	}: {
		blob: Blob;
		ext: string;
		dir: string;
	}): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const accessToken = setting!.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}

			const xhr = new XMLHttpRequest();
			const path = `/${dir}/${new Date().getTime()}-${generateID(
				4
			)}.${ext}`
				.split("//")
				.join("/");

			xhr.onload = function () {
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
					mute: false,
				})
			);

			xhr.send(blob);
		});
	},

	async get(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			if (path.startsWith("https://")) {
				return resolve(path);
			}
			const accessToken = setting!.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = async function () {
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
					path: path.split("//").join("/"),
				})
			);
			xhr.send();
		});
	},

	async remove(path: string) {
		return new Promise((resolve, reject) => {
			const accessToken = setting!.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();

			xhr.onload = function () {
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

	async status(): Promise<boolean> {
		return new Promise((resolve) => {
			const accessToken = setting!.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return resolve(false);
			}
			const xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status > 199 && xhr.status < 300) {
						resolve(true);
					} else {
						resolve(false);
					}
				}
			};

			xhr.open(
				"POST",
				"https://api.dropboxapi.com/2/users/get_current_account"
			);
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			try {
				xhr.send(null);
			} catch (e) {
				resolve(false);
			}
		});
	},

	async backups(): Promise<UploadedFile[]> {
		return new Promise((resolve, reject) => {
			const accessToken = setting!.getSetting("dropbox_accessToken");
			if (!accessToken) {
				return reject("Did not find DropBox access token");
			}
			const xhr = new XMLHttpRequest();

			xhr.onload = function () {
				if (xhr.status === 200) {
					const entries: {
						name: string;
						path_lower: string;
						id: string;
						size: number;
						client_modified: string;
					}[] = JSON.parse(xhr.response).entries;
					return resolve(
						entries.map((x) => ({
							date: new Date(x.client_modified).getTime(),
							path: x.path_lower,
							type: BACKUPS_DIR,
						}))
					);
				} else {
					return reject(xhr.response || "Unable to upload file");
				}
			};

			xhr.open("POST", "https://api.dropboxapi.com/2/files/list_folder");
			xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(
				JSON.stringify({
					path: BACKUPS_DIR.split("//").join("/"),
					recursive: false,
					include_media_info: false,
					include_deleted: false,
					include_has_explicit_shared_members: false,
				})
			);
		});
	},
};

const offlineFiles: FileService = {
	async save({
		blob,
		ext,
		dir,
	}: {
		blob: Blob;
		ext: string;
		dir: string;
	}): Promise<string> {
		const name = `${new Date().getTime()}-${generateID(4)}.${ext}`;
		const path = `/${dir}/${name}`.split("//").join("/");
		const b64 = await blobToBase64(blob);
		const fileInfo: UploadedFile & { file: string } = {
			type: dir,
			path: path,
			date: new Date().getTime(),
			file: b64,
		};
		await set(path, JSON.stringify(fileInfo));
		return path;
	},

	async get(path: string): Promise<string> {
		return JSON.parse(await get(path)).file;
	},

	async remove(path: string) {
		return await del(path);
	},

	async status(): Promise<boolean> {
		return true;
	},

	async backups(): Promise<UploadedFile[]> {
		return (
			await Promise.all(
				(await keys())
					.filter((x) => x.toString().indexOf(BACKUPS_DIR) !== -1)
					.map((x) => get(x))
			)
		).map((x) => JSON.parse(x as any));
	},
};

export function files() {
	switch (status.version) {
		case "community":
			return communityFiles;
		case "offline":
			return offlineFiles;
		case "supported":
			return supportedFiles;
		default:
			return communityFiles;
	}
}
