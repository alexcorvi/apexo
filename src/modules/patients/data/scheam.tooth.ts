import { ToothCondition } from "@modules";

export interface ToothSchema {
	ISO: number;
	condition: keyof typeof ToothCondition;
	notes: string[];
}
