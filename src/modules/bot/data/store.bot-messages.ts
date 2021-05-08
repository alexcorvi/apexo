import { dbAction, modals, text } from "@core";
import { BotMessage, BotMessageSchema } from "@modules";
import * as modules from "@modules";
import { Store } from "pouchx";

export class BotMessages extends Store<BotMessageSchema, BotMessage> {
	async afterChange() {
		// resync on change
		dbAction("resync", modules.botNamespace);
	}

	remove(id: string) {
		const message = this.docs.find((x) => x._id === id);
		if (!message) {
			return;
		}
		if (message.confirmed) {
			return (message.hide = true);
		}
		this.delete(id);
	}

	deleteModal(id: string) {
		const message = this.docs.find((x) => x._id === id);
		if (!message) {
			return;
		}
		modals.newModal({
			text: `${text("message will be deleted")}`,
			onConfirm: () => {
				if (message.confirmed) {
					return (message.hide = true);
				}
				this.delete(id);
			},
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random(),
		});
	}
}

export let botMessages: null | BotMessages = null;

export const setBotMessages = (store: BotMessages) => (botMessages = store);
