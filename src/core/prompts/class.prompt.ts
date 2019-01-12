import { generateID } from "../../assets/utils/generate-id";
import { observable } from "mobx";

export class Prompt {
	id: string = generateID();

	@observable message: string = "";

	@observable buttons: {
		iconName?: string;
		title: string;
		onClick: () => void;
	}[] = [];

	iconName: string = "";

	expiresIn: number = 10000;

	onExpire: () => void = () => {};
}
