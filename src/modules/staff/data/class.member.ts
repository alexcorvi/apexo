import { Appointment, appointments, Calendar, setting, StaffMemberJSON } from "@modules";
import { dateNames, formatDate, generateID } from "@utils";
import { computed, observable } from "mobx";

export class StaffMember {
	_id: string = generateID();

	@observable triggerUpdate: number = 0;

	@observable name: string = "";

	@observable email: string = "";

	@observable phone: string = "";

	@observable operates: boolean = true;

	@observable canEditStaff: boolean = true;
	@observable canEditPatients: boolean = true;
	@observable canEditOrtho: boolean = true;
	@observable canEditAppointments: boolean = true;
	@observable canEditTreatments: boolean = true;
	@observable canEditPrescriptions: boolean = true;
	@observable canEditSettings: boolean = true;

	@observable canViewStaff: boolean = true;
	@observable canViewPatients: boolean = true;
	@observable canViewOrtho: boolean = true;
	@observable canViewAppointments: boolean = true;
	@observable canViewTreatments: boolean = true;
	@observable canViewPrescriptions: boolean = true;
	@observable canViewSettings: boolean = true;
	@observable canViewStats: boolean = true;

	@observable pin: string | undefined = "";

	@observable onDutyDays: string[] = [];

	@computed
	get onDuty() {
		return dateNames
			.days(true)
			.filter(day => this.onDutyDays.indexOf(day) !== -1)
			.map(day => dateNames.days(true).indexOf(day));
	}

	@computed
	get sortedDays() {
		return this.onDutyDays
			.slice()
			.sort(
				(dayA, dayB) =>
					dateNames.days(true).indexOf(dayA) -
					dateNames.days(true).indexOf(dayB)
			);
	}

	@computed
	get appointments() {
		return appointments.list.filter(
			x => x.staffID.indexOf(this._id) !== -1
		);
	}

	@computed
	get weeksAppointments() {
		const c = new Calendar();
		const resAppointments: {
			[key: string]: Appointment[];
		} = {};
		c.selectedWeekDays.forEach(day => {
			const d = day.dateNum;
			const m = c.currentMonth;
			const y = c.currentYear;
			appointments
				.appointmentsForDay(y, m + 1, d)
				.filter(
					appointment => appointment.staffID.indexOf(this._id) !== -1
				)
				.forEach(appointment => {
					if (!resAppointments[day.weekDay.dayLiteral]) {
						resAppointments[day.weekDay.dayLiteral] = [];
					}
					resAppointments[day.weekDay.dayLiteral].push(appointment);
				});
		});
		return resAppointments;
	}

	@computed
	get lastAppointment() {
		return this.pastAppointments[0];
	}

	@computed
	get searchableString() {
		return `
			${this.name} ${this.onDutyDays.join(" ")}
			${this.phone} ${this.email}
			${
				this.nextAppointment
					? (this.nextAppointment.treatment || { type: "" }).type
					: ""
			}
			${
				this.nextAppointment
					? formatDate(
							this.nextAppointment.date,
							setting.getSetting("date_format")
					  )
					: ""
			}
			${
				this.lastAppointment
					? (this.lastAppointment.treatment || { type: "" }).type
					: ""
			}
			${
				this.lastAppointment
					? formatDate(
							this.lastAppointment.date,
							setting.getSetting("date_format")
					  )
					: ""
			}
		`.toLowerCase();
	}

	@computed
	get nextAppointment() {
		return this.nextAppointments[0];
	}

	@computed
	get nextAppointments() {
		return this.appointments
			.filter(
				appointment =>
					this.getDayStartingPoint(appointment.date) >=
					this.getDayStartingPoint(new Date().getTime())
			)
			.sort((a, b) => a.date - b.date);
	}

	@computed
	get pastAppointments() {
		return this.appointments
			.filter(
				appointment =>
					this.getDayStartingPoint(appointment.date) <
					this.getDayStartingPoint(new Date().getTime())
			)
			.sort((a, b) => b.date - a.date);
	}

	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}

	toJSON(): StaffMemberJSON {
		return {
			_id: this._id,
			name: this.name,
			email: this.email,
			phone: this.phone,
			operates: this.operates,
			onDutyDays: Array.from(this.onDutyDays),
			canEditStaff: this.canEditStaff,
			canEditPatients: this.canEditPatients,
			canEditOrtho: this.canEditOrtho,
			canEditAppointments: this.canEditAppointments,
			canEditTreatments: this.canEditTreatments,
			canEditPrescriptions: this.canEditPrescriptions,
			canEditSettings: this.canEditSettings,
			canViewStaff: this.canViewStaff,
			canViewPatients: this.canViewPatients,
			canViewOrtho: this.canViewOrtho,
			canViewAppointments: this.canViewAppointments,
			canViewTreatments: this.canViewTreatments,
			canViewPrescriptions: this.canViewPrescriptions,
			canViewSettings: this.canViewSettings,
			canViewStats: this.canViewStats,
			pin: this.pin
		};
	}

	fromJSON(json: StaffMemberJSON) {
		this._id = json._id;
		this.name = json.name || "";
		this.email = json.email || "";
		this.phone = json.phone || "";
		this.pin = json.pin;
		this.operates =
			typeof json.operates === "boolean" ? json.operates : true;
		this.onDutyDays = Array.isArray(json.onDutyDays) ? json.onDutyDays : [];
		this.canEditStaff =
			typeof json.canEditStaff === "boolean" ? json.canEditStaff : true;
		this.canEditPatients =
			typeof json.canEditPatients === "boolean"
				? json.canEditPatients
				: true;
		this.canEditOrtho =
			typeof json.canEditOrtho === "boolean" ? json.canEditOrtho : true;
		this.canEditAppointments =
			typeof json.canEditAppointments === "boolean"
				? json.canEditAppointments
				: true;
		this.canEditTreatments =
			typeof json.canEditTreatments === "boolean"
				? json.canEditTreatments
				: true;
		this.canEditPrescriptions =
			typeof json.canEditPrescriptions === "boolean"
				? json.canEditPrescriptions
				: true;
		this.canEditSettings =
			typeof json.canEditSettings === "boolean"
				? json.canEditSettings
				: true;
		this.canViewStaff =
			typeof json.canViewStaff === "boolean" ? json.canViewStaff : true;
		this.canViewPatients =
			typeof json.canViewPatients === "boolean"
				? json.canViewPatients
				: true;
		this.canViewOrtho =
			typeof json.canViewOrtho === "boolean" ? json.canViewOrtho : true;
		this.canViewAppointments =
			typeof json.canViewAppointments === "boolean"
				? json.canViewAppointments
				: true;
		this.canViewTreatments =
			typeof json.canViewTreatments === "boolean"
				? json.canViewTreatments
				: true;
		this.canViewPrescriptions =
			typeof json.canViewPrescriptions === "boolean"
				? json.canViewPrescriptions
				: true;
		this.canViewSettings =
			typeof json.canViewSettings === "boolean"
				? json.canViewSettings
				: true;
		this.canViewStats =
			typeof json.canViewStats === "boolean" ? json.canViewStats : true;
	}

	constructor(json?: StaffMemberJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}
}
