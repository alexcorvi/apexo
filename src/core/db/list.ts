import { appointmentsData } from "../../modules/appointments";
import { orthoData } from "../../modules/orthodontic";
import { patientsData } from "../../modules/patients";
import { prescriptionsData } from "../../modules/prescriptions";
import { settingsData } from "../../modules/settings";
import { treatmentsData } from "../../modules/treatments";

export const DBsList = [
	appointmentsData.namespace,
	"doctors",
	orthoData.namespace,
	patientsData.namespace,
	prescriptionsData.namespace,
	settingsData.namespace,
	treatmentsData.namespace
];
