import { appointments, Gender, Patient, Treatment } from "@modules";
import { day, getDayStartingPoint } from "@utils";
import { computed, observable } from "mobx";

class Statistics {
	@observable specificMemberID: string = "";

	readonly todayDateObject: Date = new Date();

	readonly todayStartsWith: number = getDayStartingPoint(
		this.todayDateObject.getTime()
	);

	@observable startingDate: number = this.todayStartsWith - day * 31;

	@observable endingDate: number = this.todayStartsWith;

	@computed
	private get numberOfSelectedDays() {
		return (this.endingDate - this.startingDate) / day;
	}

	@computed
	get selectedDays() {
		const days: Date[] = [];
		let i = 0;
		while (i <= this.numberOfSelectedDays) {
			days.push(new Date(this.startingDate + day * i));
			i++;
		}
		return days;
	}

	@computed
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: Treatment;
			male: number;
			female: number;
			profit: number;
			times: number;
		}[] = [];
		statistics.selectedAppointments.forEach(appointment => {
			if (appointment.treatment) {
				const i = selectedTreatments.findIndex(
					t => t.treatment._id === appointment.treatment!._id
				);
				let male = 0;
				let female = 0;
				if (
					(appointment.patient || new Patient()).gender ===
					Gender.female
				) {
					female++;
				} else {
					male++;
				}

				if (i === -1) {
					// add new
					selectedTreatments.push({
						treatment: appointment.treatment,
						male,
						female,
						profit: appointment.profit,
						times: 1
					});
				} else {
					// just increment
					selectedTreatments[i].male =
						selectedTreatments[i].male + male;
					selectedTreatments[i].female =
						selectedTreatments[i].female + female;
					selectedTreatments[i].times++;
					selectedTreatments[i].profit =
						selectedTreatments[i].profit + appointment.profit;
				}
			}
		});
		return selectedTreatments;
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
						!this.specificMemberID ||
						appointment.staffID.indexOf(this.specificMemberID) > -1
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
		return this.selectedAppointments.reduce(
			(patients: Patient[], appointment) => {
				if (appointment.patient) {
					patients.push(appointment.patient);
				}
				return patients;
			},
			[]
		);
	}

	@computed
	get selectedFinancesByDay() {
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
}

export const statistics = new Statistics();
