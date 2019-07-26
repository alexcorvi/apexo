import { Model } from "./model";
import { observable, observe } from "mobx";
export class Store<
	Interface extends { _id: string },
	SpecificModel extends Model<Interface>
> {
	private ignoreObserver: boolean = false;

	model: SpecificModel;

	DBName: string;

	get localDBName() {
		return this.DBName;
	}

	get remoteDBName() {
		return this.DBName;
	}

	@observable list: SpecificModel[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		// show modal and then delete on confirm
	}

	deleteByID(id: string) {
		// actually delete
		if ((this as any).deleteAccessories) {
			(this as any).deleteAccessories();
		}
	}

	async init() {
		await this.grabFromLocal();
		observe(this.list, change => {
			// just handle addition
		});
		// syncInterval
	}
	async grabFromLocal() {}

	async sync() {}

	async hardReset() {}
	async compact() {}
	async destroy() {}

	constructor(DBName: string, model: SpecificModel) {
		this.DBName = DBName;
		this.model = model;
		this.init();
	}
}
