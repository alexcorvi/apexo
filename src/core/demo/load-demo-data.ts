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
import { restoreFromBase64 } from '../../assets/utils/backup';

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
		const url = './demo-data';
		Http.open('GET', url);
		Http.send();
		Http.onreadystatechange = function(e) {
			if (this.readyState === 4) {
				const demoData = Http.responseText;
				restoreFromBase64(demoData);

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
