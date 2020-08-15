import { dbAction, modals, text } from "@core";
import { BotMessage, BotMessageSchema } from "@modules";
import * as modules from "@modules";
import { Store } from "pouchx";

export class BotMessages extends Store<BotMessageSchema, BotMessage> {
	async afterChange() {
		// resync on change
		dbAction("resync", modules.labworkNamespace);
	}

	deleteModal(id: string) {
		const labwork = this.docs.find((x) => x._id === id);
		if (!labwork) {
			return;
		}
		modals.newModal({
			text: `${text("message").c} ${text("will be deleted")}`,
			onConfirm: () => {
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
