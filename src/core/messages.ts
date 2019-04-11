import { generateID } from "@utils";
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

class Messages {
	@observable messages: Message[] = [];

	public addMessage(msg: Message) {
		this.messages.push(msg);
		setTimeout(() => {
			if (this.removeMsgByID(msg.id)) {
				msg.onExpire();
			}
		}, msg.expiresIn);
	}

	public removeMsgByID(id: string): boolean {
		const i = this.messages.findIndex(x => x.id === id);
		if (i === -1) {
			return false;
		} else {
			this.messages.splice(i, 1);
			return true;
		}
	}
}

const messages = new Messages();
export { messages };
