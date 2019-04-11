import { appointments } from "@modules";
import { day } from "@utils";
import { computed, observable } from "mobx";

class Statistics {
	@observable filterByMember: string = "";

	readonly msInDay = day;

	readonly todayDateObject: Date = new Date();

	readonly todayStartsWith: number = this.getDayStartingPoint(
		this.todayDateObject.getTime()
	);

	@observable startingDate: number = this.todayStartsWith - this.msInDay * 31;

	@observable endingDate: number = this.todayStartsWith;

	@computed
	private get numberOfSelectedDays() {
		return (this.endingDate - this.startingDate) / this.msInDay;
	}

	@computed
	get selectedDays() {
		const days: Date[] = [];
		let i = 0;
		while (i <= this.numberOfSelectedDays) {
			days.push(new Date(this.startingDate + this.msInDay * i));
			i++;
		}
		return days;
	}

	@computed
	private get _selectedAppointmentsByDay() {
		return this.selectedDays.map(calDay =>
			appointments
				.appointmentsForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				)
				.filter(
					appointment =>
						!this.filterByMember ||
						appointment.staffID.indexOf(this.filterByMember) > -1
				)
				.filter(appointment => appointment.treatment)
		);
	}

	@computed
	get selectedAppointmentsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	@computed
	get selectedPatientsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	@computed
	get selectedAppointments() {
		return this._selectedAppointmentsByDay.reduce((total, els) => {
			els.forEach(el => total.push(el));
			return total;
		}, []);
	}

	@computed
	get selectedPatients() {
		return this.selectedAppointments.map(
			appointment => appointment.patient
		);
	}

	@computed
	get selectedFinances() {
		return this.selectedAppointmentsByDay.map(date => {
			const appointmentsList = date.appointments.map(appointment => {
				const paid = appointment.paidAmount;
				const expenses = appointment.expenses;
				const profit = appointment.profit;
				const profitPercentage = appointment.profitPercentage;
				return {
					paid,
					expenses,
					profit,
					profitPercentage,
					isPaid: appointment.isPaid,
					isDone: appointment.isDone
				};
			});
			return {
				day: date.day,
				appointments: appointmentsList
			};
		});
	}

	@computed
	get totalProfits() {
		return this.selectedAppointments
			.map(x => x.profit)
			.reduce((total, single) => (total = total + single), 0);
	}

	@computed
	get totalExpenses() {
		return this.selectedAppointments
			.map(x => x.expenses)
			.reduce((total, single) => (total = total + single), 0);
	}

	@computed
	get totalPayments() {
		return this.selectedAppointments
			.map(x => x.paidAmount)
			.reduce((total, single) => (total = total + single), 0);
	}

	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}
}

export const statistics = new Statistics();
