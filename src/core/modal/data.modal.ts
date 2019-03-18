import { observable } from "mobx";

interface ModalInterface {
	message: string;
	input?: boolean;
	onConfirm: (inputValue: string) => void;
	id: number;
	showConfirmButton: boolean;
	showCancelButton: boolean;
}

class ModalData {
	@observable activeModals: ModalInterface[] = [];
	newModal({
		message,
		onConfirm,
		input,
		showCancelButton,
		showConfirmButton
	}: ModalInterface) {
		this.activeModals.push({
			message,
			onConfirm,
			input,
			id: Math.random(),
			showCancelButton,
			showConfirmButton
		});
	}
}

export const modals = new ModalData();
