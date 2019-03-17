import * as React from "react";
import { API } from "../";
import { AppointmentThumb } from "../../assets/components/appointment-thumb/appointment-thumb";
import { Col, Row } from "../../assets/components/grid";
import {
	IconButton,
	TextField,
	Link,
	Panel,
	PanelType
} from "office-ui-fabric-react";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Profile } from "../../assets/components/profile/profile";
import { user } from "./data.user";
import "./user.scss";
import { lang } from "../i18/i18";

@observer
export class UserComponent extends React.Component<{}, {}> {
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
										</Link>{" "}
										<Link
											className="reset-user"
											onClick={() => {
												API.login.resetUser();
											}}
										>
											{lang("Switch User")}
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
				<br />
				<br />
				<h3>
					{this.todayAppointments.length
						? lang(`Today's Appointments`)
						: lang("No Appointments today")}
				</h3>
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
									API.router.go(["appointments", dateLink]);
									user.visible = false;
								}}
							/>
						);
					})}
				</div>
			</Panel>
		);
	}
}
