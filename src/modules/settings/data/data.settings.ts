import { observable } from 'mobx';
import { SettingsItem } from './class.setting';
import { generateID } from '../../../assets/utils/generate-id';
import * as settings from './index';

class Settings {
	ignoreObserver: boolean = false;
	@observable list: SettingsItem[] = [];

	getSetting(id: keyof typeof settings.dictionary): string {
		return (this.list.find((x) => x._id.endsWith(id)) || { val: '' }).val;
	}

	setSetting(id: keyof typeof settings.dictionary, val: string) {
		const i = this.list.findIndex((x) => x._id.endsWith(id));
		if (i === -1) {
			// add
			this.list.push(new SettingsItem({ _id: generateID(20, id), val }));
		} else {
			// update
			this.list[i].val = val;
		}
	}
}

const setting = new Settings();
export default setting;
