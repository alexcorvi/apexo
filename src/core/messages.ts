import { generateID, second } from "@utils";
import { observable } from "mobx";

export interface MessageInterface {
	id: string;

	text: string;
	expiresIn?: number;

	onExpire?: () => void;
}

class Messages {
	@observable list: MessageInterface[] = [];
	public newMessage(msg: MessageInterface) {
		this.list.push(msg);
		setTimeout(() => {
			if (this.removeMsgByID(msg.id)) {
				(msg.onExpire || (() => {}))();
			}
		}, msg.expiresIn || 10 * second);
	}

	public removeMsgByID(id: string): boolean {
		const i = this.list.findIndex(x => x.id === id);
		if (i === -1) {
			return false;
		} else {
			this.list.splice(i, 1);
			return true;
		}
	}
}

const messages = new Messages();
export { messages };
