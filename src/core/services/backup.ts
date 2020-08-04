import { BACKUPS_DIR, UploadedFile } from "@core";
import * as core from "@core";
import { saveAs } from "file-saver";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import {
	decode,
	encode,
	generateID,
	second,
	store,
	encrypt,
	decrypt,
	defaultSecret,
	day,
	username,
} from "@utils";
export const backupsExtension = "apx";
export interface DatabaseDump {
	dbName: string;
	data: any[];
}

export const backup = {
	toJSON: async function () {
		const PouchDB: PouchDB.Static = ((await import(
			"pouchdb-browser"
		)) as any).default;

		await core.dbAction("compact");

		const dumps: DatabaseDump[] = [];

		for (let index = 0; index < core.DBNames.length; index++) {
			const dbName = core.DBNames[index];
			const DB = core.localDBRefs[index];

			const data = (
				await DB.allDocs({
					include_docs: true,
				})
			).rows.map((entry) => {
				if (entry.doc) {
					delete entry.doc._rev;
				}
				let doc = entry.doc;
				doc = core.DTF.minify.do(doc, core.defaultsArr[index]);
				doc = core.DTF.compress.do(doc);
				doc = core.DTF.encrypt.do(doc, core.uniqueString());
				return doc;
			});
			dumps.push({ dbName, data });
		}
		return dumps;
	},

	toCompressed: async function () {
		const JSONDump = await backup.toJSON();
		const string = JSON.stringify(JSONDump);
		const compressed = "LZC/" + compressToUTF16(string);
		return compressed;
	},

	toBlob: async function () {
		const compressed = await backup.toCompressed();
		return new Blob(["apexo-backup:" + compressed], {
			type: "text/plain;charset=utf-8",
		});
	},

	toFilesServer: async function (): Promise<string> {
		const blob = await backup.toBlob();
		const path = await core.files().save({
			blob,
			ext: backupsExtension,
			dir: core.BACKUPS_DIR,
		});
		return path;
	},

	list: async function (): Promise<UploadedFile[]> {
		return await core.files().backups();
	},

	deleteFromFilesServer: async function (path: string) {
		return await core.files().remove(path);
	},
};

export const restore = {
	fromJSON: async function (json: DatabaseDump[]) {
		view.hideEverything();
		return new Promise(async () => {
			const PouchDB: PouchDB.Static = ((await import(
				"pouchdb-browser"
			)) as any).default;

			core.status.resetUser();

			for (let index = 0; index < json.length; index++) {
				const dump = json[index];
				view.msg(`starting: deleting all server/"${dump.dbName}"`);
				const dbName = dump.dbName;
				const remoteDatabase1 = new PouchDB(
					`${core.status.server}/${
						core.status.version === "supported"
							? `c_${username()}_${dbName}`
							: dbName
					}`,
					{
						fetch: (url, opts) => {
							return PouchDB.fetch(url, {
								...opts,
								credentials:
									core.status.version === "community"
										? "include"
										: "omit",
								headers: {
									Authorization: `Bearer ${store.get(
										"LSL_time"
									)}`,
									"Content-Type": "application/json",
								},
							});
						},
					}
				);
				await remoteDatabase1.destroy();
				view.msg(
					`finished: deleting all server/"${dump.dbName}"`,
					true
				);
				view.msg(`starting: uploading data to server/"${dump.dbName}"`);
				const remoteDatabase2 = new PouchDB(
					`${core.status.server}/${
						core.status.version === "supported"
							? `c_${username()}_${dbName}`
							: dbName
					}`,
					{
						fetch: (url, opts) => {
							return PouchDB.fetch(url, {
								...opts,
								credentials:
									core.status.version === "community"
										? "include"
										: "omit",
								headers: {
									Authorization: `Bearer ${store.get(
										"LSL_time"
									)}`,
									"Content-Type": "application/json",
								},
							});
						},
					}
				);
				core.documentTransformation(
					remoteDatabase2,
					core.uniqueString(),
					core.defaultsArr[index],
					true,
					core.status.version === "supported",
					core.status.version === "supported"
				);
				await remoteDatabase2.bulkDocs(dump.data);
				view.msg(
					`finished: uploading data to server/"${dump.dbName}"`,
					true
				);
			}

			view.msg(`finished: all data are now in the server`, true);
			view.msg(`starting: destroying local data`);
			await core.dbAction("destroy");
			view.msg(`finished: destroying local data`, true);
			view.msg(`starting: downloading remote data`);
			await core.dbAction("resync");
			view.msg(`finished: downloading remote data`, true);
			view.msg(`Everything is done, will reload in 5 seconds`, true);
			setTimeout(() => {
				location.reload();
			}, second * 5);
		});
	},

	fromBase64: async function (base64Data: string) {
		function decodeData(data: string) {
			if (data.startsWith("LZC/")) {
				return decompressFromUTF16(data.substr(4));
			} else {
				return decode(base64Data);
			}
		}
		return new Promise(async (resolve, reject) => {
			core.modals.newModal({
				text: core.text(
					"all unsaved data will be lost. all data will be removed and replaced by the backup file"
				).c,
				onConfirm: async () => {
					const json = JSON.parse(decodeData(base64Data));
					await restore.fromJSON(json);
					resolve();
				},
				onDismiss: () => {
					core.messages.newMessage({
						id: generateID(),
						text: core.text("restoration cancelled").c,
					});
					return reject();
				},
				showCancelButton: true,
				showConfirmButton: true,
				id: generateID(),
			});
		});
	},

	fromFile: async function (file: Blob) {
		return new Promise((resolve, reject) => {
			function terminate() {
				core.messages.newMessage({
					id: generateID(),
					text: core.text("invalid file").c,
				});
				return reject();
			}
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = async function () {
				const base64data = reader.result;
				if (typeof base64data === "string") {
					const fileData0 = base64data.split("base64,")[1];
					const fileData1 = decode(fileData0);
					let fileData2 = fileData1.split("apexo-backup:")[1];
					if (
						fileData1.startsWith(`data:image/apx;base64,`) &&
						!fileData2
					) {
						fileData2 = fileData1.split(
							"data:image/apx;base64,"
						)[1];
						fileData2 = decode(fileData2);
						fileData2 = fileData2.split("apexo-backup:")[1];
					}
					if (fileData2) {
						await restore.fromBase64(fileData2);
						resolve();
					} else {
						return terminate();
					}
				} else {
					return terminate();
				}
			};
		});
	},

	fromFilesServer: async function (filePath: string) {
		const base64File = (await core.files().get(filePath, true)).split(
			";base64,"
		)[1];
		const base64Data = decode(base64File).split("apexo-backup:")[1];
		this.fromBase64(base64Data);
	},
};

const view = {
	el: document.getElementById("root"),
	hideEverything: function () {
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
	msg: function (str: string, finish?: boolean) {
		this.el!.innerHTML = `${this.el!.innerHTML}<p class="${
			finish ? "finish" : "start"
		}">${str}</p>`;
		window.scrollTo(0, document.body.scrollHeight);
	},
};
