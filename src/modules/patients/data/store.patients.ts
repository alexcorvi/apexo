import { dbAction, files, modals, text } from "@core";
import { appointments, orthoCases, Patient, PatientSchema } from "@modules";
import * as modules from "@modules";
import { observable } from "mobx";
import { Store } from "pouchx";

export class Patients extends Store<PatientSchema, Patient> {
	async afterDelete(patient: Patient) {
		// delete appointments
		for (let index = 0; index < patient.appointments.length; index++) {
			const appointment = patient.appointments[index];
			await appointments!.delete(appointment._id);
		}

		// delete photos
		for (let index = 0; index < patient.gallery.length; index++) {
			const fileID = patient.gallery[index];
			await files().remove(fileID);
		}

		// delete orthodontic case
		orthoCases!.deleteByPatientID(patient._id);
	}

	async afterChange() {
		// resync on change
		dbAction("resync", modules.patientsNamespace);
	}

	deleteModal(id: string) {
		const patient = this.docs.find((x) => x._id === id);
		if (!patient) {
			return;
		}
		modals.newModal({
			text: `${text("all of the patient")} ${patient.name}${text(
				"'s data will be deleted along with"
			)} ${patient.appointments.length} ${text("of appointments")}.`,
			onConfirm: () => this.delete(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random(),
		});
	}
}

export let patients: Patients | null = null;

export const setPatientsStore = (store: Patients) => (patients = store);
