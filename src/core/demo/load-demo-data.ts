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

function randomDate() {
	const now = new Date().getTime();
	const fifteenDays = 21600 * 60 * 1000;
	return Math.floor(Math.random() * (now + fifteenDays - (now - fifteenDays)) + (now - fifteenDays));
}

function randomDoctorIndex() {
	return Math.floor(Math.random() * 5);
}

export function loadDemoData() {
	return new Promise((resolve, reject) => {
		const Http = new XMLHttpRequest();
		const url = './demo-data.json';
		Http.open('GET', url);
		Http.send();
		Http.onreadystatechange = function(e) {
			if (this.readyState === 4) {
				const demoData: {
					appointments: AppointmentJSON[];
					doctors: DoctorJSON[];
					orthoCases: CaseJSON[];
					patients: PatientJSON[];
					prescriptions: PrescriptionItemJSON[];
					settings: SettingItemJSON[];
					treatments: TreatmentJSON[];
				} = JSON.parse(Http.responseText);

				appointmentsData.appointments.list = [];
				orthoData.cases.list = [];
				patientsData.patients.list = [];
				prescriptionsData.prescriptions.list = [];
				treatmentsData.treatments.list = [];
				doctorsData.doctors.list = [];
				settingsData.settings.list = [];

				settingsData.settings.list = demoData.settings.map((item) => new SettingsItem(item));
				doctorsData.doctors.list = demoData.doctors.map((item) => new Doctor(item));
				treatmentsData.treatments.list = demoData.treatments.map((item) => new Treatment(item));
				prescriptionsData.prescriptions.list = demoData.prescriptions.map((item) => new PrescriptionItem(item));
				patientsData.patients.list = demoData.patients.map((item) => new Patient(item));
				orthoData.cases.list = demoData.orthoCases.map((item) => new OrthoCase(item));
				appointmentsData.appointments.list = demoData.appointments.map((item) => new Appointment(item));

				appointmentsData.appointments.list.forEach((appointment, i) => {
					appointmentsData.appointments.list[i].date = randomDate();
					appointmentsData.appointments.list[i].doctorsID = [
						doctorsData.doctors.list[randomDoctorIndex()]._id
					];
				});

				localStorage.setItem('doctor_id', '89ab37f032d6f1b11512');

				resolve();
			}
		};
	});
}
