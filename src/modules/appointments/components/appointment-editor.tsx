import {
	Col,
	PanelTabs,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagInputComponent,
	tagType
	} from "@common-components";
import { imagesTable, text } from "@core";
import * as core from "@core";
import {
	Appointment,
	ISOTeethArr,
	Patient,
	PrescriptionItem,
	StaffMember,
	Treatment
	} from "@modules";
import * as modules from "@modules";
import { convert, formatDate, num, round, second } from "@utils";
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
	MessageBar,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle
	} from "office-ui-fabric-react";
import { MessageBarType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class AppointmentEditorPanel extends React.Component<
	{
		appointment: Appointment | undefined | null;
		onDismiss: () => void;
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

	tabs = [
		{
			key: "details",
			title: "Details",
			icon: "DietPlanNotebook"
		},
		{
			key: "treatment",
			title: "Treatment",
			icon: "Cricket"
		},
		{
			key: "finance",
			title: "Expenses & Price",
			icon: "AllCurrency"
		},
		{
			key: "delete",
			title: "Delete",
			icon: "trash",
			hidden: !this.canEdit
		}
	];

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
		return modules
			.appointments!.appointmentsForDay(appointment.date, 0, 0)
			.filter(a => a._id !== appointment._id).length;
	}

	@computed
	get treatmentOptions() {
		const list: Treatment[] = JSON.parse(
			JSON.stringify(modules.treatments!.docs)
		);
		if (
			this.props.appointment &&
			this.props.appointment.treatmentID.indexOf("|") > -1
		) {
			const arr = this.props.appointment.treatmentID.split("|");
			const _id = this.props.appointment.treatmentID;
			const type = arr[0];
			const expenses = num(arr[1]);
			list.push(modules.treatments!.new({ _id, type, expenses }));
		}
		return list;
	}

	@computed
	get canEdit() {
		return core.user.currentUser!.canEditAppointments;
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
		this.props.appointment.setDate(d.getTime());
		this.forceUpdate();
	}

	render() {
		return this.props.appointment && core.router.selectedSub ? (
			<Panel
				isOpen={!!this.props.appointment}
				type={PanelType.medium}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={() => {
					if (this.props.onDismiss) {
						this.props.onDismiss();
					}
					core.router.unSelectSub();
				}}
				onRenderNavigation={() => (
					<div className="panel-heading">
						<Row>
							<Col span={22}>
								<ProfileComponent
									name={this.props.appointment!.patient!.name}
									onRenderPrimaryText={() => (
										<div>
											<span>
												{
													this.props.appointment!
														.patient!.name
												}
											</span>
											<br />
											<i style={{ fontSize: 12 }}>
												Appointment:{" "}
												{
													(
														this.props.appointment!
															.treatment || {
															type: ""
														}
													).type
												}
											</i>
										</div>
									)}
									size={2}
									avatar={
										this.props.appointment!.patient!.avatar
											? imagesTable.table[
													this.props.appointment!
														.patient!.avatar
											  ]
												? imagesTable.table[
														this.props.appointment!
															.patient!.avatar
												  ]
												: imagesTable.fetchImage(
														this.props.appointment!
															.patient!.avatar
												  )
											: undefined
									}
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
						<PanelTabs
							items={this.tabs}
							onSelect={key => core.router.selectSub(key)}
							currentSelectedKey={core.router.selectedSub}
						/>
					</div>
				)}
			>
				<div className="appointment-editor">
					{core.router.selectedSub === "details" ? (
						<SectionComponent title={text("Appointment")}>
							<Row gutter={8}>
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
													modules.setting!.getSetting(
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
										<Row gutter={8}>
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
														options={[
															"00",
															"30"
														].map(x => ({
															key: x,
															text: x
														}))}
														selectedKey={
															this.calcTime
																.minutes
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
										<Toggle
											checked={
												this.props.appointment!.isDone
											}
											onText={text("Done")}
											offText={text("Not done")}
											disabled={
												!this.canEdit ||
												(!this.props.appointment
													.isDone &&
													new Date(
														this.props.appointment.date
													).setHours(0, 0, 0, 0) >
														new Date().setHours(
															0,
															0,
															0,
															0
														))
											}
											onChange={(e, newVal) => {
												this.props.appointment!.isDone = newVal!;
											}}
											data-testid="is-done"
										/>
									</div>
								</Col>
							</Row>
							<div className="appointment-input">
								<TagInputComponent
									label={text("Operating staff")}
									options={modules
										.staff!.operatingStaff.sort((a, b) =>
											a.name.localeCompare(b.name)
										)
										.map(s => {
											return {
												key: s._id,
												text: s.name
											};
										})}
									value={this.props.appointment!.operatingStaff.map(
										x => ({ key: x._id, text: x.name })
									)}
									onChange={newKeys => {
										this.props.appointment!.staffID = newKeys;
									}}
									disabled={!this.canEdit}
									suggestionsHeaderText={text(
										"Operating staff"
									)}
									noResultsFoundText={text("No staff found")}
									className={"operating-staff"}
								/>
							</div>
						</SectionComponent>
					) : (
						""
					)}

					{core.router.selectedSub === "treatment" ? (
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
							<Row gutter={8}>
								<Col sm={12}>
									<div className="appointment-input treatment">
										<Dropdown
											label={text("Treatment")}
											disabled={!this.canEdit}
											className="treatment-type"
											selectedKey={
												this.props.appointment!
													.treatmentID
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
									<div className="appointment-input involved-teeth">
										<TagInputComponent
											label={text("Involved teeth")}
											options={ISOTeethArr.map(x => {
												return {
													key: x.toString(),
													text: x.toString()
												};
											})}
											suggestionsHeaderText={text(
												"Select involved teeth"
											)}
											noResultsFoundText={text(
												"No teeth found"
											)}
											disabled={!this.canEdit}
											value={this.props.appointment!.involvedTeeth.map(
												x => ({
													key: x.toString(),
													text: x.toString()
												})
											)}
											onChange={selectedKeys => {
												this.props.appointment!.involvedTeeth = selectedKeys.map(
													x => num(x)
												);
											}}
										/>
									</div>
								</Col>
							</Row>

							{modules.setting!.getSetting(
								"module_prescriptions"
							) ? (
								<div>
									<div className="appointment-input prescription">
										<TagInputComponent
											label={text("Prescription")}
											options={modules.prescriptions!.docs.map(
												this.prescriptionToTagInput
											)}
											suggestionsHeaderText={text(
												"Select prescription"
											)}
											noResultsFoundText={text(
												"No prescriptions found"
											)}
											disabled={!this.canEdit}
											value={this.props.appointment!.prescriptions.map(
												x => ({
													key: x.id,
													text: x.prescription
												})
											)}
											onChange={selectedKeys => {
												this.props.appointment!.prescriptions = selectedKeys.map(
													selectedID => ({
														id: selectedID,
														prescription: this.prescriptionToTagInput(
															modules.prescriptions!.docs.find(
																p =>
																	p._id ===
																	selectedID
															)!
														).text
													})
												);
											}}
										/>
									</div>

									<div id="prescription-items">
										<div className="print-heading">
											<h2>
												{this.props.appointment.operatingStaff
													.map(x => x.name)
													.join(",")}
											</h2>
											<hr />
											<h3>
												Patient:{" "}
												{
													(
														this.props.appointment!
															.patient ||
														modules.patients!.new()
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
																modules.patients!.new()
															).age
														}
													</h4>
												</Col>
												<Col span={12}>
													<h4>
														Gender:{" "}
														{(
															this.props
																.appointment!
																.patient ||
															modules.patients!.new()
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
																textAlign:
																	"right"
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
											onClick={() => {
												print();
											}}
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
					) : (
						""
					)}

					{core.router.selectedSub === "finance" ? (
						<SectionComponent title={text("Expenses & Price")}>
							<Row gutter={8}>
								<Col sm={16}>
									{modules.setting!.getSetting(
										"time_tracking"
									) ? (
										<div className="appointment-input time">
											<Label>
												{text(
													"Time (hours, minutes, seconds)"
												)}
											</Label>
											<TextField
												className="time-input hours"
												type="number"
												disabled={!this.canEdit}
												value={
													this.formatMillisecondsToTime(
														this.props.appointment!
															.time
													).hours
												}
												onChange={(e, v) => {
													this.timerInputs[0] = num(
														v!
													);
													this.manuallyUpdateTime();
												}}
											/>
											<TextField
												className="time-input minutes"
												type="number"
												disabled={!this.canEdit}
												value={
													this.formatMillisecondsToTime(
														this.props.appointment!
															.time
													).minutes
												}
												onChange={(e, v) => {
													this.timerInputs[1] = num(
														v!
													);
													this.manuallyUpdateTime();
												}}
											/>
											<TextField
												className="time-input seconds"
												type="number"
												disabled={!this.canEdit}
												value={
													this.formatMillisecondsToTime(
														this.props.appointment!
															.time
													).seconds
												}
												onChange={(e, v) => {
													this.timerInputs[2] = num(
														v!
													);
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
															clearInterval(
																timer
															);
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
														this.props.appointment!.timer = window.setInterval(
															() => {
																this.props.appointment!.timerAddOneSecond();
															},
															second
														);
													}}
												/>
											)}
											<p className="payment-insight">
												<TagComponent
													text={
														text("Time value") +
														": " +
														modules.setting!.getSetting(
															"currencySymbol"
														) +
														round(
															this.props
																.appointment!
																.spentTimeValue
														).toString()
													}
													type={tagType.info}
												/>
												<br />
												<TagComponent
													text={
														text("Expenses") +
														": " +
														modules.setting!.getSetting(
															"currencySymbol"
														) +
														round(
															this.props
																.appointment!
																.expenses
														).toString()
													}
													type={tagType.info}
												/>
											</p>
										</div>
									) : (
										""
									)}
								</Col>
								<Col sm={24}>
									<div className="appointment-input paid">
										<Row gutter={8}>
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
													prefix={modules.setting!.getSetting(
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
													prefix={modules.setting!.getSetting(
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
															? text(
																	"Outstanding"
															  )
															: this.props
																	.appointment!
																	.overpaidAmount
															? text("Overpaid")
															: text(
																	"Outstanding"
															  )
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
													prefix={modules.setting!.getSetting(
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
													modules.setting!.getSetting(
														"currencySymbol"
													) +
													round(
														this.props.appointment!
															.profit
													).toString()
												}
												type={tagType.success}
											/>
											<br />
											<TagComponent
												text={
													text("Profit percentage") +
													": " +
													round(
														this.props.appointment!
															.profitPercentage *
															100
													).toString() +
													"%"
												}
												type={tagType.success}
											/>
										</p>
									</div>
								</Col>
							</Row>
						</SectionComponent>
					) : (
						""
					)}

					{core.router.selectedSub === "delete" ? (
						<div>
							<br />
							<MessageBar messageBarType={MessageBarType.warning}>
								{text(
									"Are you sure you want to delete this appointment?"
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
									modules.appointments!.delete(
										this.props.appointment!._id
									);
								}}
							/>
						</div>
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
			} ${text(p.form)}`
		};
	}
}
