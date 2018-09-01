import * as React from 'react';
import { API } from '../';
import { Icon } from 'office-ui-fabric-react';
import { Row, Col } from '../../assets/components/grid/index';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { PatientLink } from '../../modules/patients/components';
import { TreatmentLink } from '../../modules/treatments/components';
import { Profile } from '../../assets/components/profile/profile';
import { appointmentsData } from '../../modules/appointments';
import { AppointmentThumb } from '../../assets/components/appointment-thumb/appointment-thumb';
import { user } from '../user/data.user';
import { appointmentsByDate } from '../../modules/statistics/components/charts/appointments-by-day';
import { checkServer } from '../../assets/utils/check-server';
@observer
export class Home extends React.Component<{}, {}> {
	@observable
	time = {
		year: new Date().getFullYear(),
		month: new Date().getMonth(),
		day: new Date().getDate(),
		monthName: new Date().toLocaleDateString('en-EN', { month: 'long' }),
		dayName: new Date().toLocaleDateString('en-EN', { weekday: 'long' }),
		time: new Date().toLocaleTimeString('en-EN', {})
	};

	@computed
	get todayAppointments() {
		return appointmentsData.appointments.appointmentsForDay(this.time.year, this.time.month + 1, this.time.day);
	}

	@computed
	get tomorrowAppointments() {
		return appointmentsData.appointments.appointmentsForDay(new Date().getTime() + 86400000, 0, 0);
	}

	render() {
		return (
			<div className="home  p-15 p-l-10 p-r-10">
				<div className="container">
					<Row gutter={12}>
						<Col xl={10} md={9} sm={24} xs={24}>
							<Profile name={user.currentDoctor ? user.currentDoctor.name : ''} />
						</Col>
						<Col xl={4} md={6} sm={0} xs={0} className="date-container">
							<Row gutter={12}>
								<div className="home-date">
									<p>{this.time.day}</p>
								</div>
								<div className="textual">
									<p className="day-name">{this.time.dayName}</p>
									<p>{this.time.monthName}</p>
								</div>
							</Row>
						</Col>
						<Col xl={10} md={9} sm={0} xs={0}>
							<p className="home-time">{this.time.time}</p>
						</Col>
					</Row>
					<br />
					<br />
					<hr />
					<div>
						<appointmentsByDate.Component />
					</div>
					<Row gutter={12}>
						<Col md={12}>
							<h3>Today's Appointments</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>Appointment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{this.todayAppointments.map((appointment) => (
										<tr key={appointment._id} className="home-td">
											<td>
												{<TreatmentLink id={appointment.treatmentID} />}
												{<PatientLink id={appointment.patientID} />}
											</td>
											<td>
												{appointment.doctors.map((operator) => (
													<Profile
														key={operator._id}
														name={operator.name}
														size={3}
														onClick={() => {}}
													/>
												))}
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{this.todayAppointments.length === 0 ? (
								<p className="no-appointments">There are no appointments for today</p>
							) : (
								''
							)}
						</Col>
						<Col md={12}>
							<h3>Tomorrow's Appointments</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>Appointment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{this.tomorrowAppointments.map((appointment) => (
										<tr key={appointment._id} className="home-td">
											<td>
												{<TreatmentLink id={appointment.treatmentID} />}
												<br />
												{<PatientLink id={appointment.patientID} />}
											</td>
											<td>
												{appointment.doctors.map((operator) => (
													<div>
														<Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
															<div key={operator._id} className="m-t-5 fs-11">
																<Icon iconName="Contact" /> Dr. {operator.name}
															</div>
														</Col>
														<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={0}>
															<Profile
																key={operator._id}
																name={operator.name}
																size={3}
																onClick={() => {}}
															/>
														</Col>
													</div>
												))}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{this.tomorrowAppointments.length === 0 ? (
								<p className="no-appointments">There are no appointments for tomorrow</p>
							) : (
								''
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	}

	componentDidMount() {
		setInterval(async () => {
			const d = new Date();
			this.time = {
				year: d.getFullYear(),
				month: d.getMonth(),
				day: d.getDate(),
				monthName: d.toLocaleDateString('en-EN', { month: 'long' }),
				dayName: d.toLocaleDateString('en-EN', { weekday: 'long' }),
				time: d.toLocaleTimeString('en-EN', {})
			};
		}, 100);
	}
}
