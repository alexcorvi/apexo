import * as utils from "@utils";
import { compress, decompress } from "lz-string";
import { decrypt, encrypt } from "sjcl";

export const DTF = {
	minify: {
		do(doc: any, defaultsObject: any) {
			// document already transformed
			if (doc.lz || doc.spl) {
				return doc;
			}
			// minify
			Object.keys(doc).forEach((key) => {
				if (
					!key.startsWith("_") &&
					JSON.stringify(doc[key]) ===
						JSON.stringify(defaultsObject[key])
				) {
					delete doc[key];
				}
				if (
					key.toLowerCase().endsWith("date") &&
					typeof doc[key] === "number" &&
					doc[key] > 1400000000000
				) {
					doc[key] = Math.round(doc[key] / utils.minute);
				}
			});
			return doc;
		},
		un(doc: any, defaultsObject: any) {
			Object.keys(defaultsObject).forEach((key) => {
				if (
					doc[key] === undefined &&
					doc[key] !== defaultsObject[key]
				) {
					doc[key] = defaultsObject[key];
				}
				if (
					key.toLowerCase().endsWith("date") &&
					typeof doc[key] === "number" &&
					doc[key] < 1400000000000
				) {
					doc[key] = doc[key] * utils.minute;
				}
			});
			return doc;
		},
	},
	compress: {
		do: function (doc: any) {
			// document already transformed
			if (doc.lz || doc.spl) {
				return doc;
			}
			const compressedDoc: any = {};
			Object.keys(doc).forEach((key) => {
				if (
					key.startsWith("_") ||
					key.endsWith("date") ||
					key === "confirmationMessage"
				) {
					compressedDoc[key] = JSON.parse(
						JSON.stringify((doc as any)[key])
					);
					delete (doc as any)[key];
				}
			});
			compressedDoc.lz = compress(JSON.stringify(doc));
			return compressedDoc;
		},
		un: function (compressedDoc: any) {
			if (!compressedDoc.lz) {
				// it is not compressed
				return compressedDoc;
			}
			const doc = Object.assign(
				JSON.parse(decompress(compressedDoc.lz)),
				compressedDoc
			);
			delete doc.lz;
			return doc;
		},
	},
	encrypt: {
		do: function (doc: any, uniqueStr: string) {
			// document already transformed
			if (doc.spl) {
				return doc;
			}
			const encryptedDoc: any = {};
			Object.keys(doc).forEach((key) => {
				if (
					key.startsWith("_") ||
					key.endsWith("date") ||
					key === "confirmationMessage"
				) {
					encryptedDoc[key] = JSON.parse(
						JSON.stringify((doc as any)[key])
					);
					delete (doc as any)[key];
				}
			});
			encryptedDoc.spl = encrypt(uniqueStr, JSON.stringify(doc));
			return encryptedDoc;
		},
		un: function (encryptedDoc: any, uniqueStr: string) {
			if (!encryptedDoc.spl) {
				// it is not encrypted
				return encryptedDoc;
			}
			const doc = Object.assign(
				JSON.parse(decrypt(uniqueStr, encryptedDoc.spl)),
				encryptedDoc
			);
			delete doc.spl;
			return doc;
		},
	},
};

function minifyDatabase(database: PouchDB.Database, defaultsObject: any) {
	database.transform<any, any>({
		incoming(doc) {
			return DTF.minify.do(doc, defaultsObject);
		},
		outgoing(doc) {
			return DTF.minify.un(doc, defaultsObject);
		},
	});
}
function compressDatabase(database: PouchDB.Database) {
	database.transform<
		PouchDB.Meta,
		PouchDB.Meta & {
			lz: string | undefined;
		}
	>({
		incoming(doc) {
			return DTF.compress.do(doc);
		},
		outgoing(compressedDoc) {
			return DTF.compress.un(compressedDoc);
		},
	});
}
function encryptDatabase(database: PouchDB.Database, uniqueStr: string) {
	database.transform<
		PouchDB.Meta,
		PouchDB.Meta & {
			spl: string | undefined;
		}
	>({
		incoming(doc) {
			return DTF.encrypt.do(doc, uniqueStr);
		},
		outgoing(encryptedDoc) {
			return DTF.encrypt.un(encryptedDoc, uniqueStr);
		},
	});
}

export function documentTransformation(
	db: PouchDB.Database,
	unique: string,
	defaults: any,
	doMinify: boolean = true,
	doCompress: boolean = true,
	doEncrypt: boolean = true
) {
	if (doMinify) {
		minifyDatabase(db, defaults);
	}
	if (doCompress) {
		compressDatabase(db);
	}
	if (doEncrypt) {
		encryptDatabase(db, unique);
	}
}
