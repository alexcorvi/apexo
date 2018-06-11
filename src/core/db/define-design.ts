import { DocumentDesign } from './interface.document-design';
import PouchDB from 'pouchdb-browser';
import { API } from '../';
export async function defineDesign(database: PouchDB.Database<any>, design: DocumentDesign, update: boolean) {
	return new Promise((resolve, reject) => {
		database
			.get('_design/design')
			.then((x) => {
				if (update) {
					design._rev = x._rev;
					database.put(design).then(() => resolve());
				} else {
					resolve();
				}
			})
			.catch(() => {
				// can't be found
				database.put(design).then(() => resolve()).catch(async (x) => {
					API.report({
						domain: `defining a new design for ${(await database.info()).db_name}`,
						error: x
					});
				});
			});
	});
}
