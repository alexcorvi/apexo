import './single.scss';

import * as React from 'react';

import {
	DatePicker,
	Dropdown,
	Icon,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle,
	IconButton
} from 'office-ui-fabric-react';
import { Gender, ISOTeethArr, Patient, ToothCondition, patients, genderToString } from '../../data';
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
import { DentalHistory } from '../dental-history/dental-history';
import { PatientDetails } from '../patient-details/patient-details';
import { PatientAppointments } from '../patient-appointments/patient-appointments';
import { Profile } from '../../../../assets/components/profile/profile';
import { Section } from '../../../../assets/components/section/section';

@observer
export class SinglePatient extends React.Component<{ id: string; onDismiss: () => void }, {}> {
	/**
	 * patient index
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get patientIndex() {
		return patients.findIndexByID(this.props.id);
	}

	/**
	 * Selected patient
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get patient() {
		return patients.list[this.patientIndex] || new Patient();
	}

	render() {
		return (
			<div className="single-patient-component">
				<Panel
					isOpen={this.patientIndex !== -1}
					type={PanelType.medium}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={this.props.onDismiss}
					onRenderNavigation={() => {
						return (
							<Row className="panel-heading">
								<Col span={22}>
									<Profile
										name={this.patient.name}
										secondaryElement={
											<span>
												Patient, {genderToString(this.patient.gender)} - {this.patient.age}{' '}
												years old
											</span>
										}
										size={3}
									/>
								</Col>
								<Col span={2} className="close">
									<IconButton
										iconProps={{ iconName: 'cancel' }}
										onClick={() => {
											this.props.onDismiss();
										}}
									/>
								</Col>
							</Row>
						);
					}}
				>
					<Section title="Patient Details" showByDefault>
						<PatientDetails hideTitle patient={this.patient} />
					</Section>
					<Section title="Dental History" showByDefault>
						<DentalHistory hideTitle patient={this.patient} />
					</Section>
					<Section title="Appointments" showByDefault>
						<PatientAppointments hideTitle patient={this.patient} />
					</Section>
				</Panel>
			</div>
		);
	}
}
