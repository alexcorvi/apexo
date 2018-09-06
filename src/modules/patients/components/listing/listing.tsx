import './listing.scss';

import * as React from 'react';

import {
	CommandBar,
	Persona,
	PersonaPresence,
	PersonaSize,
	ICommandBarItemProps,
	TextField,
	SearchBox
} from 'office-ui-fabric-react';
import { Gender, genderToString, patients } from '../../data';
import { observable, computed } from 'mobx';
import { API } from '../../../../core';
import { AppointmentThumb } from '../../../../assets/components/appointment-thumb/appointment-thumb';
import { DataTable } from '../../../../assets/components/data-table/data-table.component';
import { Label } from '../../../../assets/components/label/label.component';
import { Patient } from '../../data';
import { Profile } from '../../../../assets/components/profile/profile';
import { commands } from './commands';
import { observer } from 'mobx-react';
import { SinglePatient } from '../single/single';

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
					heads={[ 'Profile', 'Last Appointment', 'Next Appointment', 'Label' ]}
					rows={patients.list.map((patient) => ({
						id: patient._id,
						cells: [
							{
								dataValue: patient.name + ' ' + patient.age + ' ' + genderToString(patient.gender),
								component: (
									<Profile
										name={patient.name}
										secondaryElement={<span>{genderToString(patient.gender)}</span>}
										tertiaryText={`${patient.age} years old`}
										size={matchMedia('(max-width: 767px)').matches ? 3 : undefined}
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
									<AppointmentThumb small appointment={patient.lastAppointment} />
								) : (
									'Not registered'
								),
								className: 'hidden-xs'
							},
							{
								dataValue: (patient.nextAppointment || { date: Infinity }).date,
								component: patient.nextAppointment ? (
									<AppointmentThumb small appointment={patient.nextAppointment} />
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
