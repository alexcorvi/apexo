import * as React from 'react';
import { API } from '../';
import { Icon } from 'office-ui-fabric-react';
import { Row, Col } from 'antd';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { PatientLink } from '../../modules/patients/components';
import { TreatmentLink } from '../../modules/treatments/components';
import { Profile } from '../../assets/components/profile/profile';
import { appointmentsData } from '../../modules/appointments';
import { AppointmentThumb } from '../../assets/components/appointment-thumb/appointment-thumb';
import { user } from '../user/data.user';
import { appointmentsByDate } from '../../modules/statistics/components/charts/appointments-by-day';
import { LineChart } from '../../assets/components/charts/line';
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

	@observable serverLatencyValues: number[] = [ 0, 0, 0, 0 ];

	render() {
		return (
			<div className="home  p-15 p-l-10 p-r-10">
				<div className="container">
					<Row gutter={12}>
						<Col xl={10} md={9} sm={6} xs={4}>
							<Profile name={user.currentDoctor.name} />
						</Col>
						<Col xl={4} md={6} sm={12} xs={16} style={{ marginTop: '10px' }}>
							<Row gutter={12}>
								<div style={{ float: 'left', fontSize: '48px' }}>
									<p>{this.time.day}</p>
								</div>
								<div style={{ float: 'left', textAlign: 'center' }}>
									<p style={{ fontSize: '22px', marginTop: '6px' }}>{this.time.dayName}</p>
									<p>{this.time.monthName}</p>
								</div>
							</Row>
						</Col>
						<Col xl={10} md={9} sm={6} xs={4}>
							<div
								style={{
									textAlign: 'right',
									fontSize: '20px',
									marginTop: '30px',
									letterSpacing: '6px'
								}}
							>
								<p>{this.time.time}</p>
							</div>
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
										<th>Patient</th>
										<th>Treatment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{appointmentsData.appointments
										.appointmentsForDay(this.time.year, this.time.month + 1, this.time.day)
										.map((appointment) => (
											<tr key={appointment._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
												<td>{<PatientLink id={appointment.patientID} />}</td>
												<td>{<TreatmentLink id={appointment.treatmentID} />}</td>
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
						</Col>
						<Col md={12}>
							<h3>Tomorrow's Appointments</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>Patient</th>
										<th>Treatment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{appointmentsData.appointments
										.appointmentsForDay(this.time.year, this.time.month + 1, this.time.day + 1)
										.map((appointment) => (
											<tr key={appointment._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
												<td>{<PatientLink id={appointment.patientID} />}</td>
												<td>{<TreatmentLink id={appointment.treatmentID} />}</td>
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