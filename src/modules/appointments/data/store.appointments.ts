import { dbAction, modals, text } from "@core";
import { Appointment, AppointmentSchema } from "@modules";
import * as modules from "@modules";
import { day as dayInMs, textualFilter } from "@utils";
import { computed, observable } from "mobx";
import { Store } from "pouchx";

export class Appointments extends Store<AppointmentSchema, Appointment> {
	@computed get tomorrowAppointments() {
		return this.appointmentsForDay(new Date().getTime() + dayInMs, 0, 0);
	}

	@computed get todayAppointments() {
		return this.appointmentsForDay(new Date().getTime(), 0, 0);
	}

	async afterChange() {
		// resync on change
		dbAction("resync", modules.appointmentsNamespace);
	}

	appointmentsForDay(
		year: number,
		month: number,
		day: number,
		filter?: string,
		operatorID?: string
	) {
		if (year > 3000) {
			// it's a timestamp
			const date = new Date(year);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}

		let list = this.docs.filter((appointment) => {
			const date = new Date(appointment.date);
			return (
				date.getFullYear() === year &&
				date.getMonth() + 1 === month &&
				date.getDate() === day
			);
		});

		if (filter) {
			list = textualFilter(list, filter);
		}

		if (operatorID) {
			list = list.filter(
				(appointment) => appointment.staffID.indexOf(operatorID) !== -1
			);
		}
		return list.sort((a, b) => a.date - b.date);
	}
	deleteModal(id: string) {
		modals.newModal({
			text: text("are you sure you want to delete this appointment?").c,
			onConfirm: () => this.delete(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random(),
		});
	}
}

export let appointments: null | Appointments = null;

export function setAppointmentsStore(store: Appointments) {
	appointments = store;
}
