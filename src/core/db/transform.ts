import * as utils from "@utils";

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

export function documentTransformation(
	db: PouchDB.Database,
	unique: string,
	defaults: any,
	doMinify: boolean = true
) {
	if (doMinify) {
		minifyDatabase(db, defaults);
	}
}
