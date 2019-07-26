import { childFromJSON } from "./model.child";
import { transform } from "./model.transformations";
import { generateID } from "@utils";
import { isArrayLike, observable, observe, toJS } from "mobx";
import { ObservableValue } from "mobx/lib/internal";

export class Model<Interface extends { _id: string }> {
	@observable _id: string = generateID();

	private singleValueToJSON(
		value: Function | Model<any> | ObservableValue<any>
	): any {
		// don't store functions
		if (typeof value === "function") {
			return;
		}

		// an object that has its own toJSON()
		if (value.toJSON) {
			return value.toJSON();
		}

		// an array, recursion
		if (isArrayLike(value)) {
			return toJS(value).map(subValue =>
				this.singleValueToJSON(subValue)
			);
		}

		// observable (other than array)
		if ((value as any).$mobx) {
			return toJS(value);
		}

		// plain value
		return value;
	}

	private fromSingleValue(value: any, key: string): any {
		// an array, recursion
		if (Array.isArray(value)) {
			return value.map(subValue => this.fromSingleValue(subValue, key));
		}

		// don't store functions
		if (typeof value === "function") {
			return;
		}

		// a child model
		const child = childFromJSON(value);
		if (child) {
			return child;
		}

		const transformationResult = transform({ value, key });
		if (transformationResult) {
			return transformationResult;
		}

		// string, number, boolean, undefined, null
		// or an object that doesn't satisfy the
		// if statements above
		return value;
	}

	toJSON(): Interface {
		const jsonDoc: any = {};
		Object.keys(this).forEach(key => {
			const value = (this as any)[key];
			const convertedValue = this.singleValueToJSON(value);
			// don't accept falsy value so we can always extend
			if (convertedValue) {
				jsonDoc[key] = convertedValue;
			}
		});
		return jsonDoc;
	}

	fromJSON(jsonDoc: Interface) {
		Object.keys(jsonDoc).forEach(key => {
			const value = (jsonDoc as any)[key];
			const convertedValue = this.fromSingleValue(value, key);
			// don't accept falsy value so we can always extend
			if (convertedValue) {
				(this as any)[key] = convertedValue;
			}
		});
	}

	delete() {
		// handling deletion will occur here
	}
	update() {
		// do something with this.toJSON
	}

	constructor(json: Interface) {
		observe(this, () => {
			// just handle update
		});
	}
}
