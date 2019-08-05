import { Schema } from "pouchx";
export interface TreatmentSchema extends Schema {
	type: string;
	expenses: number;
}
