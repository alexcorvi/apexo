import * as core from "@core";
import * as modules from "@modules";
import { day, generateID } from "@utils";

{
	// staff
	if (!modules.staff.list.length) {
		const staffMemberA = new modules.StaffMember();
		staffMemberA.name = "A";
		staffMemberA.operates = true;
		staffMemberA.onDutyDays = ["Wednesday"];
		staffMemberA.pin = "0000";

		const staffMemberB = new modules.StaffMember();
		staffMemberB.name = "B";
		staffMemberB.operates = true;
		staffMemberB.onDutyDays = ["Thursday"];
		staffMemberB.pin = "0000";

		modules.staff.list.push(staffMemberA, staffMemberB);
	}
}

{
	// treatments
	if (!modules.treatments.list.length) {
		const treatmentA = new modules.Treatment({
			_id: generateID(),
			type: "A",
			expenses: 10
		});

		const treatmentB = new modules.Treatment({
			_id: generateID(),
			type: "B",
			expenses: 20
		});

		modules.treatments.list.push(treatmentA, treatmentB);
	}
}

{
	// patients
	if (!modules.patients.list.length) {
		const patientA = new modules.Patient();
		patientA.name = "A";

		const patientB = new modules.Patient();
		patientB.name = "B";

		modules.patients.list.push(patientA, patientB);
	}
}

{
	// appointments
	if (!modules.appointments.list.length) {
		const appointmentA = new modules.Appointment();
		appointmentA.date = new Date().getTime();
		appointmentA.staffID = [
			modules.staff.list.find(x => x.name === "A")!._id
		];
		appointmentA.notes = "A";

		const appointmentB = new modules.Appointment();
		appointmentB.date = new Date().getTime();
		appointmentB.staffID = [
			modules.staff.list.find(x => x.name === "B")!._id
		];
		appointmentB.notes = "B";

		const appointmentC = new modules.Appointment();
		appointmentC.date = new Date().getTime() - day * 30;
		appointmentC.staffID = [
			modules.staff.list.find(x => x.name === "A")!._id
		];
		appointmentC.notes = "C";

		const appointmentD = new modules.Appointment();
		appointmentD.date = new Date().getTime() - day * 30;
		appointmentD.staffID = [
			modules.staff.list.find(x => x.name === "B")!._id
		];
		appointmentD.notes = "D";

		modules.appointments.list.push(
			appointmentA,
			appointmentB,
			appointmentC,
			appointmentD
		);
	}
}
