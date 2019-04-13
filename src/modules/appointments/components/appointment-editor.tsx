import {
	Col,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagInputComponent,
	TagType
	} from "@common-components";
import { text, user } from "@core";
import {
	Appointment,
	appointments,
	ISOTeethArr,
	itemFormToString,
	Patient,
	PrescriptionItem,
	prescriptions,
	setting,
	staff,
	Treatment,
	treatments
	} from "@modules";
import { convert, formatDate, num, round } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Checkbox,
	DatePicker,
	DefaultButton,
	Dropdown,
	Icon,
	IconButton,
	Label,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class AppointmentEditorPanel extends React.Component<
	{
		appointment: Appointment | undefined | null;
		onDismiss: () => void;
		onDelete: () => void;
	},
	{}
> {
	@observable timerInputs: number[] = [];

	@observable timeComb: {
		hours: number;
		minutes: string;
		am: boolean;
	} = {
		hours: this.calcTime.hours,
		minutes: this.calcTime.minutes,
		am: this.calcTime.am
	};

	@computed get calcTime() {
		if (!this.props.appointment) {
			return {
				hours: 12,
				minutes: "00",
				am: false
			};
		}
		const timeString = new Date(
			this.props.appointment.date
		).toLocaleTimeString("en-US");

		const obj = {
			hours: Number(timeString.split(":")[0]),
			minutes: Number(timeString.split(":")[1]) < 30 ? "00" : "30",
			am: timeString.replace(/[^A-Z]/gi, "").toLowerCase() === "am"
		};
		return obj;
	}

	@computed
	get otherAppointmentsNumber() {
		const appointment = this.props.appointment;
		if (!appointment) {
			return [].length - 1;
		}
		return appointments
			.appointmentsForDay(appointment.date, 0, 0)
			.filter(a => a._id !== appointment._id).length;
	}

	@computed
	get treatmentOptions() {
		const list: Treatment[] = JSON.parse(JSON.stringify(treatments.list));
		if (
			this.props.appointment &&
			this.props.appointment.treatmentID.indexOf("|") > -1
		) {
			const arr = this.props.appointment.treatmentID.split("|");
			const _id = this.props.appointment.treatmentID;
			const type = arr[0];
			const expenses = num(arr[1]);
			list.push(new Treatment({ _id, expenses, type }));
		}
		return list;
	}

	@computed
	get canEdit() {
		return user.currentUser.canEditAppointments;
	}

	setTimeFromCombination() {
		if (!this.props.appointment) {
			return;
		}
		if (this.timeComb.hours === 12) {
			this.timeComb.am = true;
		}
		const d = new Date(this.props.appointment.date);
		d.setHours(
			this.timeComb.am ? this.timeComb.hours : this.timeComb.hours + 12,
			Number(this.timeComb.minutes),
			0,
			0
		);
		this.props.appointment.date = d.getTime();
		this.forceUpdate();
	}

	render() {
		return this.props.appointment ? (
			<Panel
				isOpen={!!this.props.appointment}
				type={PanelType.medium}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={this.props.onDismiss}
				onRenderNavigation={() => (
					<Row className="panel-heading">
						<Col span={22}>
							<ProfileComponent
								secondaryElement={
									<span>
										{formatDate(
											this.props.appointment!.date,
											setting.getSetting("date_format")
										)}{" "}
										/{" "}
										{this.props.appointment
											? this.props.appointment.treatment
												? this.props.appointment
														.treatment.type
												: ""
											: ""}
									</span>
								}
								name={
									(
										this.props.appointment!.patient || {
											name: ""
										}
									).name
								}
								size={3}
							/>
						</Col>
						<Col span={2} className="close">
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
				<div className="appointment-editor">
					<SectionComponent title={text("Appointment")}>
						<Row gutter={12}>
							<Col sm={12}>
								<div className="appointment-input date">
									<DatePicker
										label={text("Date")}
										disabled={!this.canEdit}
										className="appointment-date"
										placeholder={text("Select a date")}
										value={
											new Date(
												this.props.appointment!.date
											)
										}
										onSelectDate={date => {
											if (date) {
												this.props.appointment!.setDate(
													date.getTime()
												);
											}
										}}
										formatDate={d =>
											formatDate(
												d || 0,
												setting.getSetting(
													"date_format"
												)
											)
										}
									/>
									<p className="insight">
										{text("With")}{" "}
										<span
											className={
												"num-" +
												this.otherAppointmentsNumber
											}
										>
											{this.otherAppointmentsNumber}
										</span>{" "}
										{text("other appointment")}
									</p>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input time">
									<Row gutter={12}>
										<Label>{text("Time")}</Label>
										<Row gutter={0}>
											<Col span={8}>
												<Dropdown
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
														11
													].map(x => ({
														key: x.toString(),
														text:
															x < 10
																? `0${x.toString()}`
																: x.toString()
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
													options={["00", "30"].map(
														x => ({
															key: x,
															text: x
														})
													)}
													selectedKey={
														this.calcTime.minutes
													}
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
													options={[
														{
															text: "am",
															key: "am"
														},
														{
															text: "pm",
															key: "pm"
														}
													]}
													selectedKey={
														this.calcTime.am
															? "am"
															: "pm"
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
						<div className="appointment-input date">
							<label>{text("Operating staff")} </label>
							{staff.list
								.filter(member => member.operates)
								.map(member => {
									const checked =
										this.props.appointment!.staffID.indexOf(
											member._id
										) > -1;
									return (
										<Checkbox
											key={member._id}
											label={member.name}
											disabled={
												!this.canEdit ||
												(!checked &&
													member.onDutyDays.indexOf(
														new Date(
															this.props.appointment!.date
														).toLocaleDateString(
															"en-us",
															{
																weekday: "long"
															}
														)
													) === -1)
											}
											checked={checked}
											onChange={(ev, isChecked) => {
												if (isChecked) {
													this.props.appointment!.staffID.push(
														member._id
													);
												} else {
													this.props.appointment!.staffID.splice(
														this.props.appointment!.staffID.indexOf(
															member._id
														),
														1
													);
												}
												this.props.appointment!
													.triggerUpdate++;
											}}
										/>
									);
								})}
						</div>
					</SectionComponent>

					<SectionComponent title={text("Case Details")}>
						<TextField
							multiline
							disabled={!this.canEdit}
							label={text("Details")}
							value={this.props.appointment!.notes}
							onChange={(e, value) => {
								this.props.appointment!.notes = value!;
							}}
						/>
						<br />
						<Row gutter={12}>
							<Col sm={12}>
								<div className="appointment-input treatment">
									<Dropdown
										label={text("Treatment")}
										disabled={!this.canEdit}
										className="treatment-type"
										selectedKey={
											this.props.appointment!.treatmentID
										}
										options={this.treatmentOptions
											.sort((a, b) =>
												a.type.localeCompare(b.type)
											)
											.map(tr => {
												return {
													key: tr._id,
													text: tr.type
												};
											})}
										onChange={(e, newValue) => {
											this.props.appointment!.treatmentID = newValue!.key.toString();
										}}
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input units-number">
									<TextField
										label={text("Units number")}
										disabled={!this.canEdit}
										type="number"
										value={this.props.appointment!.units.toString()}
										onChange={(e, newValue) => {
											this.props.appointment!.units = num(
												newValue!
											);
										}}
									/>
								</div>
							</Col>
							<Col span={24}>
								{" "}
								<div className="appointment-input involved-teeth">
									<TagInputComponent
										disabled={!this.canEdit}
										placeholder={text("Involved teeth")}
										value={this.props.appointment!.involvedTeeth.map(
											x => ({
												key: x.toString(),
												text: x.toString()
											})
										)}
										strict={true}
										options={ISOTeethArr.map(x => {
											return {
												key: x.toString(),
												text: x.toString()
											};
										})}
										formatText={x =>
											`${x.toString()} - ${
												convert(num(x)).Palmer
											}`
										}
										onChange={newValue => {
											this.props.appointment!.involvedTeeth = newValue.map(
												x => num(x.key)
											);
										}}
									/>
								</div>
							</Col>
						</Row>

						{setting.getSetting("module_prescriptions") ? (
							<div>
								<hr className="appointment-hr" />
								<div className="appointment-input prescription">
									<TagInputComponent
										disabled={!this.canEdit}
										className="prescription"
										value={this.props.appointment!.prescriptions.map(
											x => ({
												key: x.id,
												text: x.prescription
											})
										)}
										options={prescriptions.list.map(
											this.prescriptionToTagInput
										)}
										onChange={newValue => {
											this.props.appointment!.prescriptions = newValue.map(
												x => ({
													id: x.key,
													prescription: x.text
												})
											);
										}}
										strict={true}
										placeholder={text("Prescription")}
									/>
								</div>

								<div id="prescription-items">
									<div className="print-heading">
										<h2>{user.currentUser.name}</h2>
										<hr />
										<h3>
											Patient:{" "}
											{
												(
													this.props.appointment!
														.patient ||
													new Patient()
												).name
											}
										</h3>
										<Row>
											<Col span={12}>
												<h4>
													Age:{" "}
													{
														(
															this.props
																.appointment!
																.patient ||
															new Patient()
														).age
													}
												</h4>
											</Col>
											<Col span={12}>
												<h4>
													Gender:{" "}
													{(
														this.props.appointment!
															.patient ||
														new Patient()
													).gender
														? "Female"
														: "Male"}
												</h4>
											</Col>
										</Row>
										<hr />
									</div>
									{this.props.appointment!.prescriptions.map(
										item => {
											return (
												<Row key={item.id}>
													<Col
														span={20}
														className="m-b-5"
													>
														<ProfileSquaredComponent
															text={
																item.prescription.split(
																	":"
																)[0]
															}
															onRenderInitials={() => (
																<Icon iconName="pill" />
															)}
															subText={
																item.prescription.split(
																	":"
																)[1]
															}
														/>
													</Col>
													<Col
														span={4}
														style={{
															textAlign: "right"
														}}
													>
														{this.canEdit ? (
															<IconButton
																iconProps={{
																	iconName:
																		"delete"
																}}
																onClick={() => {
																	this.props.appointment!.prescriptions = this.props.appointment!.prescriptions.filter(
																		x =>
																			x.id !==
																			item.id
																	);
																}}
															/>
														) : (
															""
														)}
													</Col>
												</Row>
											);
										}
									)}
								</div>

								{this.props.appointment!.prescriptions
									.length ? (
									<DefaultButton
										onClick={print}
										iconProps={{ iconName: "print" }}
										text={text("Print prescription")}
									/>
								) : (
									""
								)}
							</div>
						) : (
							""
						)}
					</SectionComponent>

					<SectionComponent title={text("Expenses & Price")}>
						<Row gutter={12}>
							<Col sm={16}>
								{setting.getSetting("time_tracking") ? (
									<div className="appointment-input time">
										<label>
											{text(
												"Time (hours, minutes, seconds)"
											)}
										</label>
										<TextField
											className="time-input hours"
											type="number"
											disabled={!this.canEdit}
											value={
												this.formatMillisecondsToTime(
													this.props.appointment!.time
												).hours
											}
											onChange={(e, v) => {
												this.timerInputs[0] = num(v!);
												this.manuallyUpdateTime();
											}}
										/>
										<TextField
											className="time-input minutes"
											type="number"
											disabled={!this.canEdit}
											value={
												this.formatMillisecondsToTime(
													this.props.appointment!.time
												).minutes
											}
											onChange={(e, v) => {
												this.timerInputs[1] = num(v!);
												this.manuallyUpdateTime();
											}}
										/>
										<TextField
											className="time-input seconds"
											type="number"
											disabled={!this.canEdit}
											value={
												this.formatMillisecondsToTime(
													this.props.appointment!.time
												).seconds
											}
											onChange={(e, v) => {
												this.timerInputs[2] = num(v!);
												this.manuallyUpdateTime();
											}}
										/>
										{this.props.appointment!.timer ? (
											<PrimaryButton
												iconProps={{
													iconName: "Timer"
												}}
												disabled={!this.canEdit}
												className="appendage stop"
												text={text("Stop")}
												onClick={() => {
													const timer = this.props
														.appointment!.timer;
													if (timer) {
														clearInterval(timer);
													}
													this.props.appointment!.timer = null;
												}}
											/>
										) : (
											<PrimaryButton
												iconProps={{
													iconName: "Timer"
												}}
												disabled={!this.canEdit}
												className="appendage"
												text={text("Start")}
												onClick={() => {
													const i = appointments.getIndexByID(
														this.props.appointment!
															._id
													);
													const appointment =
														appointments.list[i];
													this.props.appointment!.timer = window.setInterval(
														() => {
															appointment.time =
																appointment.time +
																1000;
														},
														1000
													);
												}}
											/>
										)}
										<p className="payment-insight">
											<TagComponent
												text={
													text("Time value") +
													": " +
													setting.getSetting(
														"currencySymbol"
													) +
													round(
														this.props.appointment!
															.spentTimeValue
													).toString()
												}
												type={TagType.info}
											/>
											<br />
											<TagComponent
												text={
													text("Expenses") +
													": " +
													setting.getSetting(
														"currencySymbol"
													) +
													round(
														this.props.appointment!
															.expenses
													).toString()
												}
												type={TagType.info}
											/>
										</p>
									</div>
								) : (
									""
								)}
							</Col>
							<Col sm={24}>
								<div className="appointment-input paid">
									<Row gutter={12}>
										<Col sm={8}>
											<TextField
												type="number"
												disabled={!this.canEdit}
												label={text("Price")}
												value={this.props.appointment!.finalPrice.toString()}
												onChange={(e, newVal) => {
													this.props.appointment!.finalPrice = num(
														newVal!
													);
												}}
												prefix={setting.getSetting(
													"currencySymbol"
												)}
											/>
										</Col>
										<Col sm={8}>
											<TextField
												type="number"
												disabled={!this.canEdit}
												label={text("Paid")}
												value={this.props.appointment!.paidAmount.toString()}
												onChange={(e, newVal) => {
													this.props.appointment!.paidAmount = num(
														newVal!
													);
												}}
												prefix={setting.getSetting(
													"currencySymbol"
												)}
											/>
										</Col>
										<Col sm={8}>
											<TextField
												type="number"
												disabled={true}
												label={
													this.props.appointment!
														.outstandingAmount
														? text("Outstanding")
														: this.props
																.appointment!
																.overpaidAmount
														? text("Overpaid")
														: text("Outstanding")
												}
												value={
													this.props.appointment!
														.outstandingAmount
														? this.props.appointment!.outstandingAmount.toString()
														: this.props
																.appointment!
																.overpaidAmount
														? this.props.appointment!.overpaidAmount.toString()
														: this.props.appointment!.outstandingAmount.toString()
												}
												prefix={setting.getSetting(
													"currencySymbol"
												)}
											/>
										</Col>
									</Row>
									<p className="payment-insight">
										<TagComponent
											text={
												text("Profit") +
												": " +
												setting.getSetting(
													"currencySymbol"
												) +
												round(
													this.props.appointment!
														.profit
												).toString()
											}
											type={TagType.success}
										/>
										<br />
										<TagComponent
											text={
												text("Profit percentage") +
												": " +
												round(
													this.props.appointment!
														.profitPercentage * 100
												).toString() +
												"%"
											}
											type={TagType.success}
										/>
									</p>
								</div>
							</Col>
						</Row>
						<Row gutter={12}>
							<Col sm={24}>
								<Toggle
									defaultChecked={
										this.props.appointment!.isDone
									}
									onText={text("Done")}
									offText={text("Not done")}
									disabled={!this.canEdit}
									onChange={(e, newVal) => {
										this.props.appointment!.isDone = newVal!;
									}}
								/>
							</Col>
						</Row>
					</SectionComponent>

					<br />

					{this.canEdit ? (
						<PrimaryButton
							className="delete"
							iconProps={{
								iconName: "delete"
							}}
							text={text("Delete")}
							onClick={() => {
								const appointment = this.props.appointment;
								appointments.deleteModal(appointment!._id);
								this.props.onDelete();
							}}
						/>
					) : (
						""
					)}

					<br />
					<br />
					<br />
				</div>
			</Panel>
		) : (
			<div />
		);
	}
	formatMillisecondsToTime(ms: number) {
		const msInSecond = 1000;
		const msInMinute = msInSecond * 60;
		const msInHour = msInMinute * 60;
		const hours = Math.floor(ms / msInHour);
		const minutes = Math.floor((ms % msInHour) / msInMinute);
		const seconds = Math.floor(((ms % msInHour) % msInMinute) / msInSecond);
		return {
			hours: padWithZero(hours),
			minutes: padWithZero(minutes),
			seconds: padWithZero(seconds)
		};
		function padWithZero(n: number) {
			return n > 9 ? n.toString() : "0" + n.toString();
		}
	}
	manuallyUpdateTime() {
		const msInSecond = 1000;
		const msInMinute = msInSecond * 60;
		const msInHour = msInMinute * 60;
		const hours = this.timerInputs[0];
		const minutes = this.timerInputs[1];
		const seconds = this.timerInputs[2];
		if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
			return;
		}
		this.props.appointment!.time =
			hours * msInHour + minutes * msInMinute + seconds * msInSecond;
	}
	prescriptionToTagInput(p: PrescriptionItem) {
		return {
			key: p._id,
			text: `${p.name}: ${p.doseInMg}${text("mg")} ${p.timesPerDay}X${
				p.unitsPerTime
			} ${text(itemFormToString(p.form))}`
		};
	}
}
