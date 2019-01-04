import { API } from '../../core';
import { Appointment, AppointmentJSON } from '../../modules/appointments/data';
import { appointmentsData } from '../../modules/appointments';
import { CaseJSON, OrthoCase } from '../../modules/orthodontic/data';
import { decode, encode } from './base64';
import { Doctor, DoctorJSON } from '../../modules/doctors/data';
import { doctorsData } from '../../modules/doctors';
import { orthoData } from '../../modules/orthodontic';
import { Patient, PatientJSON } from '../../modules/patients/data';
import { patientsData } from '../../modules/patients';
import { PrescriptionItem, PrescriptionItemJSON } from '../../modules/prescriptions/data';
import { prescriptionsData } from '../../modules/prescriptions';
import { resync } from '../../core/db';
import { saveAs } from 'file-saver';
import { SettingItemJSON, SettingsItem } from '../../modules/settings/data';
import { settingsData } from '../../modules/settings';
import { Treatment, TreatmentJSON } from '../../modules/treatments/data';
import { treatmentsData } from '../../modules/treatments';

interface BackupJSON {
	appointments: AppointmentJSON[];
	doctors: DoctorJSON[];
	ortho: CaseJSON[];
	patients: PatientJSON[];
	prescriptions: PrescriptionItemJSON[];
	settings: SettingItemJSON[];
	treatments: TreatmentJSON[];
}

export function backup2JSON(): BackupJSON {
	const appointments = appointmentsData.appointments.list.map((x) => x.toJSON());
	const doctors = doctorsData.doctors.list.map((x) => x.toJSON());
	const ortho = orthoData.cases.list.map((x) => x.toJSON());
	const patients = patientsData.patients.list.map((x) => x.toJSON());
	const prescriptions = prescriptionsData.prescriptions.list.map((x) => x.toJSON());
	const settings = settingsData.settings.list.map((x) => x.toJSON());
	const treatments = treatmentsData.treatments.list.map((x) => x.toJSON());

	return { appointments, doctors, ortho, patients, prescriptions, settings, treatments };
}

export function backup2Base64() {
	return encode(JSON.stringify(backup2JSON()));
}

export function restoreFromJSON(json: BackupJSON) {
	appointmentsData.appointments.list = [];
	doctorsData.doctors.list = [];
	orthoData.cases.list = [];
	patientsData.patients.list = [];
	prescriptionsData.prescriptions.list = [];
	settingsData.settings.list = [];
	treatmentsData.treatments.list = [];
	json.appointments.forEach((item) => {
		appointmentsData.appointments.list.push(new Appointment(item));
	});
	json.doctors.forEach((item) => {
		doctorsData.doctors.list.push(new Doctor(item));
	});
	json.ortho.forEach((item) => {
		orthoData.cases.list.push(new OrthoCase(item));
	});
	json.patients.forEach((item) => {
		patientsData.patients.list.push(new Patient(item));
	});
	json.prescriptions.forEach((item) => {
		prescriptionsData.prescriptions.list.push(new PrescriptionItem(item));
	});
	json.settings.forEach((item) => {
		settingsData.settings.list.push(new SettingsItem(item));
	});
	json.treatments.forEach((item) => {
		treatmentsData.treatments.list.push(new Treatment(item));
	});
}

export async function restoreFromBase64(base64Data: string) {
	restoreFromJSON(JSON.parse(decode(base64Data)));
	API.router.reSyncing = true;
	await resync.resync();
	API.router.reSyncing = false;
}

export function saveToFile() {
	const blob = new Blob([ 'apexo-backup:' + backup2Base64() ], { type: 'text/plain;charset=utf-8' });
	const fileName = prompt('File name:');
	saveAs(blob, `${fileName || 'apexo-backup'}.apx`);
}

export async function restoreFromFile(file: string) {
	const confirmation = prompt(`All unsaved data will be lost.
All data will be removed and replaced by the backup file.
Type "yes" to confirm`);

	if (confirmation && confirmation.toLowerCase() === 'yes') {
		const fileData = atob(file.split('base64,')[1]).split('apexo-backup:')[1];
		if (fileData) {
			restoreFromBase64(fileData);
		} else {
			alert('Invalid file');
		}
	} else {
		alert('Backup canceled');
	}
}
