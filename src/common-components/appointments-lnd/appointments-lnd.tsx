import { Col, ProfileComponent, ProfileSquaredComponent } from "@common-components";
import { Appointment } from "@modules";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class AppointmentsListNoDate extends React.Component<
	{ appointments: Appointment[]; onClick: (id: string) => void },
	{}
> {
	render() {
		return (
			<table className="ms-table appointments-lnd">
				{this.props.appointments.map(appointment => (
					<tbody
						key={appointment._id}
						onClick={() => this.props.onClick(appointment._id)}
						className={`appointment-body ${
							appointment.isDone ? " done" : ""
						}`}
					>
						<tr>
							<td colSpan={2} className="hat-time">
								{appointment.isDone
									? "Done"
									: appointment.formattedTime}
							</td>
						</tr>
						<tr className="home-td today-appointment">
							<td>
								<ProfileSquaredComponent
									text={
										appointment.treatment
											? appointment.treatment.type
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
								{appointment.operatingStaff.map(operator => (
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
												key={operator._id}
												className="m-t-5 fs-11"
											>
												{operator.name}
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
												key={operator._id}
												name={operator.name}
												onRenderInitials={() => (
													<span>
														{operator.name[0]}
													</span>
												)}
												size={1}
												className="operator-thumb"
											/>
										</Col>
									</div>
								))}
							</td>
						</tr>
					</tbody>
				))}
			</table>
		);
	}
}
