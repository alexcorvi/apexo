import { SettingItemSchema } from "@modules";
import { observable } from "mobx";
import { Model, observeModel } from "pouchx";

@observeModel
export class SettingsItem extends Model<SettingItemSchema> {
	@observable _id: string = "";
	@observable val: string = "";
	toJSON(): SettingItemSchema {
		return {
			_id: this._id,
			val: this.val
		};
	}
	fromJSON(json: SettingItemSchema) {
		this._id = json._id;
		this.val = json.val;
		return this;
	}
}
