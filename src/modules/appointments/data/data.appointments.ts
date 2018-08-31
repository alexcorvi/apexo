import { computed, observable } from 'mobx';

import { API } from '../../../core';
import { Appointment } from './class.appointment';
import { generateID } from '../../../assets/utils/generate-id';
import { patientsData } from '../../patients';
import prompts from '../../../core/prompts/data.prompts';
import t4mat from 't4mat';
import { treatmentsData } from '../../treatments';

class AppointmentsData {
	ignoreObserver: boolean = false;
	@observable public list: Appointment[] = [];

	appointmentsForDay(year: number, month: number, day: number, filter?: string, doctorID?: string) {
		if (year > 3000) {
			// it's a timestamp
			const date = new Date(year);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}

		let list = this.list.filter((appointment) => {
			const date = new Date(appointment.date);
			return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
		});

		if (filter) {
			list = list.filter((appointment) => {
				const data = `
				${appointment.involvedTeeth.join(' ')}
				${appointment.patient.name}
				${appointment.treatment.type}
				${appointment.doctors.map((doc) => doc.name).join(' ')}
			`.toLowerCase();
				const filters = filter.toLowerCase().split(/\W/);
				return filters.every((keyword) => data.indexOf(keyword) > -1);
			});
		}

		if (doctorID) {
			list = list.filter((appointment) => appointment.doctorsID.indexOf(doctorID) !== -1);
		}

		return list;
	}
	getIndexByID(id: string) {
		return this.list.findIndex((x) => x._id === id);
	}
	deleteModal(id: string) {
		API.modals.newModal({
			message: 'Are you sure you want to delete this appointment?',
			onConfirm: () => this.deleteByID(id)
		});
	}
	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const appointment = this.list.splice(i, 1)[0];
		// delete photos
		appointment.records.forEach(async (fileID) => {
			await API.files.remove(fileID);
		});
	}
}

export default new AppointmentsData();
