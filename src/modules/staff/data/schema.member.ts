import { Schema } from "pouchx";

export interface StaffMemberSchema extends Schema {
	name: string;
	email: string;
	phone: string;
	operates: boolean;
	onDutyDays: string[];
	canEditStaff: boolean;
	canEditPatients: boolean;
	canEditOrtho: boolean;
	canEditAppointments: boolean;
	canEditTreatments: boolean;
	canEditPrescriptions: boolean;
	canEditSettings: boolean;
	canViewStaff: boolean;
	canViewPatients: boolean;
	canViewOrtho: boolean;
	canViewAppointments: boolean;
	canViewTreatments: boolean;
	canViewPrescriptions: boolean;
	canViewSettings: boolean;
	canViewStats: boolean;
	pin: string | undefined;
}
