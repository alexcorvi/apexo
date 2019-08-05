import { prescriptionItemForm } from "@modules";
import { Schema } from "pouchx";

export interface PrescriptionItemSchema extends Schema {
	_id: string;
	name: string;
	doseInMg: number;
	timesPerDay: number;
	form: keyof typeof prescriptionItemForm;
	unitsPerTime: number;
}
