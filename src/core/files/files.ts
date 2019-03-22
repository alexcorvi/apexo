import pouchDB = require("pouchdb-browser");
const PouchDB: PouchDB.Static = (pouchDB as any).default;
import { API } from "../";
import { generateID } from "../../assets/utils/generate-id";
import { base64StringToBlob, blobToBase64String } from "blob-util";

export const files = {
	db() {
		return new PouchDB(`${API.login.server}/files`);
	},

	async save(fileB64: string) {
		const id = "image_id_" + generateID();
		return (await this.db().putAttachment(
			id,
			id + "_image",
			base64StringToBlob(fileB64),
			"image/png"
		)).id;
	},

	async get(id: string) {
		return await blobToBase64String((await this.db().getAttachment(
			id,
			id + "_image"
		)) as Blob);
	},

	async remove(id: string) {
		const doc = await this.db().get(id);
		const response = await this.db().remove(doc._id, doc._rev || "");
		return response;
	}
};
