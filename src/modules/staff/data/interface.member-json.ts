export interface StaffMemberJSON {
	_id: string;
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
