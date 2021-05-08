import { preUniqueString, text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { firstDayOfTheWeekDayPicker, formatDate, num, username } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import {
	DatePicker,
	MessageBar,
	PrimaryButton,
	IconButton,
	TooltipHost,
	Label,
	Link,
	MessageBarType,
	Panel,
	PanelType,
	TextField,
	Toggle,
	Dropdown,
	Icon,
} from "office-ui-fabric-react";
import {
	Col,
	DataTableComponent,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	Row,
	SectionComponent,
	TagInputComponent,
} from "@common-components";

@observer
export class BotPage extends React.Component {
	@computed
	get canEdit() {
		return core.user.currentUser!.canEditBotPage;
	}

	@observable activeSubPage: "reminders" | "requests" | "announcements" =
		"requests";

	render() {
		return (
			<div className="lw-pg">
				<div className="inpage-menu">
					<TooltipHost content={text("booking requests").c}>
						<IconButton
							className={
								this.activeSubPage === "requests"
									? "active"
									: ""
							}
							onClick={() => (this.activeSubPage = "requests")}
							iconProps={{ iconName: "CalendarReply" }}
						></IconButton>
					</TooltipHost>
					<TooltipHost content={text("appointment reminders").c}>
						<IconButton
							className={
								this.activeSubPage === "reminders"
									? "active"
									: ""
							}
							onClick={() => (this.activeSubPage = "reminders")}
							iconProps={{ iconName: "Message" }}
						></IconButton>
					</TooltipHost>
					<TooltipHost content={text("announcements").c}>
						<IconButton
							className={
								this.activeSubPage === "announcements"
									? "active"
									: ""
							}
							onClick={() =>
								(this.activeSubPage = "announcements")
							}
							iconProps={{ iconName: "Megaphone" }}
						></IconButton>
					</TooltipHost>
				</div>

				<div className="sub-page">
					{this.activeSubPage === "reminders" ? (
						<RemindersSubPage></RemindersSubPage>
					) : (
						""
					)}
					{this.activeSubPage === "requests" ? (
						<AppointmentRequests
							canEdit={this.canEdit}
						></AppointmentRequests>
					) : (
						""
					)}
				</div>
			</div>
		);
	}
}

@observer
class RemindersSubPage extends React.Component {
	render() {
		return (
			<div>
				<MessageBar
					className="top-bot-info"
					messageBarType={MessageBarType.info}
				>
					{
						text(
							`You can use the Telegram bot to get daily updates and notifications about your appointments.`
						).c
					}
				</MessageBar>
				<MessageBar
					messageBarIconProps={{ iconName: "robot" }}
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					<b>(1)</b>:{" "}
					<a
						target="_blank"
						href={`https://t.me/ApexoDrBot?start=${username()}`}
					>
						{text(`click here to open the chatbot`).c}
					</a>
				</MessageBar>
				<MessageBar
					messageBarIconProps={{ iconName: "lock" }}
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					<b>(2)</b>: {text(`enter`).c}{" "}
					<strong>
						{preUniqueString()
							.replace(/\D/g, "")
							.substr(0, 8)
							.replace(/^(\d{4})/, "$1 ")}
					</strong>{" "}
					{text(`when asked for the secret number`).c}
				</MessageBar>
				<MessageBar
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					{
						text(
							`more instructions will be provided by the chat bot`
						).c
					}
				</MessageBar>
			</div>
		);
	}
}

@observer
class AppointmentRequests extends React.Component<{ canEdit: boolean }> {
	@computed get selectedRequest() {
		return modules.botMessages!.docs.find(
			(p) => p._id === core.router.selectedID
		);
	}

	tabs = [
		{
			key: "confirm",
			icon: "CalendarReply",
			title: text("confirm").c,
		},
		{
			key: "delete",
			icon: "trash",
			title: text("delete").c,
			hidden: !this.props.canEdit,
		},
	];
	render() {
		return (
			<div>
				<DataTableComponent
					onDelete={
						this.props.canEdit
							? (id) => {
									modules.botMessages!.deleteModal(id);
							  }
							: undefined
					}
					commands={
						this.props.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("add new").c,
										onClick: () => {
											const newDoc = modules.botMessages!.new();
											newDoc.incoming = true;
											modules
												.botMessages!.add(newDoc)
												.then(() => {
													core.router.select({
														id: newDoc._id,
														tab: "confirm",
													});
												});
										},
										iconProps: {
											iconName: "Add",
										},
									},
							  ]
							: []
					}
					heads={[
						text("patient").c,
						text("date & complaint").c,
						text("preferred time & date").c,
						text("additional notes").c,
					]}
					rows={modules
						.botMessages!.docs.filter((x) => x.incoming && !x.hide)
						.map((request) => {
							return {
								id: request._id,
								searchableString: request.searchableString,
								className: `${
									request.confirmed ? "inactive" : ""
								}`,
								actionsIcon: request.confirmed
									? "checkMark"
									: undefined,
								actions: (request.confirmed
									? [this.tabs[this.tabs.length - 1]]
									: this.tabs
								)
									.filter((x) => !x.hidden)
									.map((x) => ({
										key: x.key,
										title: x.title,
										icon: x.icon,
										onClick: () => {
											if (x.key === "delete") {
												modules.botMessages!.deleteModal(
													request._id
												);
											} else {
												core.router.select({
													id: request._id,
													tab: x.key,
												});
											}
										},
									})),
								cells: [
									{
										dataValue:
											(request.confirmed ? "￿￿￿" : "") +
											request.name,
										component: (
											<div>
												<ProfileComponent
													name={request.name}
													secondaryElement={
														<div>
															<span className="itl">
																<span className="cap">
																	{text(
																		request.gender
																			.toLowerCase()
																			.startsWith(
																				"fe"
																			)
																			? "female"
																			: "male"
																	)}
																</span>{" "}
																-{" "}
																{
																	request.computedAge
																}{" "}
																{text(
																	"years old"
																)}
															</span>
															<br></br>
															{text(
																"phone"
															)}: {request.phone}
														</div>
													}
													size={3}
												/>
											</div>
										),
										onClick: () => {
											core.router.select({
												id: request._id,
												tab: "confirm",
											});
										},
										className: "no-label",
									},
									{
										dataValue:
											(request.confirmed ? "￿￿￿" : "") +
											request.date,
										component: (
											<span>
												<i>{text("date").c}:</i>{" "}
												{formatDate(
													request.date,
													modules.setting!.getSetting(
														"date_format"
													)
												)}
												<br></br>
												<i>
													{text("complaint").c}:
												</i>{" "}
												{request.complaint}
											</span>
										),
										className: "hidden-xs",
									},
									{
										dataValue:
											(request.confirmed ? "￿￿￿" : "") +
											request.daysOfWeek,
										component: (
											<span>
												{request.daysOfWeek}
												<br></br>
												{request.timeOfDay}
											</span>
										),
										className: "hidden-xs",
									},
									{
										dataValue:
											(request.confirmed ? "￿￿￿" : "") +
											request.notes,
										component: <span>{request.notes}</span>,
										className: "hidden-xs",
									},
								],
							};
						})}
					maxItemsOnLoad={20}
				/>
				<MessageBar
					className="top-bot-info"
					messageBarType={MessageBarType.info}
				>
					{text(`you can give this link`).c}
					<a
						target="_blank"
						href={`https://t.me/apexobookbot?start=${username()}`}
					>
						https://t.me/apexobookbot?start={username()}
					</a>
					{
						text(
							`to your patients and they'll be able to send you appointment booking requests.`
						).c
					}{" "}
					{
						text(
							`then, you can confirm requests through this page.`
						).c
					}
				</MessageBar>
				{this.selectedRequest ? (
					<Panel
						isOpen={!!this.selectedRequest}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => (
							<div className="panel-heading">
								<PanelTop
									title={this.selectedRequest!.name}
									type={text("appointment request").c}
									subTitle={`${this.selectedRequest!.phone}`}
									onDismiss={() => core.router.unSelect()}
									square
								/>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={(key) =>
										core.router.select({ tab: key })
									}
									items={this.tabs}
								/>
							</div>
						)}
					>
						<div className="booking-request">
							{core.router.selectedTab === "confirm" ? (
								this.selectedRequest.confirmed ? (
									<div>
										<br></br>
										<MessageBar
											messageBarType={
												MessageBarType.success
											}
											messageBarIconProps={{
												iconName: "checkmark",
											}}
										>
											{
												text(
													"this booking request has been confirmed and converted into an appointment. You can safely delete it now"
												).c
											}
											<br></br>

											<br></br>
											<div className="after-confirm-actions">
												<DefaultButton
													iconProps={{
														iconName: "contact",
													}}
													onClick={() => {
														core.router.go([
															modules.patientsNamespace,
														]);
														const appointmentID = this
															.selectedRequest!
															.appointmentID;
														const id = modules.appointments!.docs.find(
															(x) =>
																x._id ===
																appointmentID
														)!.patient!._id;
														setTimeout(() => {
															core.router.select({
																id,
																tab: "details",
															});
														}, 100);
													}}
												>
													{text("patient").c}
												</DefaultButton>
												<DefaultButton
													iconProps={{
														iconName: "calendar",
													}}
													onClick={() => {
														core.router.go([
															modules.appointmentsNamespace,
														]);
														const id = this
															.selectedRequest!
															.appointmentID;
														setTimeout(() => {
															core.router.select({
																id,
																sub: "details",
															});
														}, 100);
													}}
												>
													{text("appointment").c}
												</DefaultButton>
											</div>
										</MessageBar>
									</div>
								) : (
									<SectionComponent title={text("confirm").h}>
										<BookingRequestEditor
											canEdit={this.props.canEdit}
											request={this.selectedRequest}
										></BookingRequestEditor>
									</SectionComponent>
								)
							) : (
								""
							)}
							{core.router.selectedTab === "delete" ? (
								<div>
									<br />
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										{
											text(
												"are you sure you want to delete"
											).c
										}
									</MessageBar>
									<br />
									<PrimaryButton
										className="delete"
										iconProps={{
											iconName: "delete",
										}}
										text={text("delete").c}
										onClick={() => {
											modules.botMessages!.remove(
												core.router.selectedID
											);
											core.router.unSelect();
										}}
										disabled={!this.canEdit}
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

@observer
class BookingRequestEditor extends React.Component<{
	canEdit: boolean;
	request: modules.BotMessage;
}> {
	@observable confirmationDate: number = new Date().getTime();
	@observable confirmationMessage: string = "";

	@observable confirmationTreatmentID: string = "";

	@observable confirmationOperatingStaffIDs: string[] = [];

	@computed get confirmationOperatingStaff(): modules.StaffMember[] {
		return this.confirmationOperatingStaffIDs
			.map((id) => modules.staff!.docs.find((x) => x._id === id))
			.filter((x) => x !== undefined) as any;
	}

	@observable timeComb: {
		hours: number;
		minutes: string;
		am: boolean;
	} = {
		hours: this.calcTime.hours,
		minutes: this.calcTime.minutes,
		am: this.calcTime.am,
	};

	@computed
	get otherAppointmentsNumber() {
		return modules.appointments!.appointmentsForDay(
			this.confirmationDate,
			0,
			0
		).length;
	}

	@computed
	get staffErrorMessage() {
		const target = new Date(this.confirmationDate)
			.toDateString()
			.split(" ")[0]
			.toLowerCase();
		const hasErrors = this.confirmationOperatingStaff.filter(
			(staff) =>
				!staff.onDutyDays
					.map((x) => x.toLowerCase())
					.find((x) => x.startsWith(target))
		);
		if (hasErrors.length === 0) {
			return undefined;
		}
		return hasErrors
			.map(
				(x) => `${x.name} ${text("might not be available on this day")}`
			)
			.join(", ");
	}

	render() {
		return (
			<div>
				<Row gutter={8}>
					<Col sm={12}>
						{" "}
						<TextField
							label={text("patient name").c}
							value={this.props.request.name}
							onChange={(ev, val) =>
								(this.props.request!.name = val!)
							}
							disabled={!this.props.canEdit}
						/>
					</Col>
					<Col sm={12}>
						{" "}
						<TextField
							label={text("phone number").c}
							value={this.props.request.phone}
							onChange={(ev, val) =>
								(this.props.request!.phone = val!)
							}
							disabled={!this.props.canEdit}
						/>
					</Col>
				</Row>

				<Row gutter={8}>
					<Col sm={12}>
						<TextField
							label={text("birth year / age").c}
							value={this.props.request.age.toString()}
							onChange={(ev, val) =>
								(this.props.request!.age = Number(val!))
							}
							disabled={!this.props.canEdit}
						/>
					</Col>
					<Col sm={12}>
						<Dropdown
							label={text("gender").c}
							selectedKey={
								this.props.request.gender
									.toLowerCase()
									.startsWith("fe")
									? "female"
									: "male"
							}
							options={[
								{
									key: "male",
									text: text("male").c,
								},
								{
									key: "female",
									text: text("female").c,
								},
							]}
							onChange={(ev, selected) => {
								if (selected!.key === "male") {
									this.props.request!.gender = "male";
								} else {
									this.props.request!.gender = "female";
								}
							}}
							disabled={!this.props.canEdit}
						/>
					</Col>
				</Row>

				<Row gutter={8}>
					<Col sm={12}>
						<TextField
							label={text("complaint").c}
							value={this.props.request.complaint}
							onChange={(ev, val) =>
								(this.props.request!.complaint = val!)
							}
							disabled={!this.props.canEdit}
							multiline
						/>
					</Col>
					<Col sm={12}>
						<TextField
							label={text("additional notes").c}
							value={this.props.request.notes}
							onChange={(ev, val) =>
								(this.props.request!.notes = val!)
							}
							disabled={!this.props.canEdit}
							multiline
						/>
					</Col>
				</Row>

				<Row gutter={8}>
					<Col sm={12}>
						<MessageBar messageBarType={MessageBarType.info}>
							{text("preferred days").c}
							{": "}
							{this.props.request.daysOfWeek}
						</MessageBar>
						<div className="appointment-input date">
							<DatePicker
								firstDayOfWeek={firstDayOfTheWeekDayPicker(
									modules.setting!.getSetting("weekend_num")
								)}
								label={text("date").c}
								disabled={!this.props.canEdit}
								className="appointment-date"
								placeholder={text("select a date").c}
								value={new Date(this.confirmationDate)}
								onSelectDate={(date) => {
									if (date) {
										this.confirmationDate =
											date.getTime() + 60 * 1000; // adds a minute
									}
								}}
								formatDate={(d) =>
									formatDate(
										d || 0,
										modules.setting!.getSetting(
											"date_format"
										)
									)
								}
							/>
							<p className="insight">
								{text("with").c}{" "}
								<span
									className={
										"num-" + this.otherAppointmentsNumber
									}
								>
									{this.otherAppointmentsNumber}
								</span>{" "}
								{text("other appointment")}
							</p>
						</div>
					</Col>
					<Col sm={12}>
						<MessageBar messageBarType={MessageBarType.info}>
							{text("preferred time").c}
							{": "}
							{this.props.request.timeOfDay}
						</MessageBar>
						<div className="appointment-input time">
							<Row gutter={8}>
								<Label>{text("time").c}</Label>
								<Row gutter={0}>
									<Col span={8}>
										<Dropdown
											disabled={!this.props.canEdit}
											className="ae-hr"
											options={[
												12,
												1,
												2,
												3,
												4,
												5,
												6,
												7,
												8,
												9,
												10,
												11,
											].map((x) => ({
												key: x.toString(),
												text:
													x < 10
														? `0${x.toString()}`
														: x.toString(),
											}))}
											selectedKey={this.calcTime.hours.toString()}
											onChange={(ev, val) => {
												if (val) {
													this.timeComb.hours = Number(
														val.key.toString()
													);
													this.setTimeFromCombination();
												}
											}}
										/>
									</Col>
									<Col span={8}>
										<Dropdown
											disabled={!this.props.canEdit}
											className="ae-mn"
											options={["00", "30"].map((x) => ({
												key: x,
												text: x,
											}))}
											selectedKey={this.calcTime.minutes}
											onChange={(ev, val) => {
												if (val) {
													this.timeComb.minutes = val.key.toString();
													this.setTimeFromCombination();
												}
											}}
										/>
									</Col>
									<Col span={8}>
										<Dropdown
											disabled={!this.props.canEdit}
											className="ae-am"
											options={[
												{
													text: "am",
													key: "am",
												},
												{
													text: "pm",
													key: "pm",
												},
											]}
											selectedKey={
												this.calcTime.am ? "am" : "pm"
											}
											onChange={(ev, val) => {
												if (val) {
													this.timeComb.am =
														val.key.toString() ===
														"am";
													this.setTimeFromCombination();
												}
											}}
										/>
									</Col>
								</Row>
							</Row>
						</div>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col sm={12}>
						<Dropdown
							label={text("treatment").c}
							disabled={!this.props.canEdit}
							className="treatment-type"
							selectedKey={this.confirmationTreatmentID}
							options={modules
								.treatments!.docs.sort((a, b) =>
									a.type.localeCompare(b.type)
								)
								.map((tr) => {
									return {
										key: tr._id,
										text: tr.type,
									};
								})}
							onChange={(e, newValue) => {
								this.confirmationTreatmentID = newValue!.key.toString();
							}}
						/>
					</Col>
					<Col sm={12}>
						<TagInputComponent
							label={text("operating staff").c}
							options={modules
								.staff!.operatingStaff.sort((a, b) =>
									a.name.localeCompare(b.name)
								)
								.map((s) => {
									return {
										key: s._id,
										text: s.name,
									};
								})}
							value={this.confirmationOperatingStaff.map((x) => ({
								key: x._id,
								text: x.name,
							}))}
							onChange={(newKeys) => {
								this.confirmationOperatingStaffIDs = newKeys;
							}}
							disabled={!this.props.canEdit}
							suggestionsHeaderText={text("operating staff").c}
							noResultsFoundText={text("no staff found").r}
							className={"operating-staff"}
							errorMessage={this.staffErrorMessage}
						/>
					</Col>
				</Row>

				<TextField
					label={text("confirmation message").c}
					value={this.confirmationMessage}
					onChange={(ev, val) => (this.confirmationMessage = val!)}
					disabled={!this.props.canEdit}
					multiline
					placeholder={this.props.request.defaultConfirmationMessage(
						this.confirmationDate
					)}
				/>
				<MessageBar messageBarType={MessageBarType.info}>
					{text(
						"The message above will be sent to the patient who requested this appointment booking"
					)}
				</MessageBar>
				<br />
				<PrimaryButton
					disabled={
						!this.props.canEdit ||
						this.confirmationOperatingStaff.length === 0 ||
						this.confirmationTreatmentID === ""
					}
					iconProps={{ iconName: "CalendarReply" }}
					onClick={() => {
						this.confirm();
					}}
				>
					{text("confirm").c}
				</PrimaryButton>
			</div>
		);
	}

	@computed get calcTime() {
		const timeString = new Date(this.confirmationDate).toLocaleTimeString(
			"en-US"
		);

		const obj = {
			hours: Number(timeString.split(":")[0]),
			minutes: Number(timeString.split(":")[1]) < 30 ? "00" : "30",
			am: timeString.replace(/[^A-Z]/gi, "").toLowerCase() === "am",
		};
		return obj;
	}

	setTimeFromCombination() {
		if (this.timeComb.hours === 12) {
			this.timeComb.am = true;
		}
		const d = new Date(this.confirmationDate);
		d.setHours(
			this.timeComb.am ? this.timeComb.hours : this.timeComb.hours + 12,
			Number(this.timeComb.minutes),
			0,
			0
		);
		this.confirmationDate = d.getTime();
		this.forceUpdate();
	}

	confirm() {
		let patient = modules.patients!.docs.find((doc) => {
			return (
				doc.name === this.props.request.name &&
				doc.phone === this.props.request.phone
			);
		});
		if (patient === undefined) {
			// create a new patient if not found
			const patientTemp = modules.patients!.new();
			patientTemp.name = this.props.request.name;
			patientTemp.fromJSON(patientTemp.toJSON());
			patientTemp.birthYear = this.props.request.age;
			patientTemp.phone = this.props.request.phone;
			patientTemp.gender = this.props.request.gender
				.toLowerCase()
				.startsWith("fe")
				? "female"
				: "male";
			modules.patients!.add(patientTemp);
			patient = patientTemp;
		}

		const appointment = modules.appointments!.new();
		appointment.patientID = patient._id;
		appointment.complaint = this.props.request.complaint;
		appointment.date = this.confirmationDate;
		appointment.treatmentID = this.confirmationTreatmentID;
		appointment.staffID = this.confirmationOperatingStaffIDs;
		modules.appointments!.add(appointment);

		this.props.request.appointmentID = appointment._id;
		this.props.request.confirmed = true;
		this.props.request.confirmationMessage =
			this.confirmationMessage ||
			this.props.request.defaultConfirmationMessage(appointment.date);
	}
}
