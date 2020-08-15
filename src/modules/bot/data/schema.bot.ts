import { Schema } from "pouchx";
export type BotMessageSchema = BookingRequestSchema & BroadcastMessageSchema;

interface BroadcastMessageSchema extends Schema {
	incoming: boolean;
	title: string;
	body: string;
}

interface BookingRequestSchema extends Schema {
	incoming: boolean;
	name: string;
	phone: string;
	gender: string;
	age: number;
	complaint: string;
	operator: string;
	daysOfWeek: string;
	timeOfDay: string;
}