import { data } from '../../modules';
import { AppointmentJSON, Appointment } from '../../modules/appointments/data';
import { DoctorJSON, Doctor } from '../../modules/doctors/data';
import { CaseJSON, OrthoCase } from '../../modules/orthodontic/data';
import { PatientJSON, Patient } from '../../modules/patients/data';
import { PrescriptionItemJSON, PrescriptionItem } from '../../modules/prescriptions/data';
import { SettingItemJSON, SettingsItem } from '../../modules/settings/data';
import { TreatmentJSON, Treatment } from '../../modules/treatments/data';
import { doctorsData } from '../../modules/doctors';
import { appointmentsData } from '../../modules/appointments';
import { patientsData } from '../../modules/patients';
import { orthoData } from '../../modules/orthodontic';
import { settingsData } from '../../modules/settings';
import { prescriptionsData } from '../../modules/prescriptions';
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
	return btoa(JSON.stringify(backup2JSON()));
}

export function restoreFromJSON(json: BackupJSON) {
	appointmentsData.appointments.list = [];
	doctorsData.doctors.list = [];
	orthoData.cases.list = [];
	patientsData.patients.list = [];
	prescriptionsData.prescriptions.list = [];
	settingsData.settings.list = [];
	treatmentsData.treatments.list = [];
	json.appointments.map((x) => new Appointment(x)).forEach((x) => appointmentsData.appointments.list.push(x));
	json.doctors.map((x) => new Doctor(x)).forEach((x) => doctorsData.doctors.list.push(x));
	json.ortho.map((x) => new OrthoCase(x)).forEach((x) => orthoData.cases.list.push(x));
	json.patients.map((x) => new Patient(x)).forEach((x) => patientsData.patients.list.push(x));
	json.prescriptions.map((x) => new PrescriptionItem(x)).forEach((x) => prescriptionsData.prescriptions.list.push(x));
	json.settings.map((x) => new SettingsItem(x)).forEach((x) => settingsData.settings.list.push(x));
	json.treatments.map((x) => new Treatment(x)).forEach((x) => treatmentsData.treatments.list.push(x));
}

export function restoreFromBase64(base64Data: string) {
	restoreFromJSON(JSON.parse(atob(base64Data)));
}
