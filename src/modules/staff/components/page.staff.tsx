import {
	Col,
	DataTableComponent,
	PanelTabs,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TableActions
	} from "@common-components";
import { text } from "@core";
import { Appointment, AppointmentsList, PrescriptionItem, StaffMember } from "@modules";
import { dateNames, formatDate, num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Checkbox,
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PersonaInitialsColor,
	TextField,
	Toggle
	} from "office-ui-fabric-react";
import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class StaffPage extends React.Component<{
	currentUser: StaffMember;
	currentLocation: string;
	staffMembers: StaffMember[];
	dateFormat: string;
	enabledPrescriptions: boolean;
	enabledStatistics: boolean;
	enabledOrthodontics: boolean;
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	currencySymbol: string;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	onDeleteStaff: (id: string) => void;
	onAddStaff: (member: StaffMember) => void;
	onDeleteAppointment: (id: string) => void;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	doDeleteStaff: (id: string) => void;
}> {
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
			hidden: !this.props.currentUser.canViewAppointments
		},
		{
			key: "delete",
			title: "Delete",
			icon: "Trash",
			hidden: !this.canEdit,
			hiddenOnPanel: true
		}
	];

	@observable selectedId: string = this.props.currentLocation.split("/")[1];
	@observable viewWhich:
		| ""
		| "details"
		| "permission"
		| "appointments"
		| "delete" = "";

	@computed get canEdit() {
		return this.props.currentUser.canEditStaff;
	}

	@computed get sameUser() {
		return (
			this.props.currentUser._id ===
			(this.selectedMember || { _id: "" })._id
		);
	}

	@computed
	get selectedMember() {
		return this.props.staffMembers.find(x => x._id === this.selectedId);
	}

	render() {
		return (
			<div className="staff-component p-15 p-l-10 p-r-10">
				<Row gutter={16}>
					<Col lg={16}>
						<DataTableComponent
							maxItemsOnLoad={10}
							heads={[
								text("Staff Member"),
								text("Last/Next Appointment"),
								text("Contact Details")
							]}
							rows={this.props.staffMembers.map(member => ({
								id: member._id,
								searchableString: member.searchableString,
								cells: [
									{
										dataValue: member.name,
										component: (
											<div>
												<ProfileComponent
													name={member.name}
													secondaryElement={
														<span>
															{
																member
																	.nextAppointments
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
												<TableActions
													items={this.tabs}
													onSelect={key => {
														if (key === "delete") {
															this.props.onDeleteStaff(
																member._id
															);
														} else {
															this.selectedId =
																member._id;
															this.viewWhich = key as any;
														}
													}}
												/>
											</div>
										),
										className: "no-label",
										onClick: () => {
											this.selectedId = member._id;
											this.viewWhich = "details";
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
											<div>
												<ProfileSquaredComponent
													text={
														member.lastAppointment
															? member
																	.lastAppointment
																	.treatment
																? member
																		.lastAppointment
																		.treatment
																		.type
																: ""
															: ""
													}
													subText={
														member.lastAppointment
															? formatDate(
																	member
																		.lastAppointment
																		.date,
																	this.props
																		.dateFormat
															  )
															: text(
																	"No last appointment"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Previous" />
													)}
													onClick={() => {}}
													initialsColor={
														member.lastAppointment
															? undefined
															: PersonaInitialsColor.transparent
													}
												/>
												<br />
												<ProfileSquaredComponent
													text={
														member.nextAppointment
															? member
																	.nextAppointment
																	.treatment
																? member
																		.nextAppointment
																		.treatment
																		.type
																: ""
															: ""
													}
													subText={
														member.nextAppointment
															? formatDate(
																	member
																		.nextAppointment
																		.date,
																	this.props
																		.dateFormat
															  )
															: text(
																	"No next appointment"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Next" />
													)}
													onClick={() => {}}
													initialsColor={
														member.nextAppointment
															? undefined
															: PersonaInitialsColor.transparent
													}
												/>
											</div>
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
															? text(
																	"Phone number"
															  )
															: text(
																	"No phone number"
															  )
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
													const member = new StaffMember();
													this.props.onAddStaff(
														member
													);
													this.selectedId =
														member._id;
													this.viewWhich = "details";
												},
												iconProps: {
													iconName: "Add"
												}
											}
									  ]
									: []
							}
						/>
					</Col>
					<Col lg={8}>
						<table className="ms-table duty-table">
							<tbody>
								{dateNames.days().map(dayName => {
									return (
										<tr key={dayName}>
											<th className="day-name">
												{text(dayName)}
											</th>
											<td>
												{this.props.staffMembers
													.filter(
														member =>
															member.onDutyDays.indexOf(
																dayName
															) !== -1
													)
													.map(member => {
														return (
															<ProfileComponent
																className="m-b-5"
																size={3}
																key={member._id}
																name={
																	member.name
																}
																secondaryElement={
																	<span>
																		{
																			(
																				member
																					.weeksAppointments[
																					dayName
																				] ||
																				[]
																			)
																				.length
																		}{" "}
																		{text(
																			"appointments for"
																		)}{" "}
																		{text(
																			dayName
																		)}
																	</span>
																}
																onClick={() => {
																	this.selectedId =
																		member._id;
																}}
															/>
														);
													})}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Col>
				</Row>

				{this.selectedMember && this.viewWhich ? (
					<Panel
						isOpen={!!this.selectedMember}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedId = "";
							this.viewWhich = "";
						}}
						onRenderNavigation={() => (
							<div className="panel-heading">
								<Row>
									<Col span={20}>
										{this.selectedMember!.name ? (
											<ProfileComponent
												name={this.selectedMember!.name}
												size={2}
											/>
										) : (
											<p />
										)}
									</Col>
									<Col span={4} className="close">
										<IconButton
											iconProps={{ iconName: "cancel" }}
											onClick={() => {
												this.selectedId = "";
											}}
										/>
									</Col>
								</Row>
								<PanelTabs
									currentSelectedKey={this.viewWhich}
									onSelect={key => {
										this.viewWhich = key as any;
									}}
									items={this.tabs}
								/>
							</div>
						)}
					>
						<div className="staff-editor">
							{this.viewWhich === "details" ? (
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
											/>
										</div>

										<div className="staff-input">
											<label>
												{text("Days on duty")}
											</label>
											{dateNames.days().map((day, i) => {
												return (
													<Checkbox
														key={day}
														disabled={!this.canEdit}
														label={
															dateNames.daysShort()[
																i
															]
														}
														checked={
															this.selectedMember!.onDutyDays.indexOf(
																day
															) > -1
														}
														onChange={(
															ev,
															checked
														) => {
															if (checked) {
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
															this.selectedMember!
																.triggerUpdate++;
														}}
													/>
												);
											})}
										</div>
									</SectionComponent>

									<SectionComponent
										title={text(`Contact Details`)}
									>
										<Row gutter={12}>
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
													/>
												</div>
											</Col>
										</Row>
									</SectionComponent>
								</div>
							) : (
								""
							)}

							{this.viewWhich === "permission" ? (
								<div>
									{this.selectedMember._id ===
									this.props.currentUser._id ? (
										<SectionComponent
											title={text(`Login PIN`)}
										>
											<div className="staff-input">
												<TextField
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
													onClick={() => {}}
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
											defaultChecked={
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
											defaultChecked={
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
											defaultChecked={
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
										{this.props.enabledOrthodontics ? (
											<Toggle
												defaultChecked={
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
											defaultChecked={
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
											defaultChecked={
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
										{this.props.enabledPrescriptions ? (
											<Toggle
												defaultChecked={
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
										{this.props.enabledStatistics ? (
											<Toggle
												defaultChecked={
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
											defaultChecked={
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
												defaultChecked={
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
												defaultChecked={
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

										{this.props.enabledOrthodontics &&
										this.selectedMember.canViewOrtho ? (
											<Toggle
												defaultChecked={
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
												defaultChecked={
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
												defaultChecked={
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

										{this.props.enabledPrescriptions &&
										this.selectedMember
											.canViewPrescriptions ? (
											<Toggle
												defaultChecked={
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
												defaultChecked={
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

							{this.viewWhich === "appointments" ? (
								<SectionComponent
									title={text(`Upcoming Appointments`)}
								>
									{this.selectedMember.nextAppointments
										.length ? (
										<AppointmentsList
											list={
												this.selectedMember
													.nextAppointments
											}
											currentUser={this.props.currentUser}
											dateFormat={this.props.dateFormat}
											onDeleteAppointment={id =>
												this.props.onDeleteAppointment(
													id
												)
											}
											availableTreatments={
												this.props.availableTreatments
											}
											availablePrescriptions={
												this.props
													.availablePrescriptions
											}
											appointmentsForDay={(
												year,
												month,
												day
											) =>
												this.props.appointmentsForDay(
													year,
													month,
													day
												)
											}
											currencySymbol={
												this.props.currencySymbol
											}
											prescriptionsEnabled={
												this.props.enabledPrescriptions
											}
											timeTrackingEnabled={
												this.props.timeTrackingEnabled
											}
											operatingStaff={
												this.props.operatingStaff
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

							{this.viewWhich === "delete" ? (
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
											this.props.doDeleteStaff(
												this.selectedId
											);

											this.selectedId = "";
											this.viewWhich = "";
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
			</div>
		);
	}
}
