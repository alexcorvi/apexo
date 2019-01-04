import * as dateUtils from '../../../assets/utils/date';
import * as React from 'react';
import { cases, OrthoCase } from '../data';
import {
	Panel,
	PanelType,
	PrimaryButton,
	TextField
	} from 'office-ui-fabric-react';
import { observable } from 'mobx';
import { DataTable } from '../../../assets/components/data-table/data-table.component';
import { genderToString } from '../../patients/data/enum.gender';
import { observer } from 'mobx-react';
import { OrthoSingle } from '.';
import { patientsData } from '../../patients';
import { Profile } from '../../../assets/components/profile/profile';
import { ProfileSquared } from '../../../assets/components/profile/profile-squared';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import './ortho-list.scss';

@observer
export class OrthoList extends React.Component<{}, {}> {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = '';

	@observable selectedCaseID: string = '';

	render() {
		return (
			<div className="orthodontic-cases-component p-15 p-l-10 p-r-10">
				<DataTable
					onDelete={(id) => {
						cases.deleteModal(id);
					}}
					maxItemsOnLoad={15}
					className={'orthodontic-cases-data-table'}
					heads={[ 'Patient', 'Started', 'Next Appointment' ]}
					rows={cases.filtered.filter((orthoCase) => orthoCase.patient).map((orthoCase) => {
						const patient = orthoCase.patient || new patientsData.Patient();
						return {
							id: orthoCase._id,
							searchableString: orthoCase.searchableString,
							cells: [
								{
									dataValue: patient.name,
									component: (
										<Profile
											name={patient.name}
											secondaryElement={
												<span>
													Patient, {genderToString(patient.gender)} - {patient.age} years old
												</span>
											}
											size={3}
										/>
									),
									className: 'no-label',
									onClick: () => {
										this.selectedCaseID = orthoCase._id;
									}
								},
								{
									dataValue: orthoCase.started,
									component: dateUtils.relativeFormat(orthoCase.started),
									className: 'hidden-xs'
								},
								{
									dataValue: (patient.nextAppointment || { date: 0 }).date,
									component: patient.nextAppointment ? (
										<ProfileSquared
											text={patient.nextAppointment.treatment.type}
											subText={dateUtils.relativeFormat(patient.nextAppointment.date)}
											size={3}
											onClick={() => {}}
										/>
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
							this.selectedCaseID = orthoCase._id;
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
							patientsData.patients.list.push(newPatient);
							cases.list.push(orthoCase);
							this.newPatientName = '';
							this.selectedCaseID = orthoCase._id;
						}}
						iconProps={{
							iconName: 'add'
						}}
					>
						Add New
					</PrimaryButton>
				</Panel>
				<OrthoSingle id={this.selectedCaseID} onDismiss={() => (this.selectedCaseID = '')} />
			</div>
		);
	}
}
