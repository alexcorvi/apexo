import { ToothJSON } from './interface.tooth-json';

export interface PatientJSON {
	_id: string;
	name: string;
	birthYear: number;
	gender: string;
	tags: string;
	address: string;
	email: string;
	phone: string;
	medicalHistory: string[];
	gallery: string[];
	teeth: (ToothJSON | null)[];
	labels: {
		text: string;
		type: string;
	}[];
}
