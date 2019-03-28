export interface AppointmentJSON {
	_id: string;
	treatmentID: string;
	patientID: string;
	date: number;
	involvedTeeth: number[];
	time: number;
	paidAmount: number;
	finalPrice: number;
	isDone: boolean;
	prescriptions: { prescription: string; id: string }[];
	complaint: string;
	diagnosis: string;
	staffID?: string[];
	doctorsID?: string[];
	units: number;
	notes: string;
}
