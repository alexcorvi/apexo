import { PrescriptionItem } from "../modules/prescriptions/data/class.prescription-item";
import { StaffMember } from "../modules/staff/data/class.member";
import { AppointmentsListNoDate, Col, ProfileComponent, ProfileSquaredComponent, Row } from "@common-components";
import { text } from "@core";
import { Appointment } from "@modules";
import { isToday, isTomorrow } from "@utils";
import { computed, observable } from "mobx";
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
	currentUser: StaffMember;
	currencySymbol: string;
}> {
	@observable selectedAppointmentId: string = "";

	@computed get selectedAppointment() {
		return this.props.allAppointments.find(
			appointment => appointment._id === this.selectedAppointmentId
		);
	}

	render() {
		return (
			<div className="home">
				<div>
					<h2 className="m-b-20 welcome">
						{text("Welcome")}, {this.props.currentUsername}
					</h2>
					<div>
						{this.props.showChart ? (
							<div id="home-chart">
								<AppointmentsByDateChart
									selectedAppointmentsByDay={
										this.props.selectedAppointmentsByDay
									}
									dateFormat={this.props.dateFormat}
								/>
							</div>
						) : (
							""
						)}
					</div>
					<Row gutter={0}>
						<Col md={12}>
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
						</Col>
						<Col md={12}>
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
