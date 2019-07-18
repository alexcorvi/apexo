import { AppointmentsListNoDate, Col, ProfileComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import { Appointment, PrescriptionItem, StaffMember } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	IconButton,
	Link,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	Shimmer
	} from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class UserPanelView extends React.Component<{
	staffName: string;
	todayAppointments: Appointment[];
	isOpen: boolean;
	onDismiss: () => void;
	logout: () => void;
	resetUser: () => void;
	dateFormat: string;
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	currentUser: StaffMember;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	currencySymbol: string;
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	doDeleteAppointment: (id: string) => void;
	allAppointments: Appointment[];
}> {
	@observable selectedAppointmentId: string = "";
	@computed get selectedAppointment() {
		return this.props.allAppointments.find(
			x => x._id === this.selectedAppointmentId
		);
	}

	render() {
		return (
			<Panel
				className="user-component"
				type={PanelType.medium}
				isLightDismiss
				isOpen={this.props.isOpen}
				onDismiss={() => this.props.onDismiss()}
				onRenderNavigation={() => (
					<Row className="panel-heading">
						<Col span={20}>
							<ProfileComponent
								name={this.props.staffName}
								size={3}
								secondaryElement={
									<div>
										<Link
											onClick={() => {
												this.props.logout();
											}}
											data-testid="logout"
										>
											{text("Logout")}
										</Link>
										{" / "}
										<Link
											className="reset-user"
											onClick={() => {
												this.props.resetUser();
											}}
											data-testid="switch"
										>
											{text("Switch user")}
										</Link>
									</div>
								}
							/>
						</Col>
						<Col span={4} className="close">
							<IconButton
								iconProps={{ iconName: "cancel" }}
								onClick={() => {
									this.props.onDismiss();
								}}
								data-testid="dismiss"
							/>
						</Col>
					</Row>
				)}
			>
				<SectionComponent title={text("Appointments for today")}>
					{this.props.todayAppointments.length === 0 ? (
						<MessageBar
							messageBarType={MessageBarType.info}
							data-testid="no-appointments"
						>
							{text("No appointments today")}
						</MessageBar>
					) : (
						<div
							className="appointments-listing"
							data-testid="appointments-list"
						>
							{
								<AppointmentsListNoDate
									appointments={this.props.todayAppointments}
									onClick={id =>
										(this.selectedAppointmentId = id)
									}
									dateFormat={this.props.dateFormat}
									onDeleteAppointment={() => {}}
									canDelete={false}
								/>
							}
						</div>
					)}
				</SectionComponent>
				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => (this.selectedAppointmentId = "")}
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
						doDeleteAppointment={id => {
							this.props.doDeleteAppointment(id);
							this.selectedAppointmentId = "";
						}}
					/>
				) : (
					""
				)}
			</Panel>
		);
	}
}
