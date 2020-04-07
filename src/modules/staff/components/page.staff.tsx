import {
	Col,
	DataTableComponent,
	LastNextAppointment,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TableActions
	} from "@common-components";
import * as core from "@core";
import { text } from "@core";
import * as modules from "@modules";
import { AppointmentsList } from "@modules";
import { dateNames, formatDate, num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Checkbox,
	Icon,
	IconButton,
	Label,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PersonaInitialsColor,
	Shimmer,
	TextField,
	Toggle
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
export class StaffPage extends React.Component {
	@observable selectedAppointmentId: string = "";

	@computed get canEdit() {
		return core.user.currentUser!.canEditStaff;
	}

	@computed get sameUser() {
		return (
			core.user.currentUser!._id ===
			(this.selectedMember || { _id: "" })._id
		);
	}

	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			x => x._id === this.selectedAppointmentId
		);
	}

	@computed
	get selectedMember() {
		return modules.staff!.docs.find(x => x._id === core.router.selectedID);
	}

	tabs = [
		{
			key: "details",
			title: "Staff Member Details",
			icon: "DietPlanNotebook"
		},
		{
			key: "permission",
			title: "Level and Permission",
			icon: "Permissions"
		},
		{
			key: "appointments",
			title: "Upcoming Appointments",
			icon: "Calendar",
			hidden: !core.user.currentUser!.canViewAppointments
		},
		{
			key: "delete",
			title: "Delete",
			icon: "Trash",
			hidden: !this.canEdit
		}
	];

	render() {
		return (
			<div className="staff-component">
				<DataTableComponent
					maxItemsOnLoad={10}
					heads={[
						text("Staff Member"),
						text("Last/Next Appointment"),
						text("Contact Details")
					]}
					rows={modules.staff!.docs.map(member => ({
						id: member._id,
						searchableString: member.searchableString,
						actions: this.tabs
							.filter(x => !x.hidden)
							.map(x => ({
								key: x.key,
								title: x.title,
								icon: x.icon,
								onClick: () => {
									if (x.key === "delete") {
										modules.staff!.deleteModal(member._id);
									} else {
										core.router.select({
											id: member._id,
											tab: x.key
										});
									}
								}
							})),
						cells: [
							{
								dataValue: member.name,
								component: (
									<div>
										<ProfileComponent
											name={member.name}
											secondaryElement={
												<span className="itl">
													{
														member
															.upcomingAppointments
															.length
													}{" "}
													{text(
														"upcoming appointments"
													)}
												</span>
											}
											size={3}
										/>
										<br />
									</div>
								),
								className: "no-label",
								onClick: () => {
									core.router.select({
										id: member._id,
										tab: "details"
									});
								}
							},
							{
								dataValue: (
									member.lastAppointment ||
									member.nextAppointment || {
										date: 0
									}
								).date,
								component: (
									<LastNextAppointment
										lastAppointment={member.lastAppointment}
										nextAppointment={member.nextAppointment}
										onClick={id => {
											this.selectedAppointmentId = id;
											core.router.select({
												sub: "details"
											});
										}}
									></LastNextAppointment>
								),
								className: "hidden-xs"
							},
							{
								dataValue: member.phone || member.email,
								component: (
									<div>
										<ProfileSquaredComponent
											text={member.phone}
											subText={
												member.phone
													? text("Phone number")
													: text("No phone number")
											}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="Phone" />
											)}
											initialsColor={
												member.phone
													? PersonaInitialsColor.teal
													: PersonaInitialsColor.transparent
											}
										/>
										<ProfileSquaredComponent
											text={member.email}
											subText={
												member.email
													? text("Email")
													: text("No Email")
											}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="Mail" />
											)}
											initialsColor={
												member.email
													? PersonaInitialsColor.teal
													: PersonaInitialsColor.transparent
											}
										/>
									</div>
								),
								className: "hidden-xs"
							}
						]
					}))}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () => {
											const member = modules.staff!.new();
											modules.staff!.add(member);
											core.router.select({
												id: member._id,
												tab: "details"
											});
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
				/>

				{this.selectedMember &&
				["appointments", "details", "delete", "permission"].indexOf(
					core.router.selectedTab
				) > -1 ? (
					<Panel
						isOpen={!!this.selectedMember}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => (
							<div className="panel-heading">
								<PanelTop
									title={this.selectedMember!.name}
									type={"Staff Member"}
									onDismiss={() => core.router.unSelect()}
								/>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={key => {
										core.router.select({ tab: key });
									}}
									items={this.tabs}
								/>
							</div>
						)}
					>
						<div className="staff-editor">
							{core.router.selectedTab === "details" ? (
								<div>
									<SectionComponent
										title={text(`Basic Info`)}
									>
										<div className="staff-input">
											<TextField
												label={text("Name")}
												value={this.selectedMember.name}
												onChange={(ev, val) =>
													(this.selectedMember!.name = val!)
												}
												disabled={!this.canEdit}
												data-testid="staff-name"
											/>
										</div>

										<div className="staff-input">
											<Label>
												{text("Days on duty")}
											</Label>
											{dateNames
												.days()
												.map((day, x) => {
													const y = Number(
														modules.setting!.getSetting(
															"weekend_num"
														)
													);
													return {
														el: (
															<Checkbox
																className="day-selector"
																key={day}
																disabled={
																	!this
																		.canEdit
																}
																label={text(
																	dateNames.daysShort()[
																		x
																	]
																)}
																checked={
																	this.selectedMember!.onDutyDays.indexOf(
																		day
																	) > -1
																}
																onChange={(
																	ev,
																	checked
																) => {
																	if (
																		checked
																	) {
																		this.selectedMember!.onDutyDays.push(
																			day
																		);
																	} else {
																		this.selectedMember!.onDutyDays.splice(
																			this.selectedMember!.onDutyDays.indexOf(
																				day
																			),
																			1
																		);
																	}
																}}
															/>
														),
														s:
															x > y
																? x - y
																: x + y + 7
													};
												})
												.sort((a, b) => {
													return a.s - b.s;
												})
												.map(x => x.el)}
										</div>
									</SectionComponent>

									<SectionComponent
										title={text(`Contact Details`)}
									>
										<Row gutter={8}>
											<Col sm={12}>
												<div className="staff-input">
													<TextField
														label={text(
															"Phone number"
														)}
														value={
															this.selectedMember
																.phone
														}
														onChange={(ev, val) =>
															(this.selectedMember!.phone = val!)
														}
														disabled={!this.canEdit}
														data-testid="phone-number"
													/>
												</div>
											</Col>
											<Col sm={12}>
												<div className="staff-input">
													<TextField
														label={text("Email")}
														value={
															this.selectedMember
																.email
														}
														onChange={(ev, val) =>
															(this.selectedMember!.email = val!)
														}
														disabled={!this.canEdit}
														data-testid="email"
													/>
												</div>
											</Col>
										</Row>
									</SectionComponent>
								</div>
							) : (
								""
							)}

							{core.router.selectedTab === "permission" ? (
								<div>
									{this.selectedMember._id ===
									core.user.currentUser!._id ? (
										<SectionComponent
											title={text(`Login PIN`)}
										>
											<div className="staff-input">
												<TextField
													id="login-pin"
													label={text("Login PIN")}
													value={
														this.selectedMember.pin
													}
													onChange={(ev, v) => {
														if (num(v!) < 10000) {
															this.selectedMember!.pin = v!.toString();
														} else {
															this.forceUpdate();
														}
													}}
													type="number"
													max={9999}
												/>
											</div>
											<MessageBar
												messageBarType={
													MessageBarType.info
												}
											>
												{text(
													"Only you can edit this PIN, and it can only be 4 numbers"
												)}
											</MessageBar>
										</SectionComponent>
									) : (
										""
									)}
									<SectionComponent
										title={text(`Permission`)}
									>
										{this.sameUser ? (
											<div>
												<MessageBar
													messageBarType={
														MessageBarType.warning
													}
												>
													{text(
														"You can't edit your own level and permissions"
													)}
												</MessageBar>
												<br />
											</div>
										) : (
											""
										)}
										<Toggle
											checked={
												this.selectedMember.operates
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text(
												"Operates on patients"
											)}
											offText={text(
												"Doesn't operate on patients"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.operates = newVal!;
											}}
										/>

										<Toggle
											checked={
												this.selectedMember.canViewStaff
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text("Can view staff page")}
											offText={text(
												"Can not view staff page"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.canViewStaff = newVal!;
											}}
										/>
										<Toggle
											checked={
												this.selectedMember
													.canViewPatients
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text(
												"Can view patients page"
											)}
											offText={text(
												"Can not view patients page"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.canViewPatients = newVal!;
											}}
										/>
										{modules.setting!.getSetting(
											"module_orthodontics"
										) ? (
											<Toggle
												checked={
													this.selectedMember
														.canViewOrtho
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can view orthodontics page"
												)}
												offText={text(
													"Can not view orthodontics page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canViewOrtho = newVal!;
												}}
											/>
										) : (
											""
										)}
										<Toggle
											checked={
												this.selectedMember
													.canViewAppointments
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text(
												"Can view appointments page"
											)}
											offText={text(
												"Can not view appointments page"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.canViewAppointments = newVal!;
											}}
										/>
										<Toggle
											checked={
												this.selectedMember
													.canViewTreatments
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text(
												"Can view treatments page"
											)}
											offText={text(
												"Can not view treatments page"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.canViewTreatments = newVal!;
											}}
										/>
										{modules.setting!.getSetting(
											"module_prescriptions"
										) ? (
											<Toggle
												checked={
													this.selectedMember
														.canViewPrescriptions
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can view prescriptions page"
												)}
												offText={text(
													"Can not view prescriptions page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canViewPrescriptions = newVal!;
												}}
											/>
										) : (
											""
										)}
										{modules.setting!.getSetting(
											"module_statistics"
										) ? (
											<Toggle
												checked={
													this.selectedMember
														.canViewStats
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can view statistics page"
												)}
												offText={text(
													"Can not view statistics page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canViewStats = newVal!;
												}}
											/>
										) : (
											""
										)}

										<Toggle
											checked={
												this.selectedMember
													.canViewSettings
											}
											disabled={
												this.sameUser || !this.canEdit
											}
											onText={text(
												"Can view settings page"
											)}
											offText={text(
												"Can not view settings page"
											)}
											onChange={(ev, newVal) => {
												this.selectedMember!.canViewSettings = newVal!;
											}}
										/>

										{this.selectedMember.canViewStaff ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditStaff
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit staff page"
												)}
												offText={text(
													"Can not edit staff page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditStaff = newVal!;
												}}
											/>
										) : (
											""
										)}
										{this.selectedMember.canViewPatients ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditPatients
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit patients page"
												)}
												offText={text(
													"Can not edit patients page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditPatients = newVal!;
												}}
											/>
										) : (
											""
										)}

										{modules.setting!.getSetting(
											"module_orthodontics"
										) &&
										this.selectedMember.canViewOrtho ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditOrtho
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit orthodontics page"
												)}
												offText={text(
													"Can not edit orthodontics page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditOrtho = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.selectedMember
											.canViewAppointments ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditAppointments
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit appointments page"
												)}
												offText={text(
													"Can not edit appointments page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditAppointments = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.selectedMember
											.canViewTreatments ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditTreatments
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit treatments page"
												)}
												offText={text(
													"Can not edit treatments page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditTreatments = newVal!;
												}}
											/>
										) : (
											""
										)}

										{modules.setting!.getSetting(
											"module_prescriptions"
										) &&
										this.selectedMember
											.canViewPrescriptions ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditPrescriptions
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit prescriptions page"
												)}
												offText={text(
													"Can not edit prescriptions page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditPrescriptions = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.selectedMember.canViewSettings ? (
											<Toggle
												checked={
													this.selectedMember
														.canEditSettings
												}
												disabled={
													this.sameUser ||
													!this.canEdit
												}
												onText={text(
													"Can edit settings page"
												)}
												offText={text(
													"Can not edit settings page"
												)}
												onChange={(ev, newVal) => {
													this.selectedMember!.canEditSettings = newVal!;
												}}
											/>
										) : (
											""
										)}
									</SectionComponent>
								</div>
							) : (
								""
							)}

							{core.router.selectedTab === "appointments" ? (
								<SectionComponent
									title={text(`Upcoming Appointments`)}
								>
									{this.selectedMember.upcomingAppointments
										.length ? (
										<AppointmentsList
											list={
												this.selectedMember
													.upcomingAppointments
											}
										/>
									) : (
										<MessageBar
											messageBarType={MessageBarType.info}
										>
											{text(
												"There are no upcoming appointments for this staff member"
											)}
										</MessageBar>
									)}
								</SectionComponent>
							) : (
								""
							)}

							{core.router.selectedTab === "delete" ? (
								<div>
									<br />
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										{text(
											"Are you sure you want to delete"
										)}
									</MessageBar>
									<br />
									<PrimaryButton
										className="delete"
										iconProps={{
											iconName: "delete"
										}}
										text={text("Delete")}
										onClick={() => {
											modules.staff!.delete(
												core.router.selectedID
											);

											core.router.unSelect();
										}}
									/>
								</div>
							) : (
								""
							)}
						</div>
					</Panel>
				) : (
					""
				)}

				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => (this.selectedAppointmentId = "")}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
