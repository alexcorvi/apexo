import { AppointmentsListNoDate, Col, ProfileComponent, Row } from "@common-components";
import * as core from "@core";
import { text } from "@core";
import { Appointment, PrescriptionItem, setting, StaffMember } from "@modules";
import * as modules from "@modules";
import { dateNames, isToday, isTomorrow } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class HomeView extends React.Component {
	@observable selectedAppointmentId: string = "";

	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			appointment => appointment._id === this.selectedAppointmentId
		);
	}

	@computed get weekdays() {
		const weekendNum = Number(setting!.getSetting("weekend_num"));
		return dateNames.days().reduce((arr: string[], date, index) => {
			if (index <= weekendNum) {
				arr.push(date);
			} else {
				arr.splice(index - weekendNum - 1, 0, date);
			}
			return arr;
		}, []);
	}

	render() {
		return (
			<div className="home">
				<div>
					<h2 className="welcome">
						{text("Welcome")}, {core.user.currentUser!.name}
					</h2>
					<Row gutter={0}>
						<Col md={14}>
							<h3 className="appointments-table-heading">
								{text("Appointments for today")}
							</h3>
							<AppointmentsListNoDate
								className="today-appointments"
								appointments={modules.appointments!.todayAppointments.filter(
									x => isToday(x.date)
								)}
								onClick={id => {
									this.selectedAppointmentId = id;
									core.router.selectSub("details");
								}}
								canDelete={false}
							/>
							{modules.appointments!.todayAppointments.length ===
							0 ? (
								<p className="no-appointments">
									{text(
										"There are no appointments for today"
									)}
								</p>
							) : (
								""
							)}
							<h3 className="appointments-table-heading">
								{text("Appointments for tomorrow")}
							</h3>
							<AppointmentsListNoDate
								className="tomorrow-appointments"
								appointments={modules.appointments!.tomorrowAppointments.filter(
									x => isTomorrow(x.date)
								)}
								onClick={id => {
									this.selectedAppointmentId = id;
									core.router.selectSub("details");
								}}
								canDelete={false}
							/>
							{modules.appointments!.tomorrowAppointments
								.length === 0 ? (
								<p className="no-appointments">
									{text(
										"There are no appointments for tomorrow"
									)}
								</p>
							) : (
								""
							)}
						</Col>
						<Col md={10}>
							<h3 className="appointments-table-heading">
								{text("Appointments for this week")}
							</h3>
							<table className="ms-table duty-table">
								<tbody>
									{this.weekdays.map(dayName => {
										return (
											<tr key={dayName}>
												<th className="day-name">
													{text(dayName)}
												</th>
												<td className="names">
													{modules
														.staff!.docs.filter(
															member =>
																member.onDutyDays.indexOf(
																	dayName
																) !== -1
														)
														.map(member => {
															return (
																<ProfileComponent
																	className="m-b-5"
																	size={3}
																	onClick={() => {
																		core.router.go(
																			[
																				modules.staffNamespace,
																				member._id,
																				"appointments"
																			]
																		);
																	}}
																	style={{
																		cursor:
																			"pointer"
																	}}
																	key={
																		member._id
																	}
																	name={
																		member.name
																	}
																	secondaryElement={
																		<span>
																			{
																				(
																					member
																						.weeksAppointments[
																						dayName
																					] ||
																					[]
																				)
																					.length
																			}{" "}
																			{text(
																				"appointments for"
																			)}{" "}
																			{text(
																				dayName
																			)}
																		</span>
																	}
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
				</div>
				{this.selectedAppointment && core.router.selectedSub ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => {
							this.selectedAppointmentId = "";
							core.router.unSelectSub();
						}}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
