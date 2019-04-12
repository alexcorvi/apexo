import { files, modals, text } from "@core";
import { appointments, orthoCases, Patient } from "@modules";
import { observable } from "mobx";

class PatientsData {
	ignoreObserver: boolean = false;

	@observable list: Patient[] = [];

	findIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	private deleteByID(id: string) {
		const i = this.findIndexByID(id);
		// delete from list
		const patient = this.list.splice(i, 1)[0];

		// delete appointments
		patient.appointments.forEach(appointment => {
			appointments.deleteByID(appointment._id);
		});

		// delete photos
		patient.gallery.forEach(async fileID => {
			await files.remove(fileID);
		});

		// delete orthodontic case
		orthoCases.deleteByPatientID(patient._id);
	}

	deleteModal(id: string) {
		const i = this.findIndexByID(id);

		modals.newModal({
			message: `${text("All of the patient")} ${this.list[i].name}${text(
				"'s data will be deleted along with"
			)} ${this.list[i].appointments.length} ${text("of appointments")}.`,
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
}

export const patients = new PatientsData();
