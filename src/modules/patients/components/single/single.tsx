import './single.scss';

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
import { Row, Col } from 'antd';
import { Gallery } from '../../../../assets/components/gallery/gallery';
import { DentalHistory } from '../dental-history/dental-history';
import { PatientDetails } from '../patient-details/patient-details';
import { PatientAppointments } from '../patient-appointments/patient-appointments';

@observer
export class SinglePatient extends React.Component<{}, {}> {
	/**
	 * requested ID of the patient
	 * 
	 * @type {string}
	 * @memberof SinglePatient
	 */
	@observable requestedID: string;

	/**
	 * patient index
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get patientIndex() {
		return patients.findIndexByID(this.requestedID);
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

	/**
	 * When the component mounts make the requested ID by current location
	 * 
	 * @memberof SinglePatient
	 */
	componentWillMount() {
		this.requestedID = API.router.currentLocation.split('/')[1];
	}

	render() {
		return (
			<div className="single-patient-component p-15 p-l-10 p-r-10 p-t-5">
				<Row gutter={8}>
					<Col md={8}>
						<section>
							<PatientDetails patient={this.patient} />
						</section>
					</Col>
					<Col md={16}>
						<section>
							<DentalHistory patient={this.patient} />
						</section>
						<section>
							<PatientAppointments patient={this.patient} />
						</section>
					</Col>
				</Row>
			</div>
		);
	}
}
