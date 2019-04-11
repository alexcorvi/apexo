import { ToothCondition } from "@modules";

export interface ToothJSON {
	ISO: number;
	condition: keyof typeof ToothCondition;
	notes: string[];
}
