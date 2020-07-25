import { getRandomTagType } from "@common-components";
import { Label } from "@modules";
import * as modules from "@modules";
import { day, hour, minute } from "@utils";
import { config, Store } from "pouchx";

function randomInRange(minimum: number, maximum: number) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function randomDate() {
	const now = new Date().getTime();
	const diff = day * 90;
	return randomInRange(now - diff, now + diff);
}

function randomFromArray<T>(array: T[]): T {
	return array[randomInRange(0, array.length - 1)];
}

function randomImage() {
	const images: (string | undefined)[] = [
		"https://i.imgur.com/T00fhYj.jpg",
		"https://i.imgur.com/a2awzVm.jpg",
		"https://i.imgur.com/h2E4WGw.jpg",
		"https://i.imgur.com/KS7Q2TL.jpg",
		"https://i.imgur.com/kJCWUAo.jpg",
		"https://i.imgur.com/R4dl8Rb.jpg",
		"https://i.imgur.com/vKBxTj7.jpg",
		"https://i.imgur.com/gmKrdo1.jpg",
		"https://i.imgur.com/ZI45jIW.jpg",
		"https://i.imgur.com/U0ND4TC.jpg",
		"https://i.imgur.com/sgeHfTT.jpg",
		"https://i.imgur.com/ztMTpBt.jpg",
		"https://i.imgur.com/tl4edXX.jpg",
		"https://i.imgur.com/2OhUYPt.jpg",
		"https://i.imgur.com/Nf4Qwa7.jpg",
		"https://i.imgur.com/bCyHQXp.jpg",
		"https://i.imgur.com/CdD60W6.jpg",
		"https://i.imgur.com/GLwgYL4.jpg",
		"https://i.imgur.com/JvJIb5N.jpg",
		"https://i.imgur.com/M3ZpYJG.jpg",
		"https://i.imgur.com/kcPMLNS.jpg",
		"https://i.imgur.com/6ZhaVrf.jpg",
		"https://i.imgur.com/7zouSDh.jpg",
		"https://i.imgur.com/fDcmQ1T.jpg",
		"https://i.imgur.com/0Hk1Uye.jpg",
		"https://i.imgur.com/RPAvHAM.jpg",
		"https://i.imgur.com/SSWYAW4.jpg",
		"https://i.imgur.com/dSJvdtu.jpg",
		"https://i.imgur.com/mY3XJj9.jpg",
		"https://i.imgur.com/cxhgJKM.jpg",
		"https://i.imgur.com/n4PL5Ns.jpg",
		"https://i.imgur.com/3mQmKEb.jpg",
		"https://i.imgur.com/p4RS9FZ.jpg",
		"https://i.imgur.com/0btrAQ5.jpg",
		"https://i.imgur.com/qF2JiTo.jpg",
		"https://i.imgur.com/uSX3p1X.jpg",
		"https://i.imgur.com/md9zmX4.jpg",
		"https://i.imgur.com/adShZOw.jpg",
		"https://i.imgur.com/h78QOSF.jpg",
		"https://i.imgur.com/MyFbXA0.jpg",
		"https://i.imgur.com/uVFTEpE.jpg",
		"https://i.imgur.com/Aa2cYGQ.jpg",
		"https://i.imgur.com/iCwSdrD.jpg",
		"https://i.imgur.com/hy9zI6U.jpg",
		"https://i.imgur.com/Mf09cmz.jpg",
		"https://i.imgur.com/ee89Mrg.jpg",
		"https://i.imgur.com/oVLVl5Z.jpg",
		"https://i.imgur.com/bY4PVFP.jpg",
		"https://i.imgur.com/8i14Q3Y.jpg",
		"https://i.imgur.com/oC8EjRE.jpg",
		"https://i.imgur.com/ifDUiqg.jpg",
		"https://i.imgur.com/HOl3PiO.jpg",
		"https://i.imgur.com/BVpUhtw.jpg",
		"https://i.imgur.com/rl0Mwdp.jpg",
		"https://i.imgur.com/BE1dPjZ.jpg",
		"https://i.imgur.com/QCKSOBp.jpg",
		"https://i.imgur.com/D01FNwR.jpg",
		"https://i.imgur.com/pYCekqv.jpg",
		"https://i.imgur.com/3Q4Xkfc.jpg",
		"https://i.imgur.com/Q47XL5s.jpg",
		"https://i.imgur.com/zmWJVyd.jpg",
		"https://i.imgur.com/9Tu19Da.jpg",
		"https://i.imgur.com/HIC6p5k.jpg",
		"https://i.imgur.com/XVMNba2.jpg",
		"https://i.imgur.com/Np1fVEV.jpg",
		"https://i.imgur.com/UWMzCwM.jpg",
		"https://i.imgur.com/qCISpY5.jpg",
		"https://i.imgur.com/xqgjKVq.jpg",
		"https://i.imgur.com/AWlZlln.jpg",
		"https://i.imgur.com/L3Y6l6K.jpg",
		"https://i.imgur.com/RFip7fj.jpg",
		"https://i.imgur.com/rSV6yqu.jpg",
		"https://i.imgur.com/MxdQ502.jpg",
		"https://i.imgur.com/3waxbLa.jpg",
		"https://i.imgur.com/E34i4pP.jpg",
		"https://i.imgur.com/YcFcVF9.jpg",
		"https://i.imgur.com/I5xojKZ.jpg",
		"https://i.imgur.com/rFAYTPU.jpg",
		"https://i.imgur.com/Qz5CrD0.jpg",
		"https://i.imgur.com/7IXvvAV.jpg",
		"https://i.imgur.com/coLdaXd.jpg",
		"https://i.imgur.com/ugX2QGp.jpg",
		"https://i.imgur.com/PENmJBu.jpg",
		"https://i.imgur.com/BeZfUWr.jpg",
	];
	let i = images.length;
	while (i--) {
		images.push(undefined);
	}
	return randomFromArray(images);
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
		"old",
	];

	const label = randomFromArray(labels);
	const result: Label[] = [];
	if (label) {
		result.push({ text: label, type: getRandomTagType(label) });
	}
	return result;
}

