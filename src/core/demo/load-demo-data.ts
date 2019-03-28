import { staffData } from "../../modules/staff";
import { appointmentsData } from "../../modules/appointments";
import { restore } from "../../assets/utils/backup";
import { day } from "../../assets/utils/date";

function randomDate() {
	const now = new Date().getTime();
	const fifteenDays = day * 15;
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
		const url = "./demo.apx";
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = function(e) {
			if (this.readyState === 4) {
				const demoData = Http.responseText;
				restore.fromBase64(demoData.replace(/apexo-backup:/, ""), true);

				appointmentsData.appointments.list.forEach((appointment, i) => {
					appointmentsData.appointments.list[i].date = randomDate();
					appointmentsData.appointments.list[i].staffID = [
						staffData.staffMembers.list[randomUserIndex()]._id
					];
				});

				localStorage.setItem("user_id", "89ab37f032d6f1b11512");
				resolve();
			}
		};
	});
}
