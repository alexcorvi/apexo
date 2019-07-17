import { AppointmentsListNoDate, Col, ProfileComponent, Row } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment, PrescriptionItem, setting, StaffMember } from "@modules";
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
	allAppointments: Appointment[];
	doDeleteAppointment: (id: string) => void;
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	allStaff: StaffMember[];
	currentUser: StaffMember;
	currencySymbol: string;
}> {
	@observable selectedAppointmentId: string = "";

	@computed get selectedAppointment() {
		return this.props.allAppointments.find(
			appointment => appointment._id === this.selectedAppointmentId
		);
	}

	@computed get weekdays() {
		const weekendNum = Number(setting.getSetting("weekend_num"));
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
						{text("Welcome")}, {this.props.currentUsername}
					</h2>
					<Row gutter={0}>
						<Col md={10}>
							<table className="ms-table duty-table">
								<tbody>
									{this.weekdays.map(dayName => {
										return (
											<tr key={dayName}>
												<th className="day-name">
													{text(dayName)}
												</th>
												<td className="names">
													{this.props.allStaff
														.filter(
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
																				"staff",
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
						<Col md={14}>
							<h3 className="appointments-table-heading">
								{text("Today's Appointments")}
							</h3>
							<AppointmentsListNoDate
								appointments={this.props.todayAppointments.filter(
									x => isToday(x.date)
								)}
								onClick={id => {
									this.selectedAppointmentId = id;
								}}
								dateFormat={this.props.dateFormat}
								onDeleteAppointment={() => {}}
								canDelete={false}
							/>
							{this.props.todayAppointments.length === 0 ? (
								<p className="no-appointments">
									{text(
										"There are no appointments for today"
									)}
								</p>
							) : (
								""
							)}
							<h3 className="appointments-table-heading">
								{text("Tomorrow's Appointments")}
							</h3>
							<AppointmentsListNoDate
								appointments={this.props.tomorrowAppointments.filter(
									x => isTomorrow(x.date)
								)}
								onClick={id => {
									this.selectedAppointmentId = id;
								}}
								dateFormat={this.props.dateFormat}
								onDeleteAppointment={() => {}}
								canDelete={false}
							/>
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
				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => {
							this.selectedAppointmentId = "";
							this.render();
						}}
						doDeleteAppointment={id => {
							this.props.doDeleteAppointment(id);
							this.selectedAppointmentId = "";
						}}
						availableTreatments={this.props.availableTreatments}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						currentUser={this.props.currentUser}
						dateFormat={this.props.dateFormat}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						operatingStaff={this.props.operatingStaff}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
