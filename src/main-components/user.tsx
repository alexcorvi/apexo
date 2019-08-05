import { AppointmentsListNoDate, Col, ProfileComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment, PrescriptionItem, StaffMember } from "@modules";
import * as modules from "@modules";
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
export class UserPanelView extends React.Component {
	@observable selectedAppointmentId: string = "";
	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			x => x._id === this.selectedAppointmentId
		);
	}

	render() {
		return (
			<Panel
				className="user-component"
				type={PanelType.medium}
				isLightDismiss
				isOpen={core.user.isVisible}
				onDismiss={() => core.user.hide()}
				onRenderNavigation={() => (
					<Row className="panel-heading">
						<Col span={20}>
							<ProfileComponent
								name={core.user.currentUser!.name}
								size={3}
								secondaryElement={
									<div>
										<Link
											onClick={() => {
												core.status.logout();
											}}
											data-testid="logout"
										>
											{text("Logout")}
										</Link>
										{" / "}
										<Link
											className="reset-user"
											onClick={() => {
												core.status.resetUser();
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
									core.user.hide();
								}}
								data-testid="dismiss"
							/>
						</Col>
					</Row>
				)}
			>
				<SectionComponent title={text("Appointments for today")}>
					{core.user.todayAppointments.length === 0 ? (
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
									appointments={core.user.todayAppointments}
									onClick={id =>
										(this.selectedAppointmentId = id)
									}
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
					/>
				) : (
					""
				)}
			</Panel>
		);
	}
}
