import { Col, ProfileComponent, ProfileSquaredComponent, Row } from "@common-components";
import { text } from "@core";
import { Appointment } from "@modules";
import { observer } from "mobx-react";
import { Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentsByDateChart = loadable({
	loader: async () =>
		(await import("modules/statistics/components/chart.appointments-date"))
			.AppointmentsByDateChart,
	loading: () => <Shimmer />
});

@observer
export class HomeView extends React.Component<{
	currentUsername: string;
	showChart: boolean;
	todayAppointments: Appointment[];
	tomorrowAppointments: Appointment[];
	dateFormat: string;
	selectedAppointmentsByDay: {
		appointments: Appointment[];
		day: Date;
	}[];
}> {
	render() {
		return (
			<div className="home p-l-10 p-r-10">
				<div className="container">
					<h2 className="m-b-20">
						{text("Welcome")}, {this.props.currentUsername}
					</h2>
					<hr />
					<div>
						{this.props.showChart ? (
							<AppointmentsByDateChart
								selectedAppointmentsByDay={
									this.props.selectedAppointmentsByDay
								}
								dateFormat={this.props.dateFormat}
							/>
						) : (
							""
						)}
					</div>
					<Row gutter={12}>
						<Col md={12}>
							<h3 className="appointments-table-heading">
								{text("Today's Appointments")}
							</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>{text("Appointment")}</th>
										<th>{text("Operators")}</th>
									</tr>
								</thead>
								<tbody>
									{this.props.todayAppointments.map(
										appointment => (
											<tr
												key={appointment._id}
												className="home-td"
											>
												<td>
													<ProfileSquaredComponent
														text={
															appointment.treatment
																? appointment
																		.treatment
																		.type
																: ""
														}
														subText={
															(
																appointment.patient || {
																	name: ""
																}
															).name
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
																	<ProfileComponent
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

							{this.props.todayAppointments.length === 0 ? (
								<p className="no-appointments">
									{text(
										"There are no appointments for today"
									)}
								</p>
							) : (
								""
							)}
						</Col>
						<Col md={12}>
							<h3 className="appointments-table-heading">
								{text("Tomorrow's Appointments")}
							</h3>
							<br />
							<table className="ms-table">
								<thead>
									<tr>
										<th>{text("Appointment")}</th>
										<th>{text("Operators")}</th>
									</tr>
								</thead>
								<tbody>
									{this.props.tomorrowAppointments.map(
										appointment => (
											<tr
												key={appointment._id}
												className="home-td"
											>
												<td>
													<ProfileSquaredComponent
														text={
															appointment.treatment
																? appointment
																		.treatment
																		.type
																: ""
														}
														subText={
															(
																appointment.patient || {
																	name: ""
																}
															).name
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
																	<ProfileComponent
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
							{this.props.tomorrowAppointments.length === 0 ? (
								<p className="no-appointments">
									{text(
										"There are no appointments for tomorrow"
									)}
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
}
