import { generateID } from "../../assets/utils/generate-id";
import { observable } from "mobx";

export class Message {
	id: string = generateID();

	@observable string: string = "";
	expiresIn: number = 10000;

	onExpire: () => void = () => {};

	constructor(string: string) {
		this.string = string;
	}
}
