import * as React from "react";
import { API } from "../";
import { AppointmentThumb } from "../../assets/components/appointment-thumb/appointment-thumb";
import { Col, Row } from "../../assets/components/grid";
import {
	IconButton,
	TextField,
	Link,
	Panel,
	PanelType,
	MessageBar,
	MessageBarType
} from "office-ui-fabric-react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Profile } from "../../assets/components/profile/profile";
import { user } from "./data.user";
import "./user.scss";
import { lang } from "../i18/i18";
import { Section } from "../../assets/components/section/section";
import { AppointmentEditor } from "../../modules/appointments/components";
import { Appointment } from "../../modules/appointments/data";

@observer
export class UserComponent extends React.Component<{}, {}> {
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
							<Profile
								name={user.currentUser.name}
								size={3}
								secondaryElement={
									<div>
										<Link
											onClick={() => {
												API.login.logout();
											}}
										>
											{lang("Logout")}
										</Link>
										{" / "}
										<Link
											className="reset-user"
											onClick={() => {
												API.login.resetUser();
											}}
										>
											{lang("Switch user")}
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
				<Section title={lang("Today's Appointments")}>
					{this.todayAppointments.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{lang("No appointments today")}
						</MessageBar>
					) : (
						<div className="appointments-listing">
							{this.todayAppointments.map(appointment => {
								const date = new Date(appointment.date);
								const dateLink = `${date.getFullYear()}-${date.getMonth() +
									1}-${date.getDate()}`;
								return (
									<AppointmentThumb
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
				</Section>
				<AppointmentEditor
					appointment={this.appointment}
					onDismiss={() => (this.appointment = null)}
					onDelete={() => (this.appointment = null)}
				/>
			</Panel>
		);
	}
}
