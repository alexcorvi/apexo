import { modals, text } from "@core";
import { Appointment } from "@modules";
import { textualFilter } from "@utils";
import { observable } from "mobx";

class AppointmentsData {
	ignoreObserver: boolean = false;
	@observable public list: Appointment[] = [];

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

		let list = this.list.filter(appointment => {
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
				appointment => appointment.staffID.indexOf(operatorID) !== -1
			);
		}
		return list;
	}
	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}
	deleteModal(id: string) {
		modals.newModal({
			message: text("Are you sure you want to delete this appointment?"),
			onConfirm: () => this.deleteByID(id),
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}
	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		this.list.splice(i, 1);
	}
}

export const appointments = new AppointmentsData();
