import * as React from 'react';
import { API } from '../../../../core';
import { appointmentsComponents } from '../../../appointments';
import { appointmentsData } from '../../../appointments';
import { AppointmentsList } from '../../../../assets/components/appointments-list/appointments-list';
import { Col, Row } from '../../../../assets/components/grid/index';
import { computed, observable } from 'mobx';
import { convert } from '../../../../assets/utils/teeth-numbering-systems';
import {
	DatePicker,
	Dropdown,
	Icon,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle
	} from 'office-ui-fabric-react';
import { EditableList } from '../../../../assets/components/editable-list/editable-list';
import {
	Gender,
	ISOTeethArr,
	Patient,
	patients,
	ToothCondition
	} from '../../data';
import { getRandomLabelType, Label, LabelType } from '../../../../assets/components/label/label.component';
import { observer } from 'mobx-react';
import { TagInput } from '../../../../assets/components/tag-input/tag-input';
import { TeethDeciduousChart, TeethPermanentChart } from '../index';
import { treatmentsData } from '../../../treatments';
import './patient-appointments.scss';

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

	l: AppointmentsList | null = null;

	render() {
		return (
			<div className="single-patient-appointments appointments">
				{this.props.hideTitle ? '' : <h3>Appointments</h3>}
				{this.appointments.length ? (
					<AppointmentsList ref={(l) => (this.l = l)} list={this.appointments} />
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
						if (this.l) {
							this.l.selectedAppointmentID = apt._id;
						}
					}}
					iconProps={{ iconName: 'add' }}
				>
					Book New Appointment
				</PrimaryButton>
			</div>
		);
	}
}
