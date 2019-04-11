import { SettingItemJSON } from "@modules";
import { observable } from "mobx";
export class SettingsItem {
	@observable _id: string = "";
	@observable val: string = "";
	toJSON(): SettingItemJSON {
		return {
			_id: this._id,
			val: this.val
		};
	}
	constructor(json?: SettingItemJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}
	fromJSON(json: SettingItemJSON) {
		this._id = json._id;
		this.val = json.val;
	}
}
