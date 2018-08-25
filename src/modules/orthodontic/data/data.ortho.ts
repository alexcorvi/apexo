import { computed, observable, observe } from 'mobx';

import { API } from '../../../core';
import { OrthoCase } from './class.ortho';
import { escapeRegExp } from '../../../assets/utils/escape-regex';
import { patientsData } from '../../patients/index';

class OrthoCases {
	@observable triggerUpdate: number = 0;

	ignoreObserver: boolean = false;

	@observable list: OrthoCase[] = [];

	@observable filter: string = '';

	@computed
	get filtered(): OrthoCase[] {
		if (this.filter === '') {
			return this.list;
		} else {
			const filters = this.filter.split(' ').map((filterString) => new RegExp(escapeRegExp(filterString), 'gim'));
			return this.list.filter((orthoCase) => filters.every((filter) => filter.test(JSON.stringify(orthoCase))));
		}
	}

	@computed
	get allPatientsIDs() {
		return this.list.map((orthoCase) => orthoCase.patientID);
	}

	@computed
	get patientsWithNoOrtho() {
		return patientsData.patients.list.filter((patient) => this.allPatientsIDs.indexOf(patient._id) === -1);
	}

	getIndexByID(id: string) {
		return this.list.findIndex((x) => x._id === id);
	}

	deleteByPatientID(id: string) {
		const ortho = this.list.find((o) => o.patientID === id);
		if (ortho) {
			this.deleteByID(ortho._id);
		}
	}

	private deleteByID(id: string) {
		const i = this.getIndexByID(id);
		const orthoCase = this.list.splice(i, 1)[0];
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const orthoCase = this.list[i];
		API.modals.newModal({
			message: `Orthodontic case of "${(orthoCase.patient || { name: 'not found' }).name}" will be deleted`,
			onConfirm: () => this.deleteByID(id)
		});
	}
}

export default new OrthoCases();
