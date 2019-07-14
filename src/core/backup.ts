import {
	BACKUPS_DIR,
	compact,
	DBsList,
	destroyLocal,
	files,
	messages,
	modals,
	resync,
	status,
	text
	} from "./";
import { decode, encode, generateID, second } from "@utils";
import { saveAs } from "file-saver";
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
			const PouchDB: PouchDB.Static = ((await import(
				"pouchdb-browser"
			)) as any).default;

			await compact.compact();

			const dumps: DatabaseDump[] = [];

			let done = 0;

			DBsList.forEach(async dbName => {
				const remoteDatabase = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
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
				if (done === DBsList.length) {
					clearInterval(checkInterval);
					resolve(dumps);
				}
			}, second / 2);
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
		const path = await files.save({ blob, ext, dir: BACKUPS_DIR });
		return path;
	},

	list: async function() {
		return await files.list(BACKUPS_DIR);
	},

	deleteFromDropbox: async function(path: string) {
		return await files.remove(path);
	}
};

export const restore = {
	fromJSON: async function(json: DatabaseDump[]) {
		view.hideEverything();
		return new Promise(async (resolve, reject) => {
			const PouchDB: PouchDB.Static = ((await import(
				"pouchdb-browser"
			)) as any).default;

			status.resetUser();
			let done = 0;

			json.forEach(async dump => {
				view.msg(`starting: deleting all server/"${dump.dbName}"`);
				const dbName = dump.dbName;
				const remoteDatabase1 = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
					}
				);
				await remoteDatabase1.destroy();
				view.msg(
					`finished: deleting all server/"${dump.dbName}"`,
					true
				);
				view.msg(`starting: uploading data to server/"${dump.dbName}"`);
				const remoteDatabase2 = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
					}
				);
				const a = await remoteDatabase2.bulkDocs(dump.data);
				view.msg(
					`finished: uploading data to server/"${dump.dbName}"`,
					true
				);
				done++;
			});

			const checkInterval = setInterval(async () => {
				if (done === json.length) {
					clearInterval(checkInterval);
					view.msg(`finished: all data are now in the server`, true);
					view.msg(`starting: destroying local data`);
					await destroyLocal.destroy();
					view.msg(`finished: destroying local data`, true);
					view.msg(`starting: downloading remote data`);
					await resync.resync();
					view.msg(`finished: downloading remote data`, true);
					view.msg(
						`Everything is done, will reload in 5 seconds`,
						true
					);
					setTimeout(() => {
						location.reload();
					}, second * 5);
				}
			}, second / 100);
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
					text: text(
						`All unsaved data will be lost. All data will be removed and replaced by the backup file. Type "yes" to confirm`
					),
					onConfirm: async (input: string) => {
						if (input.toLowerCase() === "yes") {
							const json = JSON.parse(decode(base64Data));
							await restore.fromJSON(json);
							resolve();
						} else {
							messages.newMessage({
								id: generateID(),
								text: text("Restoration cancelled")
							});
							return reject();
						}
					},
					input: true,
					showCancelButton: false,
					showConfirmButton: true,
					id: generateID()
				});
			}
		});
	},

	fromFile: async function(file: Blob) {
		return new Promise((resolve, reject) => {
			function terminate() {
				messages.newMessage({
					id: generateID(),
					text: text("Invalid file")
				});
				return reject();
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

export async function downloadCurrentStateAsBackup() {
	const blob = await backup.toBlob();
	return new Promise(resolve => {
		modals.newModal({
			id: generateID(),
			text: text("Please enter file name"),
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

const view = {
	el: document.getElementById("root"),
	hideEverything: function() {
		this.el!.innerHTML = `
		<style>
		#root {
			background: #f4f4f4;
			padding: 30px;
			font-family: monospace;
		  }
		  
		  h2 {
			font-style: italic;
		  }
		  
		  p {
			background: #e3e3e3;
			padding: 5px;
			border-left: 10px solid #aaaa;
		  }
		  p.start {
			  border-left-color: #3f51b5
		  }
		  p.finish {
			  border-left-color: #009688
		  }
		  </style>
		<h1>Restore</h1>
		<h2>Please do not close this window, it will automatically reload when done</h2>
		<hr>
	`;
	},
	msg: function(str: string, finish?: boolean) {
		this.el!.innerHTML = `${this.el!.innerHTML}<p class="${
			finish ? "finish" : "start"
		}">${str}</p>`;
		window.scrollTo(0, document.body.scrollHeight);
	}
};
