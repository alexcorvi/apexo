import './patient-appointments.scss';

import * as React from 'react';

import { DatePicker, Dropdown, Icon, Panel, PanelType, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { Gender, ISOTeethArr, Patient, ToothCondition, patients } from '../../data';
import { Label, LabelType, getRandomLabelType } from '../../../../assets/components/label/label.component';
import { TeethDeciduousChart, TeethPermanentChart } from '../index';
import { computed, observable } from 'mobx';

import { API } from '../../../../core';
import { AppointmentThumb } from '../../../../assets/components/appointment-thumb/appointment-thumb';
import { EditableList } from '../../../../assets/components/editable-list/editable-list';
import { TagInput } from '../../../../assets/components/tag-input/tag-input';
import { appointmentsComponents } from '../../../appointments';
import { appointmentsData } from '../../../appointments';
import { convert } from '../../../../assets/utils/teeth-numbering-systems';
import { observer } from 'mobx-react';
import { treatmentsData } from '../../../treatments';
import { Row, Col } from '../../../../assets/components/grid/index';
import { AppointmentsList } from '../../../../assets/components/appointments-list/appointments-list';

@observer
export class PatientAppointments extends React.Component<{ patient: Patient; hideTitle?: boolean }, {}> {
	/**
	 * an array of the registered appointments for this patient
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get appointments() {
		return appointmentsData.appointments.list.filter((item) => {
			return item.patientID === this.props.patient._id;
		});
	}

	/**
	 * Selected appointment to be viewed
	 * 
	 * @type {(appointmentsData.Appointment | null)}
	 * @memberof SinglePatient
	 */
	@observable selectedAppointment: appointmentsData.Appointment | null = null;

	render() {
		return (
			<div className="single-patient-appointments appointments">
				{this.props.hideTitle ? '' : <h3>Appointments</h3>}
				{this.appointments.length ? (
					<AppointmentsList list={this.appointments} />
				) : (
					<p className="no-appointments">This patient does not have any appointment.</p>
				)}
				<br />
				<PrimaryButton
					onClick={() => {
						const apt = new appointmentsData.Appointment();
						apt.patientID = this.props.patient._id;
						apt.date = new Date().getTime();
						appointmentsData.appointments.list.push(apt);
						this.selectedAppointment = apt;
					}}
					iconProps={{ iconName: 'add' }}
				>
					Book New Appointment
				</PrimaryButton>
			</div>
		);
	}
}
