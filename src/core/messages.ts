import { generateID, second } from "@utils";
import { observable } from "mobx";

export interface MessageInterface {
	id: string;

	text: string;
	expiresIn?: number;

	onExpire?: () => void;
}

class Messages {
	@observable activeMessages: MessageInterface[] = [];
	public newMessage(msg: MessageInterface) {
		this.activeMessages.push(msg);
		setTimeout(() => {
			if (this.removeMsgByID(msg.id)) {
				(msg.onExpire || (() => {}))();
			}
		}, msg.expiresIn || 10 * second);
	}

	public removeMsgByID(id: string): boolean {
		const i = this.activeMessages.findIndex(x => x.id === id);
		if (i === -1) {
			return false;
		} else {
			this.activeMessages.splice(i, 1);
			return true;
		}
	}
}

const messages = new Messages();
export { messages };
