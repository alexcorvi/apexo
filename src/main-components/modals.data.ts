import { generateID } from "@utils";
import { observable } from "mobx";

export interface ModalInterface {
	text: string;
	input?: boolean;
	onConfirm: (inputValue: string) => void;
	onDismiss?: () => void;
	id: string | number;
	showConfirmButton: boolean;
	showCancelButton: boolean;
}

export class Modals {
	@observable activeModals: ModalInterface[] = [];
	newModal(modal: ModalInterface) {
		modal.id = generateID();
		this.activeModals.push(modal);
	}

	deleteModal(index: number) {
		this.activeModals.splice(index, 1);
	}
}

export const modals = new Modals();
