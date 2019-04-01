import { Appointment } from "./../../modules/appointments/data/class.appointment";
import { Patient } from "./../../modules/patients/data/class.patient";
import { PrescriptionItem } from "./../../modules/prescriptions/data/class.prescription-item";
import { StaffMember } from "./../../modules/staff/data/class.member";
import { Treatment } from "./../../modules/treatments/data/class.treatment";
import { staffData } from "../../modules/staff";
import { appointmentsData } from "../../modules/appointments";
import { restore } from "../../assets/utils/backup";
import { day } from "../../assets/utils/date";
import { data } from "../../modules";
import { orthoData } from "../../modules/orthodontic";
import { patientsData } from "../../modules/patients";
import { prescriptionsData } from "../../modules/prescriptions";
import { treatmentsData } from "../../modules/treatments";
import { settingsData } from "../../modules/settings";
import { store } from "../login/store";
import { SettingsItem } from "../../modules/settings/data";
import { OrthoCase } from "../../modules/orthodontic/data";
import { Label, patients } from "../../modules/patients/data";
import { getRandomTagType } from "../../assets/components/label/label.component";
import { toJS } from "mobx";

function randomInRange(minimum: number, maximum: number) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function randomDate() {
	const now = new Date().getTime();
	const diff = day * 50;
	return randomInRange(now - diff, now + diff);
}

function randomFromArray<T>(array: T[], canBeUndefined: boolean): T {
	return array[randomInRange(0, array.length - 1)];
}

function randomUserIndex() {
	return Math.floor(Math.random() * 5);
}

function randomLabels(): Label[] {
	const labels = [
		"VIP",
		"comprehensive",
		"ideal",
		"friend",
		"colleague",
		"co-worker",
		"relative",
		"TM",
		"hesitant",
		"introvert",
		"cooperative",
		"family-plan",
		"religious",
		"frail",
		"old"
	];

	const label = randomFromArray(labels, true);
	const result: Label[] = [];
	if (label) {
		result.push({ text: label, type: getRandomTagType(label) });
	}
	return result;
}

function randomAddress() {
	const addresses = [
		"6031 Vest Dr, Dublin, VA, 24084",
		"19638 Deer Run Rd, Warrenton, MO, 63383",
		"380 32nd St NE, Paris, TX, 75460",
		"5118 W Scioto Dr, Fairfield, OH, 45014",
		"6250 Mirons 16.8 Ln, Rapid River, MI, 49878",
		"26933 State 3 Rte #3, Watertown, NY, 13601",
		"6031 Vest Dr, Dublin, VA, 24084",
		"19638 Deer Run Rd, Warrenton, MO, 63383",
		"380 32nd St NE, Paris, TX, 75460",
		"1244 W Lebanon St, Mount Airy, NC, 27030",
		"5118 W Scioto Dr, Fairfield, OH, 45014"
	];

	return randomFromArray(addresses, false);
}

function randomPhoneNumber() {
	const addresses = [
		"07874653871",
		"07387462516",
		"07839847564",
		"07184758493",
		"07878362531",
		"07654578123",
		"07809032513",
		"07800983726",
		"07829477772"
	];

	return randomFromArray(addresses, false);
}

function randomCondition() {
	const addresses = ["filled", "sound", "compromised", "endo", "missing"];
	return randomFromArray(addresses, false);
}

export function loadDemoData() {
	return new Promise((resolve, reject) => {
		const Http = new XMLHttpRequest();
		const url = "./demo.json";
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = function(e) {
			if (this.readyState === 4) {
				const demoData: typeof data = JSON.parse(Http.responseText);

				treatmentsData.treatments.list = demoData.treatmentsData.treatments.list.map(
					x => new Treatment(x)
				);
				settingsData.settings.list = demoData.settingsData.settings.list.map(
					x => new SettingsItem(x)
				);
				staffData.staffMembers.list = demoData.staffData.staffMembers.list.map(
					x => new StaffMember(x)
				);
				prescriptionsData.prescriptions.list = demoData.prescriptionsData.prescriptions.list.map(
					x => new PrescriptionItem(x as any)
				);
				patientsData.patients.list = demoData.patientsData.patients.list.map(
					x => new Patient(x as any)
				);
				orthoData.cases.list = demoData.orthoData.cases.list.map(
					x => new OrthoCase(x)
				);
				appointmentsData.appointments.list = demoData.appointmentsData.appointments.list.map(
					x => new Appointment(x)
				);

				patientsData.patients.list.forEach((patient, i) => {
					patientsData.patients.list[i].labels = randomLabels();
					patientsData.patients.list[i].address = randomAddress();
					patientsData.patients.list[i].phone = randomPhoneNumber();
					patientsData.patients.list[i].email =
						patientsData.patients.list[i].name
							.toLowerCase()
							.replace(/\W/g, "") + "@gmail.com";
					patientsData.patients.list[i].birthYear =
						Math.floor(Math.random() * 49) + 12;
					patientsData.patients.list[i].teeth.forEach((x, ti) => {
						if (Math.floor(Math.random() * 49) + 12 < 35) {
							patientsData.patients.list[i].teeth[
								ti
							].condition = randomCondition() as any;
						}
					});
				});

				staffData.staffMembers.list.forEach((staff, i) => {
					staffData.staffMembers.list[i].phone = randomPhoneNumber();
					staffData.staffMembers.list[i].email =
						staffData.staffMembers.list[i].name
							.toLowerCase()
							.replace(/\W/g, "") + "@gmail.com";
				});

				appointmentsData.appointments.list.forEach((appointment, i) => {
					appointmentsData.appointments.list[i].date = randomDate();
					appointmentsData.appointments.list[i].treatmentID =
						randomFromArray(
							treatmentsData.treatments.list.map(x => x._id),
							false
						) || treatmentsData.treatments.list[0]._id;

					appointmentsData.appointments.list[i].finalPrice =
						appointment.expenses + randomInRange(0, 30);

					if (randomInRange(0, 10) > 8) {
						appointmentsData.appointments.list[i].paidAmount =
							appointment.finalPrice + randomInRange(-10, 0);
					} else {
						appointmentsData.appointments.list[i].paidAmount =
							appointment.finalPrice;
					}

					appointmentsData.appointments.list[i].staffID = [
						randomFromArray(
							staffData.staffMembers.list
								.filter(x => x.operates)
								.map(x => x._id),
							false
						)
					];

					console.log(
						toJS(appointmentsData.appointments.list[i].staffID)
					);

					appointmentsData.appointments.list[i].isDone =
						appointment.date < new Date().getTime();
				});

				store.set("user_id", "89ab37f032d6f1b11512");
				resolve();
			}
		};
	});
}
