import './ortho-list.scss';

import * as React from 'react';

import {
	CommandBar,
	IContextualMenuItem,
	Panel,
	PanelType,
	PersonaSize,
	Pivot,
	PivotItem,
	PrimaryButton,
	TextField
} from 'office-ui-fabric-react';
import { OrthoCase, cases } from '../data';
import { Label, LabelType, getRandomLabelType } from '../../../assets/components/label/label.component';
import { appointmentsComponents, appointmentsData } from '../../appointments';
import { computed, observable } from 'mobx';
import { Col, Row } from 'antd';
import { API } from '../../../core';
import { AppointmentThumb } from '../../../assets/components/appointment-thumb/appointment-thumb';
import { DataTable } from '../../../assets/components/data-table/data-table.component';
import { Profile } from '../../../assets/components/profile/profile';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { observer } from 'mobx-react';
import t4mat from 't4mat';
import { patientsData, patientsComponents } from '../../patients';
import { genderToString } from '../../patients/data/enum.gender';

@observer
export class OrthoList extends React.Component<{}, {}> {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = '';

	render() {
		return (
			<div className="orthodontic-cases-component p-15 p-l-10 p-r-10">
				<DataTable
					onDelete={(id) => {
						cases.deleteModal(id);
					}}
					className={'orthodontic-cases-data-table'}
					heads={[ 'Patient', 'Started', 'Next Appointment' ]}
					rows={cases.filtered.filter((orthoCase) => orthoCase.patient).map((orthoCase) => {
						const patient = orthoCase.patient || new patientsData.Patient();
						return {
							id: orthoCase._id,
							cells: [
								{
									dataValue: patient.name,
									component: (
										<Profile
											name={patient.name}
											secondaryElement={<span>{genderToString(patient.gender)}</span>}
											tertiaryText={`${patient.age} years old`}
										/>
									),
									className: 'no-label',
									onClick: () => {
										API.router.go([ 'orthodontic', orthoCase._id ]);
									}
								},
								{
									dataValue: orthoCase.started,
									component: t4mat({ time: orthoCase.started }),
									className: 'hidden-xs'
								},
								{
									dataValue: (patient.nextAppointment || { date: 0 }).date,
									component: patient.nextAppointment ? (
										<AppointmentThumb appointment={patient.nextAppointment} />
									) : (
										'Not registered'
									),
									className: 'hidden-xs'
								}
							]
						};
					})}
					commands={[
						{
							key: 'addNew',
							title: 'Add new',
							name: 'Add New',
							onClick: () => (this.showAdditionPanel = true),
							iconProps: {
								iconName: 'Add'
							}
						}
					]}
				/>
				<Panel
					isOpen={this.showAdditionPanel}
					type={PanelType.smallFixedFar}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => {
						this.showAdditionPanel = false;
					}}
				>
					<h4>Choose Patient</h4>
					<br />
					<TagInput
						strict
						value={[]}
						options={cases.patientsWithNoOrtho.map((patient) => ({ key: patient._id, text: patient.name }))}
						onAdd={(val) => {
							this.showAdditionPanel = false;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = val.key;
							cases.list.push(orthoCase);
						}}
						placeholder="Type to select patient"
					/>
					<br />
					<hr />
					<h4>Or add new patient</h4>
					<br />
					<TextField
						placeholder="Patient name"
						value={this.newPatientName}
						onChanged={(v) => (this.newPatientName = v)}
					/>
					<PrimaryButton
						onClick={() => {
							const newPatient = new patientsData.Patient();
							newPatient.name = this.newPatientName;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = newPatient._id;
							cases.list.push(orthoCase);
						}}
						iconProps={{
							iconName: 'add'
						}}
					>
						Add New
					</PrimaryButton>
				</Panel>
			</div>
		);
	}
}
