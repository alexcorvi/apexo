import * as core from "@core";
import { text } from "@core";
import * as modules from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	AppointmentsListNoDate,
	PanelTabs,
	PanelTop,
	SectionComponent,
} from "@common-components";
import {
	DefaultButton,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	Shimmer,
} from "office-ui-fabric-react";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />,
});

@observer
export class UserPanelView extends React.Component {
	@observable selectedAppointmentId: string = "";
	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			(x) => x._id === this.selectedAppointmentId
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
						<PanelTop
							title={core.user.currentUser!.name}
							type={text("staff member").c}
							onDismiss={() => core.user.hide()}
						/>
						<PanelTabs
							currentSelectedKey={core.router.selectedTab}
							onSelect={(key) => {
								core.router.select({ tab: key });
							}}
							items={[
								{
									key: "today",
									icon: "GotoToday",
									title: text("appointments for today").h,
								},
								{
									key: "upcoming",
									icon: "Calendar",
									title: text("upcoming appointments").c,
								},
								{
									key: "actions",
									icon: "Lock",
									title: text("actions").h,
								},
							]}
						/>
					</div>
				)}
			>
				{core.router.selectedTab === "today" ? (
					<SectionComponent title={text("appointments for today").h}>
						{core.user.todayAppointments.length === 0 ? (
							<MessageBar
								messageBarType={MessageBarType.info}
								data-testid="no-appointments"
							>
								{text("no appointments today").c}
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
										onClick={(id) => {
											this.selectedAppointmentId = id;
											core.router.select({
												sub: "details",
											});
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

				{core.router.selectedTab === "upcoming" ? (
					<SectionComponent
						title={text("all upcoming appointments").c}
					>
						{core.user.currentUser!.upcomingAppointments.length ===
						0 ? (
							<MessageBar
								messageBarType={MessageBarType.info}
								data-testid="no-appointments"
							>
								{text("no upcoming appointments").c}
							</MessageBar>
						) : (
							<div
								className="appointments-listing"
								data-testid="appointments-list"
							>
								{
									<AppointmentsListNoDate
										appointments={
											core.user.currentUser!
												.upcomingAppointments
										}
										onClick={(id) => {
											this.selectedAppointmentId = id;
											core.router.select({
												sub: "details",
											});
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
							text={text("logout").c}
							iconProps={{ iconName: "lock" }}
							onClick={() => core.status.logout()}
							data-testid="logout"
						/>
						<DefaultButton
							iconProps={{ iconName: "ContactInfo" }}
							className="m-5"
							text={text("switch user").c}
							onClick={() => core.status.resetUser()}
							data-testid="switch"
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
