import { ToothCondition } from './enum.toothCondition';

export interface ToothJSON {
	ISO: number;
	condition: keyof typeof ToothCondition;
	notes: string[];
}
