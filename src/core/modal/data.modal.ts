import { observable } from 'mobx';

class ModalData {
	@observable activeModals: { message: string; onConfirm: () => void; id: number }[] = [];
	newModal({ message, onConfirm }: { message: string; onConfirm: () => void }) {
		this.activeModals.push({ message, onConfirm, id: Math.random() });
	}
}

export const modals = new ModalData();