function randomAddress() {
	const addresses = [
		"Vest Dr, Dublin, VA, 24084",
		"St NE, Paris, TX, 75460",
		"Scioto Dr, Fairfield, OH, 45014",
		"Mirons 16.8 Ln, Rapid River, MI, 49878",
		"State 3 Rte #3, Watertown, NY, 13601",
		"Deer Run Rd, Warrenton, MO, 63383",
		"Lebanon St, Mount Airy, NC, 27030",
	];

	return randomFromArray(addresses);
}

function randomName() {
	const names = [
		"Liam",
		"Noah",
		"William",
		"James",
		"Oliver",
		"Benjamin",
		"Elijah",
		"Lucas",
		"Mason",
		"Logan",
		"Alexander",
		"Ethan",
		"Jacob",
		"Michael",
		"Daniel",
		"Henry",
		"Jackson",
		"Sebastian",
		"Aiden",
		"Matthew",
		"Samuel",
		"David",
		"Joseph",
		"Carter",
		"Owen",
		"Wyatt",
		"John",
		"Jack",
		"Luke",
		"Jayden",
		"Dylan",
		"Grayson",
		"Levi",
		"Isaac",
		"Gabriel",
		"Julian",
		"Mateo",
		"Anthony",
		"Jaxon",
		"Lincoln",
		"Joshua",
		"Christopher",
		"Andrew",
		"Theodore",
		"Caleb",
		"Ryan",
		"Asher",
		"Nathan",
		"Thomas",
		"Leo",
		"Isaiah",
		"Charles",
		"Josiah",
		"Hudson",
		"Christian",
		"Hunter",
		"Connor",
		"Eli",
		"Ezra",
		"Aaron",
		"Landon",
		"Adrian",
		"Jonathan",
		"Nolan",
		"Jeremiah",
		"Easton",
		"Elias",
		"Colton",
		"Cameron",
		"Carson",
		"Robert",
		"Angel",
		"Maverick",
		"Nicholas",
		"Dominic",
		"Jaxson",
		"Greyson",
		"Adam",
		"Ian",
		"Austin",
		"Santiago",
		"Jordan",
	];

	return randomFromArray(names) + " " + randomFromArray(names);
}

async function addBulk(store: Store<any, any>, docs: any[]) {
	const odocs = docs.map((x) => {
		const o = store.new(x);
		o.__ignoreObserver = true;
		o.__next = false;
		return o;
	});
	await (store as any).__bulkAddToMobx(odocs);
	return;
}

function randomCondition():
	| "filled"
	| "sound"
	| "compromised"
	| "endo"
	| "missing" {
	const conditions = [
		"filled",
		"sound",
		"sound",
		"sound",
		"sound",
		"sound",
		"compromised",
		"endo",
		"missing",
	];
	return randomFromArray(conditions) as any;
}

