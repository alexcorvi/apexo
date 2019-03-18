import { Message } from "./class.message";
import { observable } from "mobx";

class MessagesData {
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

const messages = new MessagesData();
export { messages };
export default messages;
