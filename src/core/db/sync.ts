import { API } from '../';
import Pouchdb from 'pouchdb-browser';
import { log } from './log';
export async function keepInSync(name: string, db1: PouchDB.Database<any>, db2: PouchDB.Database<any>) {
	return await db1.sync(db2, {
		filter: 'design/clinic',
		query_params: {
			clinicID: API.login.clinicID
		}
	});
}