export function loadDemoData() {
	return new Promise((resolve, reject) => {
		const Http = new XMLHttpRequest();
		const url = "./demo.json";
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = async function (e) {
			if (this.readyState === 4) {
				config.queInterval = Infinity;
				const demoData: {
					treatments: modules.TreatmentSchema[];
					staff: modules.StaffMemberSchema[];
					patients: modules.PatientSchema[];
					appointments: modules.AppointmentSchema[];
					orthoCases: modules.OrthoCaseSchema[];
					labworks: modules.LabworkSchema[];
					prescriptions: modules.PrescriptionItemSchema[];
				} = JSON.parse(Http.responseText);
				modules.setting!.setSetting("dropbox_accessToken", "demo");
				modules.setting!.setSetting("module_labwork", "enabled");
				modules.setting!.setSetting("module_orthodontics", "enabled");
				modules.setting!.setSetting("module_prescriptions", "enabled");
				modules.setting!.setSetting("module_statistics", "enabled");
				await addBulk(modules.treatments!, demoData.treatments);
				await addBulk(modules.staff!, demoData.staff);
				for (let index = 0; index < demoData.patients.length; index++) {
					const patient = demoData.patients[index];
					patient.name = randomName();
					patient.birthYear = randomInRange(14, 74);
					patient.phone = `0${randomInRange(7700000000, 7799999999)}`;
					patient.email = `${
						patient.name.split(" ")[0]
					}@${randomFromArray([
						"gmail",
						"outlook",
						"yahoo",
						"aol",
					])}.com`;
					patient.address = `${randomInRange(
						21,
						1999
					)} ${randomAddress()}`;
					patient.labels = randomLabels();
					patient.teeth = patient.teeth.map((y) => {
						if (y) {
							y.condition = randomCondition();
						}
						return y;
					});
					patient.avatar = randomImage() || "";
					patient.gallery = [
						randomImage(),
						randomImage(),
						randomImage(),
					].filter((x) => x) as any;
				}
				await addBulk(modules.patients!, demoData.patients);
				for (
					let index = 0;
					index < demoData.appointments.length;
					index++
				) {
					const appointment = demoData.appointments[index];
					appointment.complaint = `${randomFromArray([
						"Pain",
						"Esthetic",
						"Throbbing pain",
						"Discomfort",
						"Dull pain",
					])} in the ${randomFromArray([
						"upper",
						"lower",
					])} ${randomFromArray([
						"left",
						"right",
					])} ${randomFromArray([
						"arch",
						"jaw",
						"central",
						"canine",
						"second molar",
						"premolar",
					])}`;
					appointment.date = randomDate();
					appointment.diagnosis = randomFromArray([
						"pulpitis",
						"RCD",
						"unknown",
						"lesion",
						"periapical lesion",
					]);
					appointment.staffID = [
						randomFromArray(
							modules.staff!.operatingStaff.map((x) => x._id)
						),
					];

					const treatment =
						randomFromArray(modules.treatments!.docs) ||
						randomFromArray(modules.treatments!.docs) ||
						randomFromArray(modules.treatments!.docs);
					appointment.treatmentID = (
						treatment || { _id: appointment.treatmentID }
					)._id;
					appointment.finalPrice = Math.round(
						(treatment || { expenses: 30 }).expenses * 1.4 +
							(treatment || { expenses: 30 }).expenses *
								randomInRange(0.5, 1.5)
					);
					appointment.involvedTeeth = [
						randomFromArray([
							randomInRange(11, 18),
							randomInRange(21, 28),
							randomInRange(31, 38),
							randomInRange(41, 48),
						]),
					];
					appointment.isDone =
						appointment.date < new Date().getTime();
					appointment.paidAmount = Math.round(
						randomFromArray([
							appointment.finalPrice,
							appointment.finalPrice,
							appointment.finalPrice,
							appointment.finalPrice * 0.5,
						])
					);
					appointment.patientID = randomFromArray(
						modules.patients!.docs.map((x) => x._id)
					);
					appointment.time = randomInRange(15 * minute, 1.5 * hour);
					appointment.units = 1;
				}
				await addBulk(modules.appointments!, demoData.appointments);
				for (
					let index = 0;
					index < demoData.orthoCases.length;
					index++
				) {
					const orthoCase = demoData.orthoCases[index];
					(orthoCase as any).__next = false;
					(orthoCase as any).__next = false;
					orthoCase.patientID = randomFromArray(
						demoData.patients.map((x) => x._id)
					);
					const patient = modules.patients!.docs.find(
						(x) => x._id === orthoCase.patientID
					);
					orthoCase.startedDate = patient!.appointments[0].date;
					orthoCase.isStarted = true;
					orthoCase.finishedDate = randomFromArray([
						0,
						patient!.appointments[3].date,
					]);
					orthoCase.visits = [];
				}
				await addBulk(modules.orthoCases!, demoData.orthoCases);
				await addBulk(modules.orthoCases!, demoData.orthoCases);
				await addBulk(modules.labworks!, demoData.labworks);
				await addBulk(modules.prescriptions!, demoData.prescriptions);
				resolve();
			}
		};
	});
}
