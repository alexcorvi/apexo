import './patient-details.scss';

import * as React from 'react';

import { DatePicker, Dropdown, Icon, Panel, PanelType, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { Gender, ISOTeethArr, Patient, patients } from '../../data';
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

@observer
export class PatientDetails extends React.Component<
	{
		patient: Patient;
		hideTitle?: boolean;
	},
	{}
> {
	render() {
		return (
			<div className="single-patient-details">
				{this.props.hideTitle ? '' : <h3>Patient Details</h3>}
				<div className="basic-info">
					<div className="">
						<div className="name">
							<TextField
								prefix="Name"
								value={this.props.patient.name}
								onChanged={(name) => (this.props.patient.name = name)}
							/>
						</div>
						<div className="birth">
							<TextField
								prefix="Birth"
								value={this.props.patient.birthYear.toString()}
								onChanged={(year) => (this.props.patient.birthYear = Number(year))}
								type="number"
							/>
						</div>
						<div className="gender">
							<Dropdown
								placeHolder="Gender"
								selectedKey={this.props.patient.gender === Gender.male ? 'male' : 'female'}
								options={[ { key: 'male', text: 'Male' }, { key: 'female', text: 'Female' } ]}
								onChanged={(val) => {
									if (val.key === 'male') {
										this.props.patient.gender = Gender.male;
									} else {
										this.props.patient.gender = Gender.female;
									}
								}}
							/>
						</div>
					</div>
					<TextField
						prefix="Email"
						value={this.props.patient.email}
						onChanged={(email) => (this.props.patient.email = email)}
					/>
					<TextField
						prefix="Phone"
						value={this.props.patient.phone}
						onChanged={(phone) => (this.props.patient.phone = phone)}
						type="number"
					/>
					<TextField
						prefix="Address"
						value={this.props.patient.address}
						onChanged={(address) => (this.props.patient.address = address)}
					/>
					<TagInput
						className="patient-tags"
						placeholder="Labels"
						options={[ '' ]
							.concat(...patients.list.map((patient) => patient.labels.map((label) => label.text)))
							.map((x) => ({ key: x, text: x }))}
						onChange={(newVal) => {
							this.props.patient.labels = newVal.map((item) => {
								return {
									text: item.text,
									type: getRandomLabelType(item.text)
								};
							});
						}}
						value={this.props.patient.labels.map((label) => ({
							key: label.text,
							text: label.text
						}))}
					/>
					<div className="medical-history">
						<EditableList
							label="Notes"
							value={this.props.patient.medicalHistory}
							onChange={(newVal) => {
								this.props.patient.medicalHistory = newVal;
							}}
						/>
					</div>
					<Gallery
						gallery={this.props.patient.gallery}
						onChange={(list) => {
							this.props.patient.gallery = list;
						}}
					/>
					<div className="buttons">
						<PrimaryButton
							className="delete"
							text="Delete Patient"
							iconProps={{ iconName: 'trash' }}
							onClick={() => {
								patients.deleteModal(this.props.patient._id);
								API.router.history(-1);
							}}
							key="delete"
						/>
					</div>
				</div>
			</div>
		);
	}
}
