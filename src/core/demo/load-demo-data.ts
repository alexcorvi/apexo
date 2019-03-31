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

function randomDate() {
	const now = new Date().getTime();
	const fifteenDays = day * 30;
	return Math.floor(
		Math.random() * (now + fifteenDays - (now - fifteenDays)) +
			(now - fifteenDays)
	);
}

function randomUserIndex() {
	return Math.floor(Math.random() * 5);
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

				treatmentsData.treatments.list =
					demoData.treatmentsData.treatments.list;
				settingsData.settings.list =
					demoData.settingsData.settings.list;
				staffData.staffMembers.list =
					demoData.staffData.staffMembers.list;
				prescriptionsData.prescriptions.list =
					demoData.prescriptionsData.prescriptions.list;
				patientsData.patients.list =
					demoData.patientsData.patients.list;
				orthoData.cases.list = demoData.orthoData.cases.list;
				appointmentsData.appointments.list =
					demoData.appointmentsData.appointments.list;

				/*
				appointmentsData.appointments.list.forEach((appointment, i) => {
					appointmentsData.appointments.list[i].date = randomDate();
					appointmentsData.appointments.list[i].staffID = [
						staffData.staffMembers.list[randomUserIndex()]._id
					];
				});
				*/

				store.set("user_id", "89ab37f032d6f1b11512");
				resolve();
			}
		};
	});
}
