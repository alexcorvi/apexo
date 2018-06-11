import './doctors-listing.scss';

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
import { Doctor, doctors } from '../data';
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

@observer
export class DoctorsListing extends React.Component<{}, {}> {
	/**
	 * Selected doctor index to be viewed or edited
	 * 
	 * @memberof DoctorsListing
	* */
	@observable selectedDoctorIndex = -1;

	@observable selectedAppointmentID = '';

	@observable viewingPastAppointments = false;

	/**
	 * Selected doctor (MIGHT BE UNDEFINED)
	 * 
	 * @readonly
	 * @memberof DoctorsListing
	 */
	@computed
	get doctor() {
		return doctors.list[this.selectedDoctorIndex];
	}

	@computed
	get appointment() {
		return appointmentsData.appointments.list[
			appointmentsData.appointments.getIndexByID(this.selectedAppointmentID)
		];
	}

	@computed
	get listAppointments() {
		return this.viewingPastAppointments ? this.doctor.pastAppointments : this.doctor.nextAppointments;
	}

	componentDidMount() {
		doctors.filter = '';
		const searchBox = document.querySelectorAll('.doctors-component .ms-CommandBarSearch-input');
		if (searchBox.length) {
			const inputBox = searchBox.item(0) as HTMLInputElement;
			inputBox.onkeydown = inputBox.onkeyup = () => {
				doctors.filter = inputBox.value;
			};
		}
	}

	render() {
		return (
			<div className="doctors-component p-15 p-l-10 p-r-10">
				<Row gutter={16}>
					<Col lg={16}>
						<CommandBar
							{...{
								className: 'commandBar fixed m-b-15',
								isSearchBoxVisible: true,
								searchPlaceholderText: 'Search Doctors...',
								elipisisAriaLabel: 'More options',
								items: [],
								farItems: [
									{
										key: 'addNew',
										title: 'Add new',
										name: 'Add New',
										onClick: () => {
											const patient = new Doctor();
											doctors.list.push(patient);
											this.selectedDoctorIndex = doctors.list.length - 1;
										},
										iconProps: {
											iconName: 'Add'
										}
									}
								]
							}}
						/>
						<DataTable
							className={'doctors-data-table'}
							heads={[ 'Profile', 'Last Appointment', 'Next Appointment' ]}
							rows={doctors.filtered.map((doctor) => [
								{
									sortableValue: doctor.name,
									component: (
										<Profile
											name={doctor.name}
											secondaryText={doctor.email}
											tertiaryText={`${doctor.nextAppointments.length} Upcoming appointments`}
											onClick={() => {
												this.selectedDoctorIndex = doctors.getIndexByID(doctor._id);
											}}
										/>
									),
									onClick: () => {
										this.selectedDoctorIndex = doctors.getIndexByID(doctor._id);
									},
									className: 'no-label'
								},
								{
									sortableValue: (doctor.lastAppointment || { date: 0 }).date,
									component: doctor.lastAppointment ? (
										<AppointmentThumb appointment={doctor.lastAppointment} />
									) : (
										'Not registered'
									),
									className: 'hidden-xs'
								},
								{
									sortableValue: (doctor.nextAppointment || { date: Infinity }).date,
									component: doctor.nextAppointment ? (
										<AppointmentThumb appointment={doctor.nextAppointment} />
									) : (
										'Not registered'
									),
									className: 'hidden-xs'
								}
							])}
						/>
					</Col>
					<Col lg={8}>
						<table className="ms-table duty-table">
							<tbody>
								{[
									'Sunday',
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday'
								].map((dayName, index) => {
									return (
										<tr key={dayName}>
											<th className="day-name">{dayName}</th>
											<td className="doctor">
												{doctors.list
													.filter((doctor) => doctor.onDutyDays.indexOf(dayName) !== -1)
													.map((doctor) => {
														return (
															<Profile
																style={{
																	marginBottom: '2px',
																	marginTop: '2px'
																}}
																className=""
																size={PersonaSize.large}
																key={doctor._id}
																name={doctor.name}
																tertiaryText={`${(doctor.weeksAppointments[index] || [])
																	.length} appointments for ${dayName.toLowerCase()}`}
																onClick={() => {
																	this.selectedDoctorIndex = doctors.getIndexByID(
																		doctor._id
																	);
																}}
															/>
														);
													})}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Col>
				</Row>

				{this.doctor ? (
					<Panel
						isOpen={!!this.doctor}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedDoctorIndex = -1;
						}}
					>
						{this.doctor.name ? (
							<Profile
								name={this.doctor.name}
								secondaryText={this.doctor.email}
								tertiaryText={this.doctor.phone}
							/>
						) : (
							''
						)}
						<br />
						<hr className="appointment-hr" />
						<div className="doctor-editor m-t-20">
							<div className="doctor-input">
								<label>Name: </label>
								<TextField
									prefix="Dr."
									value={this.doctor.name}
									onChanged={(val) => (this.doctor.name = val)}
								/>
							</div>
							<Row gutter={12}>
								<Col sm={12}>
									<div className="doctor-input">
										<label>Phone Number: </label>
										<TextField
											value={this.doctor.phone}
											onChanged={(val) => (this.doctor.phone = val)}
										/>
									</div>
								</Col>
								<Col sm={12}>
									<div className="doctor-input">
										<label>Email: </label>
										<TextField
											value={this.doctor.email}
											onChanged={(val) => (this.doctor.email = val)}
										/>
									</div>
								</Col>
							</Row>
							<div className="doctor-input">
								<label>Days on duty: </label>
								<TagInput
									strict={true}
									placeholder={'Enter day name...'}
									options={this.doctor.days.map((x) => ({ key: x, text: x }))}
									onChange={(newVal) => {
										this.doctor.onDutyDays = newVal.map((x) => x.text);
									}}
									value={this.doctor.onDutyDays.map((x) => ({ text: x, key: x }))}
									sortFunction={(a, b) =>
										this.doctor.days.indexOf(a.text) - this.doctor.days.indexOf(b.text)}
								/>
							</div>
							<PrimaryButton
								className="delete m-b-30"
								onClick={() => {
									doctors.deleteModal(this.doctor._id);
									this.selectedDoctorIndex = -1;
								}}
								iconProps={{ iconName: 'trash' }}
								text="Delete Doctor"
							/>
						</div>

						<h3>Appointments</h3>
						<br />
						<hr className="appointment-hr" />

						<Label
							type={this.viewingPastAppointments ? LabelType.info : LabelType.primary}
							text="Upcoming"
							onClick={() => (this.viewingPastAppointments = false)}
						/>
						<Label
							type={this.viewingPastAppointments ? LabelType.primary : LabelType.info}
							text="Past"
							onClick={() => (this.viewingPastAppointments = true)}
						/>

						<div className="appointments-listing">
							{this.listAppointments.length ? (
								this.listAppointments.map((appointment) => {
									return (
										<AppointmentThumb
											key={appointment._id}
											appointment={appointment}
											canDelete={true}
											labeled={true}
											small={true}
											onClick={() => {
												this.selectedAppointmentID = appointment._id;
											}}
										/>
									);
								})
							) : (
								<p>Nothing found...</p>
							)}
						</div>
					</Panel>
				) : (
					''
				)}
				{this.appointment ? (
					<appointmentsComponents.AppointmentEditor
						onDismiss={() => (this.selectedAppointmentID = '')}
						onDelete={() => (this.selectedAppointmentID = '')}
						appointment={this.appointment}
					/>
				) : (
					''
				)}
			</div>
		);
	}
}
