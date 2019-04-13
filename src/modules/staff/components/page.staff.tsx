import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { router, text, user } from "@core";
import { AppointmentsList, setting, staff, StaffMember } from "@modules";
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
	Toggle,
	TooltipHost
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class StaffPage extends React.Component<{}, {}> {
	@observable selectedId: string = router.currentLocation.split("/")[1];
	@observable viewWhich: number = 1;

	@computed get canEdit() {
		return user.currentUser.canEditStaff;
	}

	@computed
	get selectedMemberIndex() {
		return staff.getIndexByID(this.selectedId);
	}

	@computed
	get member() {
		return staff.list[this.selectedMemberIndex];
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
							rows={staff.list.map(member => ({
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
												<TooltipHost
													content={text(
														"Staff Member Details"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"DietPlanNotebook"
														}}
														onClick={() => {
															this.selectedId =
																member._id;
															this.viewWhich = 1;
														}}
													/>
												</TooltipHost>

												<TooltipHost
													content={text(
														"Level and Permission"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"Permissions"
														}}
														onClick={() => {
															this.selectedId =
																member._id;
															this.viewWhich = 2;
														}}
													/>
												</TooltipHost>

												{user.currentUser
													.canViewAppointments ? (
													<TooltipHost
														content={text(
															"Upcoming Appointments"
														)}
													>
														<IconButton
															className="action-button"
															iconProps={{
																iconName:
																	"Calendar"
															}}
															onClick={() => {
																this.selectedId =
																	member._id;
																this.viewWhich = 3;
															}}
														/>
													</TooltipHost>
												) : (
													""
												)}
												<TooltipHost
													content={text("Delete")}
												>
													<IconButton
														className="action-button delete"
														iconProps={{
															iconName: "Trash"
														}}
														onClick={() =>
															staff.deleteModal(
																member._id
															)
														}
														disabled={!this.canEdit}
													/>
												</TooltipHost>
											</div>
										),
										className: "no-label"
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
																	setting.getSetting(
																		"date_format"
																	)
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
																	setting.getSetting(
																		"date_format"
																	)
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
													staff.list.push(member);
													this.selectedId =
														member._id;
													this.viewWhich = 1;
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
								{dateNames.days(true).map(dayName => {
									return (
										<tr key={dayName}>
											<th className="day-name">
												{text(dayName)}
											</th>
											<td>
												{staff.list
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

				{this.member && this.viewWhich ? (
					<Panel
						isOpen={!!this.member}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedId = "";
							this.viewWhich = 0;
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.member.name ? (
										<ProfileComponent
											name={this.member.name}
											secondaryElement={
												<span>
													{this.viewWhich === 1
														? text(
																"Staff Member Details"
														  )
														: ""}
													{this.viewWhich === 2
														? text(
																"Level and Permission"
														  )
														: ""}
													{this.viewWhich === 3
														? text(
																"Upcoming Appointments"
														  )
														: ""}
												</span>
											}
											tertiaryText={this.member.phone}
											size={3}
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
						)}
					>
						<div className="staff-editor">
							{this.viewWhich === 1 ? (
								<div>
									<SectionComponent
										title={text(`Basic Info`)}
									>
										<div className="staff-input">
											<TextField
												label={text("Name")}
												value={this.member.name}
												onChange={(ev, val) =>
													(this.member.name = val!)
												}
												disabled={!this.canEdit}
											/>
										</div>

										<div className="staff-input">
											<label>
												{text("Days on duty")}
											</label>
											{dateNames
												.days(true)
												.map((day, i) => {
													return (
														<Checkbox
															key={day}
															disabled={
																!this.canEdit
															}
															label={
																dateNames.daysShort()[
																	i
																]
															}
															checked={
																this.member.onDutyDays.indexOf(
																	day
																) > -1
															}
															onChange={(
																ev,
																checked
															) => {
																if (checked) {
																	this.member.onDutyDays.push(
																		day
																	);
																} else {
																	this.member.onDutyDays.splice(
																		this.member.onDutyDays.indexOf(
																			day
																		),
																		1
																	);
																}
																this.member
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
															this.member.phone
														}
														onChange={(ev, val) =>
															(this.member.phone = val!)
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
															this.member.email
														}
														onChange={(ev, val) =>
															(this.member.email = val!)
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

							{this.viewWhich === 2 ? (
								<div>
									{this.member._id ===
									user.currentUser._id ? (
										<SectionComponent
											title={text(`Login PIN`)}
										>
											<div className="staff-input">
												<TextField
													label={text("Login PIN")}
													value={this.member.pin}
													onChange={(ev, v) => {
														if (num(v!) < 10000) {
															this.member.pin = v!.toString();
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
										{this.member._id ===
										user.currentUser._id ? (
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
												this.member.operates
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text(
												"Operates on patients"
											)}
											offText={text(
												"Doesn't operate on patients"
											)}
											onChange={(ev, newVal) => {
												this.member.operates = newVal!;
											}}
										/>

										<Toggle
											defaultChecked={
												this.member.canViewStaff
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text("Can view staff page")}
											offText={text(
												"Can not view staff page"
											)}
											onChange={(ev, newVal) => {
												this.member.canViewStaff = newVal!;
											}}
										/>
										<Toggle
											defaultChecked={
												this.member.canViewPatients
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text(
												"Can view patients page"
											)}
											offText={text(
												"Can not view patients page"
											)}
											onChange={(ev, newVal) => {
												this.member.canViewPatients = newVal!;
											}}
										/>
										{setting.getSetting(
											"module_orthodontics"
										) ? (
											<Toggle
												defaultChecked={
													this.member.canViewOrtho
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can view orthodontics page"
												)}
												offText={text(
													"Can not view orthodontics page"
												)}
												onChange={(ev, newVal) => {
													this.member.canViewOrtho = newVal!;
												}}
											/>
										) : (
											""
										)}
										<Toggle
											defaultChecked={
												this.member.canViewAppointments
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text(
												"Can view appointments page"
											)}
											offText={text(
												"Can not view appointments page"
											)}
											onChange={(ev, newVal) => {
												this.member.canViewAppointments = newVal!;
											}}
										/>
										<Toggle
											defaultChecked={
												this.member.canViewTreatments
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text(
												"Can view treatments page"
											)}
											offText={text(
												"Can not view treatments page"
											)}
											onChange={(ev, newVal) => {
												this.member.canViewTreatments = newVal!;
											}}
										/>
										{setting.getSetting(
											"module_prescriptions"
										) ? (
											<Toggle
												defaultChecked={
													this.member
														.canViewPrescriptions
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can view prescriptions page"
												)}
												offText={text(
													"Can not view prescriptions page"
												)}
												onChange={(ev, newVal) => {
													this.member.canViewPrescriptions = newVal!;
												}}
											/>
										) : (
											""
										)}
										{setting.getSetting(
											"module_statistics"
										) ? (
											<Toggle
												defaultChecked={
													this.member.canViewStats
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can view statistics page"
												)}
												offText={text(
													"Can not view statistics page"
												)}
												onChange={(ev, newVal) => {
													this.member.canViewStats = newVal!;
												}}
											/>
										) : (
											""
										)}

										<Toggle
											defaultChecked={
												this.member.canViewSettings
											}
											disabled={
												this.member._id ===
												user.currentUser._id
											}
											onText={text(
												"Can view settings page"
											)}
											offText={text(
												"Can not view settings page"
											)}
											onChange={(ev, newVal) => {
												this.member.canViewSettings = newVal!;
											}}
										/>

										{this.member.canViewStaff ? (
											<Toggle
												defaultChecked={
													this.member.canEditStaff
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit staff page"
												)}
												offText={text(
													"Can not edit staff page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditStaff = newVal!;
												}}
											/>
										) : (
											""
										)}
										{this.member.canViewPatients ? (
											<Toggle
												defaultChecked={
													this.member.canEditPatients
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit patients page"
												)}
												offText={text(
													"Can not edit patients page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditPatients = newVal!;
												}}
											/>
										) : (
											""
										)}

										{setting.getSetting(
											"module_orthodontics"
										) && this.member.canViewOrtho ? (
											<Toggle
												defaultChecked={
													this.member.canEditOrtho
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit orthodontics page"
												)}
												offText={text(
													"Can not edit orthodontics page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditOrtho = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.member.canViewAppointments ? (
											<Toggle
												defaultChecked={
													this.member
														.canEditAppointments
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit appointments page"
												)}
												offText={text(
													"Can not edit appointments page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditAppointments = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.member.canViewTreatments ? (
											<Toggle
												defaultChecked={
													this.member
														.canEditTreatments
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit treatments page"
												)}
												offText={text(
													"Can not edit treatments page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditTreatments = newVal!;
												}}
											/>
										) : (
											""
										)}

										{setting.getSetting(
											"module_prescriptions"
										) &&
										this.member.canViewPrescriptions ? (
											<Toggle
												defaultChecked={
													this.member
														.canEditPrescriptions
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit prescriptions page"
												)}
												offText={text(
													"Can not edit prescriptions page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditPrescriptions = newVal!;
												}}
											/>
										) : (
											""
										)}

										{this.member.canViewSettings ? (
											<Toggle
												defaultChecked={
													this.member.canEditSettings
												}
												disabled={
													this.member._id ===
													user.currentUser._id
												}
												onText={text(
													"Can edit settings page"
												)}
												offText={text(
													"Can not edit settings page"
												)}
												onChange={(ev, newVal) => {
													this.member.canEditSettings = newVal!;
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

							{this.viewWhich === 3 ? (
								<SectionComponent
									title={text(`Upcoming Appointments`)}
								>
									{this.member.nextAppointments.length ? (
										<AppointmentsList
											list={this.member.nextAppointments}
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
						</div>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
