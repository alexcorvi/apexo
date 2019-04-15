import { AsyncComponent, Col, ProfileComponent, Row, SectionComponent } from "@common-components";
import { status, text, user } from "@core";
import { Appointment, AppointmentThumbComponent } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	IconButton,
	Link,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class UserPanelView extends React.Component<{}, {}> {
	@observable appointment: Appointment | null = null;

	@computed
	get todayAppointments() {
		if (!user.currentUser) {
			return [];
		} else if (user.todayAppointments) {
			return user.todayAppointments;
		} else {
			return [];
		}
	}

	render() {
		return (
			<Panel
				className="user-component"
				type={PanelType.medium}
				isLightDismiss
				isOpen={user.visible}
				onDismiss={() => (user.visible = false)}
				onRenderNavigation={() => (
					<Row className="panel-heading">
						<Col span={20}>
							<ProfileComponent
								name={user.currentUser.name}
								size={3}
								secondaryElement={
									<div>
										<Link
											onClick={() => {
												status.logout();
											}}
										>
											{text("Logout")}
										</Link>
										{" / "}
										<Link
											className="reset-user"
											onClick={() => {
												status.resetUser();
											}}
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
									user.visible = false;
								}}
							/>
						</Col>
					</Row>
				)}
			>
				<SectionComponent title={text("Today's Appointments")}>
					{this.todayAppointments.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{text("No appointments today")}
						</MessageBar>
					) : (
						<div className="appointments-listing">
							{this.todayAppointments.map(appointment => {
								const date = new Date(appointment.date);
								const dateLink = `${date.getFullYear()}-${date.getMonth() +
									1}-${date.getDate()}`;
								return (
									<AppointmentThumbComponent
										key={appointment._id}
										appointment={appointment}
										hideDate={true}
										showPatient={true}
										onClick={() => {
											this.appointment = appointment;
										}}
									/>
								);
							})}
						</div>
					)}
				</SectionComponent>
				{this.appointment ? (
					<AsyncComponent
						key="ae"
						loader={async () => {
							const AppointmentEditorPanel = (await import("../modules/appointments/components/appointment-editor"))
								.AppointmentEditorPanel;
							return (
								<AppointmentEditorPanel
									appointment={this.appointment}
									onDismiss={() => (this.appointment = null)}
									onDelete={() => (this.appointment = null)}
								/>
							);
						}}
					/>
				) : (
					""
				)}
			</Panel>
		);
	}
}
