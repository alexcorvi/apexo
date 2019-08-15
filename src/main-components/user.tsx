import {
	AppointmentsListNoDate,
	Col,
	PanelTabs,
	ProfileComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment, PrescriptionItem, StaffMember } from "@modules";
import * as modules from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
	IconButton,
	Link,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	Shimmer
	} from "office-ui-fabric-react";
import { PrimaryButton } from "office-ui-fabric-react";
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
				isOpen={core.router.selectedMain === "user"}
				onDismiss={() => core.user.hide()}
				data-testid="user-panel"
				onRenderNavigation={() => (
					<div className="panel-heading">
						<Row>
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
						<PanelTabs
							currentSelectedKey={core.router.selectedTab}
							onSelect={key => {
								core.router.selectTab(key);
							}}
							items={[
								{
									key: "today",
									icon: "GotoToday",
									title: "Appointments for Today"
								},
								{
									key: "tomorrow",
									icon: "Calendar",
									title: "Appointments for Tomorrow"
								},
								{
									key: "actions",
									icon: "Lock",
									title: "Actions"
								}
							]}
						/>
					</div>
				)}
			>
				{core.router.selectedTab === "today" ? (
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
										appointments={
											core.user.todayAppointments
										}
										onClick={id => {
											this.selectedAppointmentId = id;
											core.router.selectSub("details");
										}}
										canDelete={false}
									/>
								}
							</div>
						)}
					</SectionComponent>
				) : (
					""
				)}

				{core.router.selectedTab === "tomorrow" ? (
					<SectionComponent title={text("Appointments for tomorrow")}>
						{core.user.tomorrowAppointments.length === 0 ? (
							<MessageBar
								messageBarType={MessageBarType.info}
								data-testid="no-appointments"
							>
								{text("No appointments for tomorrow")}
							</MessageBar>
						) : (
							<div
								className="appointments-listing"
								data-testid="appointments-list"
							>
								{
									<AppointmentsListNoDate
										appointments={
											core.user.tomorrowAppointments
										}
										onClick={id => {
											this.selectedAppointmentId = id;
											core.router.selectSub("details");
										}}
										canDelete={false}
									/>
								}
							</div>
						)}
					</SectionComponent>
				) : (
					""
				)}

				{core.router.selectedTab === "actions" ? (
					<div className="m-t-20" style={{ textAlign: "center" }}>
						<PrimaryButton
							className="m-5"
							text={text("Logout")}
							iconProps={{ iconName: "lock" }}
							onClick={() => core.status.logout()}
						/>
						<DefaultButton
							iconProps={{ iconName: "ContactInfo" }}
							className="m-5"
							text={text("Switch user")}
							onClick={() => core.status.resetUser()}
						/>
					</div>
				) : (
					""
				)}

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
			</Panel>
		);
	}
}
