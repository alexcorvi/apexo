import './listing.scss';

import * as React from 'react';

import { CommandBar, Persona, PersonaPresence, PersonaSize } from 'office-ui-fabric-react';
import { Gender, genderToString, patients } from '../../data';

import { API } from '../../../../core';
import { AppointmentThumb } from '../../../../assets/components/appointment-thumb/appointment-thumb';
import { DataTable } from '../../../../assets/components/data-table/data-table.component';
import { Label } from '../../../../assets/components/label/label.component';
import { Patient } from '../../data';
import { Profile } from '../../../../assets/components/profile/profile';
import { commands } from './commands';
import { observer } from 'mobx-react';

@observer
export class PatientsListing extends React.Component<{}, {}> {
	componentDidMount() {
		patients.filter = '';
		const searchBox = document.querySelectorAll('.patients-component .ms-CommandBarSearch-input');
		if (searchBox.length) {
			const inputBox = searchBox.item(0) as HTMLInputElement;
			inputBox.onkeydown = inputBox.onkeyup = () => {
				patients.filter = inputBox.value;
			};
		}
	}

	render() {
		return (
			<div className="patients-component p-15 p-l-10 p-r-10">
				<CommandBar
					{...{
						className: 'commandBar fixed m-b-15',
						isSearchBoxVisible: true,
						searchPlaceholderText: 'Search Patients...',
						elipisisAriaLabel: 'More options',
						items: [],
						farItems: commands
					}}
				/>
				<DataTable
					className={'patients-data-table'}
					heads={[ 'Profile', 'Last Appointment', 'Next Appointment', 'Label' ]}
					rows={patients.filtered.map((patient) => [
						{
							sortableValue: patient.name,
							component: (
								<Profile
									name={patient.name}
									secondaryElement={<span>{genderToString(patient.gender)}</span>}
									tertiaryText={`${patient.age} years old`}
								/>
							),
							onClick: () => {
								API.router.go([ 'patients', patient._id ]);
							},
							className: 'no-label'
						},
						{
							sortableValue: (patient.lastAppointment || { date: 0 }).date,
							component: patient.lastAppointment ? (
								<AppointmentThumb appointment={patient.lastAppointment} />
							) : (
								'Not registered'
							),
							className: 'hidden-xs'
						},
						{
							sortableValue: (patient.nextAppointment || { date: Infinity }).date,
							component: patient.nextAppointment ? (
								<AppointmentThumb appointment={patient.nextAppointment} />
							) : (
								'Not registered'
							),
							className: 'hidden-xs'
						},
						{
							sortableValue: patient.name,
							component: (
								<div>
									{patient.labels.map((label, index) => {
										return <Label key={index} text={label.text} type={label.type} />;
									})}
								</div>
							),
							className: 'hidden-xs'
						}
					])}
				/>
			</div>
		);
	}
}
