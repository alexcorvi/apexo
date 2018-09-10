import * as dateUtils from '../../../../assets/utils/date';
import * as React from 'react';
import { API } from '../../../../core';
import {
	CommandBar,
	ICommandBarItemProps,
	Icon,
	Persona,
	PersonaPresence,
	PersonaSize,
	SearchBox,
	TextField
	} from 'office-ui-fabric-react';
import { commands } from './commands';
import { computed, observable } from 'mobx';
import { DataTable } from '../../../../assets/components/data-table/data-table.component';
import { Gender, genderToString, patients } from '../../data';
import { Label } from '../../../../assets/components/label/label.component';
import { observer } from 'mobx-react';
import { Patient } from '../../data';
import { Profile } from '../../../../assets/components/profile/profile';
import { ProfileSquared } from '../../../../assets/components/profile/profile-squared';
import { SinglePatient } from '../single/single';
import './listing.scss';



@observer
export class PatientsListing extends React.Component<{}, {}> {
	@observable selectedId: string = API.router.currentLocation.split('/')[1];

	@computed
	get patientIsSelected() {
		return patients.findIndexByID(this.selectedId) > -1;
	}

	render() {
		return (
			<div className="patients-component p-15 p-l-10 p-r-10">
				{this.patientIsSelected ? (
					<SinglePatient id={this.selectedId} onDismiss={() => (this.selectedId = '')} />
				) : (
					''
				)}
				<DataTable
					onDelete={(id) => {
						patients.deleteModal(id);
					}}
					className={'patients-data-table'}
					heads={[ 'Patient', 'Last Appointment', 'Next Appointment', 'Label' ]}
					rows={patients.list.map((patient) => ({
						id: patient._id,
						cells: [
							{
								dataValue: patient.name + ' ' + patient.age + ' ' + genderToString(patient.gender),
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
								onClick: () => {
									this.selectedId = patient._id;
								},
								className: 'no-label'
							},
							{
								dataValue: (patient.lastAppointment || { date: 0 }).date,
								component: patient.lastAppointment ? (
									<ProfileSquared
										text={patient.lastAppointment.treatment.type}
										subText={dateUtils.relativeFormat(patient.lastAppointment.date)}
										size={3}
										onClick={() => {}}
									/>
								) : (
									'Not registered'
								),
								className: 'hidden-xs'
							},
							{
								dataValue: (patient.nextAppointment || { date: Infinity }).date,
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
							},
							{
								dataValue: patient.name,
								component: (
									<div>
										{patient.labels.map((label, index) => {
											return <Label key={index} text={label.text} type={label.type} />;
										})}
									</div>
								),
								className: 'hidden-xs'
							}
						]
					}))}
					commands={commands}
				/>
			</div>
		);
	}
}
