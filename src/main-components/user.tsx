import { Col, ProfileComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import { Appointment, AppointmentThumbComponent } from "@modules";
import { observable } from "mobx";
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
	onLogout: () => void;
	onResetUser: () => void;
}> {
	@observable appointment: Appointment | null = null;

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
												this.props.onLogout();
											}}
										>
											{text("Logout")}
										</Link>
										{" / "}
										<Link
											className="reset-user"
											onClick={() => {
												this.props.onResetUser();
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
									this.props.onDismiss();
								}}
							/>
						</Col>
					</Row>
				)}
			>
				<SectionComponent title={text("Today's Appointments")}>
					{this.props.todayAppointments.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{text("No appointments today")}
						</MessageBar>
					) : (
						<div className="appointments-listing">
							{this.props.todayAppointments.map(appointment => {
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
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => (this.appointment = null)}
						onDelete={() => (this.appointment = null)}
					/>
				) : (
					""
				)}
			</Panel>
		);
	}
}
