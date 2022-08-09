import { gender, ToothSchema } from "@modules";
import { tagType } from "common-components";
import { Schema } from "pouchx";

export interface PatientSchema extends Schema {
	_id: string;
	name: string;
	birthYear: number;
	gender: keyof typeof gender;
	tags: string;
	address: string;
	email: string;
	phone: string;
	medicalHistory: string[];
	gallery: string[];
	galbum: string;
	teeth: Array<ToothSchema | null>;
	labels: {
		text: string;
		type: keyof typeof tagType;
	}[];
}
