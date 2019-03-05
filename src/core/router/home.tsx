import * as React from "react";
import { API } from "../";
import { appointmentsByDate } from "../../modules/statistics/components/charts/appointments-by-day";
import { appointmentsData } from "../../modules/appointments";
import { Col, Row } from "../../assets/components/grid/index";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Profile } from "../../assets/components/profile/profile";
import { ProfileSquared } from "../../assets/components/profile/profile-squared";
import { user } from "../user/data.user";
@observer
export class Home extends React.Component<{}, {}> {
	@observable
	time = {
		year: new Date().getFullYear(),
		month: new Date().getMonth(),
		day: new Date().getDate(),
		monthName: new Date().toLocaleDateString("en-EN", { month: "long" }),
		dayName: new Date().toLocaleDateString("en-EN", { weekday: "long" }),
		time: new Date().toLocaleTimeString("en-EN", {})
	};

	@computed
	get todayAppointments() {
		return appointmentsData.appointments.appointmentsForDay(
			this.time.year,
			this.time.month + 1,
			this.time.day
		);
	}

	@computed
	get tomorrowAppointments() {
		return appointmentsData.appointments.appointmentsForDay(
			new Date().getTime() + 86400000,
			0,
			0
		);
	}

	render() {
		return (
			<div className="home p-l-10 p-r-10">
				<div className="container">
					<h2 className="m-b-20">Welcome, {user.currentUser.name}</h2>
					<hr />
					<div>
						<appointmentsByDate.Component />
					</div>
					<Row gutter={12}>
						<Col md={12}>
							<h3 className="appointments-table-heading">
								Today's Appointments
							</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>Appointment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{this.todayAppointments.map(appointment => (
										<tr
											key={appointment._id}
											className="home-td"
										>
											<td>
												<ProfileSquared
													text={
														appointment.treatment
															? appointment
																	.treatment
																	.type
															: ""
													}
													subText={
														appointment.patient.name
													}
												/>
											</td>
											<td>
												{appointment.operatingStaff.map(
													operator => (
														<div key={operator._id}>
															<Col
																xxl={0}
																xl={0}
																lg={0}
																md={0}
																sm={0}
																xs={24}
															>
																<div
																	key={
																		operator._id
																	}
																	className="m-t-5 fs-11"
																>
																	{
																		operator.name
																	}
																</div>
															</Col>
															<Col
																xxl={24}
																xl={24}
																lg={24}
																md={24}
																sm={24}
																xs={0}
															>
																<Profile
																	key={
																		operator._id
																	}
																	name={
																		operator.name
																	}
																	onRenderInitials={() => (
																		<span>
																			{
																				operator
																					.name[0]
																			}
																		</span>
																	)}
																	size={3}
																	onClick={() => {
																		API.router.go(
																			[
																				"staff",
																				operator._id
																			]
																		);
																	}}
																	className="pointer"
																/>
															</Col>
														</div>
													)
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{this.todayAppointments.length === 0 ? (
								<p className="no-appointments">
									There are no appointments for today
								</p>
							) : (
								""
							)}
						</Col>
						<Col md={12}>
							<h3 className="appointments-table-heading">
								Tomorrow's Appointments
							</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>Appointment</th>
										<th>Operators</th>
									</tr>
								</thead>
								<tbody>
									{this.tomorrowAppointments.map(
										appointment => (
											<tr
												key={appointment._id}
												className="home-td"
											>
												<td>
													<ProfileSquared
														text={
															appointment.treatment
																? appointment
																		.treatment
																		.type
																: ""
														}
														subText={
															appointment.patient
																.name
														}
													/>
												</td>
												<td>
													{appointment.operatingStaff.map(
														operator => (
															<div
																key={
																	operator._id
																}
															>
																<Col
																	xxl={0}
																	xl={0}
																	lg={0}
																	md={0}
																	sm={0}
																	xs={24}
																>
																	<div
																		key={
																			operator._id
																		}
																		className="m-t-5 fs-11"
																	>
																		{
																			operator.name
																		}
																	</div>
																</Col>
																<Col
																	xxl={24}
																	xl={24}
																	lg={24}
																	md={24}
																	sm={24}
																	xs={0}
																>
																	<Profile
																		key={
																			operator._id
																		}
																		name={
																			operator.name
																		}
																		size={3}
																		onRenderInitials={() => (
																			<span>
																				{
																					operator
																						.name[0]
																				}
																			</span>
																		)}
																		onClick={() => {
																			API.router.go(
																				[
																					"staff",
																					operator._id
																				]
																			);
																		}}
																	/>
																</Col>
															</div>
														)
													)}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
							{this.tomorrowAppointments.length === 0 ? (
								<p className="no-appointments">
									There are no appointments for tomorrow
								</p>
							) : (
								""
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
				monthName: d.toLocaleDateString("en-EN", { month: "long" }),
				dayName: d.toLocaleDateString("en-EN", { weekday: "long" }),
				time: d.toLocaleTimeString("en-EN", {})
			};
		}, 100);
	}
}
