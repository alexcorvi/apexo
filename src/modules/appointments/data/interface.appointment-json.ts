export interface AppointmentJSON {
	_id: string;
	treatmentID: string;
	patientID: string;
	date: number;
	involvedTeeth: number[];
	time: number;
	paidAmount: number;
	done: boolean;
	paid: boolean;
	prescriptions: { prescription: string; id: string }[];
	complaint: string;
	diagnosis: string;
	doctorsID: string[];
	records: string[];
	units: number;
}
