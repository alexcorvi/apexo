import { methods } from "../db/index";
import * as core from "@core";
import { genLocalInstance, genRemoteInstance, UploadedFile } from "@core";
import { decode, generateID, store } from "@utils";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
export const backupsExtension = "apx";
export interface DatabaseDump {
	dbName: string;
	data: any[];
}

async function touchDB(location: string) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				resolve();
			}
		});
		xhr.open("PUT", location);
		xhr.setRequestHeader(
			"Authorization",
			`Bearer ${store.get("LSL_time")}`
		);
		xhr.send();
	});
}

export const backup = {
	toJSON: async function () {
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
				if (core.status.version === "supported") {
					doc = core.DTF.compress.do(doc);
					doc = core.DTF.encrypt.do(doc, core.uniqueString());
					// saving an encrypted version of the document
					// however, when uploading, it will not be
					// encrypted again, as the encryption/compression
					// functions checks that
				}
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
		methods.resync = []; // don't do any resyncing while restoring
		return new Promise(async () => {
			core.status.resetUser();

			const uploadingTasks: Array<() => Promise<any>> = [];
			const destroyingRemoteTasks: typeof uploadingTasks = [];
			const replicationTasks: typeof uploadingTasks = [];
			const destroyingTempTasks: typeof uploadingTasks = [];
			const downloadingTasks: typeof uploadingTasks = [];

			const tempStr = `__tmp${Math.random()
				.toString(36)
				.replace(/\W/g, "")}`;

			for (let index = 0; index < json.length; index++) {
				const dump = json[index];
				const dbName = dump.dbName;
				const db = await genRemoteInstance(dbName);
				const dbTemp = await genRemoteInstance(`${dbName}${tempStr}`);

				uploadingTasks.push(async () => {
					await touchDB(dbTemp.name);
					await dbTemp.bulkDocs(dump.data);
					view.progressBlock();
					return;
				});
				destroyingRemoteTasks.push(async () => {
					await db.destroy();
					view.progressBlock();
					return;
				});
				replicationTasks.push(async () => {
					await touchDB(db.name);
					await dbTemp.replicate.to(await genRemoteInstance(dbName));
					view.progressBlock();
					return;
				});
				destroyingTempTasks.push(async () => {
					await dbTemp.destroy();
					view.progressBlock();
					return;
				});
				downloadingTasks.push(async () => {
					await (await genLocalInstance(dbName)).replicate.from(
						await genRemoteInstance(dbName)
					);
					view.progressBlock();
					return;
				});
			}

			view.setBlocksWidth(
				uploadingTasks.length +
					destroyingRemoteTasks.length +
					replicationTasks.length +
					destroyingTempTasks.length +
					downloadingTasks.length
			);
			view.msg("Starting: uploading new data");
			await Promise.all(uploadingTasks.map((x) => x()));
			view.msg("Finished: uploading new data", true);
			view.msg("Starting: destroying local old data");
			await core.dbAction("destroy");
			view.msg("Finished: destroying local old data", true);
			view.msg("Starting: destroying remote old data");
			await Promise.all(destroyingRemoteTasks.map((x) => x()));
			view.msg("Finished: destroying remote old data", true);
			view.msg("Starting: renaming databases");
			await Promise.all(replicationTasks.map((x) => x()));
			view.msg("Finished: renaming databases", true);
			view.msg("Starting: destroying temporary data");
			await Promise.all(destroyingTempTasks.map((x) => x()));
			view.msg("Finished: destroying temporary data", true);
			view.msg("Starting: downloading new data");
			await Promise.all(downloadingTasks.map((x) => x()));
			view.msg("Finished: downloading new data", true);
			view.msg("All done! you can reload the application now", true);
			view.done();
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
		a {
			display: block;
			width: 150px;
			background: #3F51B5 !important;
			padding: 20px;
			text-align: center;
			margin: 0 auto;
			color: #fff;
			cursor: pointer;
			border-radius: 5px;
			font-size: 20px;
			border: 1px solid #1A237E;
			text-transform: uppercase;
			text-decoration: none;		
		}
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
		  #loading-block {
			border: 1px solid #004D40;
			height: 32px;
		}
		#loading-block div {
			height: 30px;
			background: #009688;
			float: left;
		}
		  </style>
		<h1>Restore</h1>
		<h2>Please do not close this window, it will automatically reload when done</h2>
		<div id="loading-block"></div>
		<hr>
	`;
	},
	msg: function (str: string, finish?: boolean) {
		this.el!.innerHTML = `${this.el!.innerHTML}<p class="${
			finish ? "finish" : "start"
		}">${str}</p>`;
		window.scrollTo(0, document.body.scrollHeight);
	},
	progressBlock: function () {
		document.getElementById("loading-block")!.innerHTML =
			document.getElementById("loading-block")!.innerHTML + "<div></div>";
	},
	setBlocksWidth: function (num: number) {
		this.el!.innerHTML =
			`<style>#loading-block div {width: ${100 / num}%}</style>` +
			this.el!.innerHTML;
	},
	done: function () {
		this.el!.innerHTML = `${
			this.el!.innerHTML
		}<a onclick="location.reload()">RELOAD</a>`;
	},
};
