import { imagesTable, text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import {
	Col,
	PanelTabs,
	PanelTop,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagInputComponent,
} from "@common-components";
import {
	Appointment,
	ISOTeethArr,
	PrescriptionItem,
	Treatment,
} from "@modules";
import {
	firstDayOfTheWeekDayPicker,
	formatDate,
	num,
	round,
	second,
} from "@utils";
import {
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
	Toggle,
} from "office-ui-fabric-react";

@observer
export class AppointmentEditorPanel extends React.Component<
	{
		appointment: Appointment | undefined | null;
		onDismiss: () => void;
	},
	{}
> {
	@observable timerInputs: number[] = [0, 0, 0];

	@observable timeComb: {
		hours: number;
		minutes: string;
		am: boolean;
	} = {
		hours: this.calcTime.hours,
		minutes: this.calcTime.minutes,
		am: this.calcTime.am,
	};

	tabs = [
		{
			key: "details",
			title: text("details").h,
			icon: "DietPlanNotebook",
		},
		{
			key: "treatment",
			title: text("treatment").h,
			icon: "Cricket",
		},
		{
			key: "finance",
			title: text("expenses & price").h,
			icon: "AllCurrency",
		},
		{
			key: "delete",
			title: text("delete").h,
			icon: "trash",
			hidden: !this.canEdit,
		},
	];

	@computed get calcTime() {
		if (!this.props.appointment) {
			return {
				hours: 12,
				minutes: "00",
				am: false,
			};
		}
		const timeString = new Date(
			this.props.appointment.date
		).toLocaleTimeString("en-US");

		const obj = {
			hours: Number(timeString.split(":")[0]),
			minutes: Number(timeString.split(":")[1]) < 30 ? "00" : "30",
			am: timeString.replace(/[^A-Z]/gi, "").toLowerCase() === "am",
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
			.filter((a) => a._id !== appointment._id).length;
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

	@computed
	get staffErrorMessage() {
		if (!this.props.appointment) {
			return undefined;
		}
		if (this.props.appointment.isDone) {
			return undefined;
		}
		if (this.props.appointment.isMissed) {
			return undefined;
		}
		const target = new Date(this.props.appointment.date)
			.toDateString()
			.split(" ")[0]
			.toLowerCase();
		const hasErrors = this.props.appointment.operatingStaff.filter(
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
						<PanelTop
							title={
								(
									this.props.appointment!.treatment || {
										type: "",
									}
								).type
							}
							square
							type={text("appointment").c}
							subTitle={this.props.appointment!.patient!.name}
							onDismiss={this.props.onDismiss}
							avatar={
								this.props.appointment!.patient!.avatar
									? imagesTable.table[
											this.props.appointment!.patient!
												.avatar
									  ]
										? imagesTable.table[
												this.props.appointment!.patient!
													.avatar
										  ]
										: imagesTable.fetchImage(
												this.props.appointment!.patient!
													.avatar
										  )
									: undefined
							}
						/>
						<PanelTabs
							items={this.tabs}
							onSelect={(key) => core.router.select({ sub: key })}
							currentSelectedKey={core.router.selectedSub}
						/>
					</div>
				)}
			>
				<div className="appointment-editor">
					{core.router.selectedSub === "details" ? (
						<SectionComponent title={text("appointment").h}>
							<Row gutter={8}>
								<Col sm={12}>
									<div className="appointment-input date">
										<DatePicker
											firstDayOfWeek={firstDayOfTheWeekDayPicker(
												modules.setting!.getSetting(
													"weekend_num"
												)
											)}
											label={text("date").c}
											disabled={!this.canEdit}
											className="appointment-date"
											placeholder={
												text("select a date").c
											}
											value={
												new Date(
													this.props.appointment!.date
												)
											}
											onSelectDate={(date) => {
												if (date) {
													this.props.appointment!.setDate(
														date.getTime() +
															60 * 1000 // adds a minute
													);
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
											<Label>{text("time").c}</Label>
											<Row gutter={0}>
												<Col span={8}>
													<Dropdown
														disabled={!this.canEdit}
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
														disabled={!this.canEdit}
														className="ae-mn"
														options={[
															"00",
															"30",
														].map((x) => ({
															key: x,
															text: x,
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
														disabled={!this.canEdit}
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
											onText={text("done").c}
											offText={text("not done").c}
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
									value={this.props.appointment!.operatingStaff.map(
										(x) => ({ key: x._id, text: x.name })
									)}
									onChange={(newKeys) => {
										this.props.appointment!.staffID = newKeys;
									}}
									disabled={!this.canEdit}
									suggestionsHeaderText={
										text("operating staff").c
									}
									noResultsFoundText={
										text("no staff found").r
									}
									className={"operating-staff"}
									errorMessage={this.staffErrorMessage}
								/>
							</div>
						</SectionComponent>
					) : (
						""
					)}

					{core.router.selectedSub === "treatment" ? (
						<SectionComponent title={text("case details").h}>
							<TextField
								multiline
								disabled={!this.canEdit}
								label={text("details").c}
								value={this.props.appointment!.notes}
								onChange={(e, value) => {
									this.props.appointment!.notes = value!;
								}}
								data-testid="case-details"
							/>
							<br />
							<Row gutter={8}>
								<Col sm={12}>
									<div className="appointment-input treatment">
										<Dropdown
											label={text("treatment").c}
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
												.map((tr) => {
													return {
														key: tr._id,
														text: tr.type,
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
											label={text("units number").c}
											disabled={!this.canEdit}
											type="number"
											value={this.props.appointment!.units.toString()}
											onChange={(e, newValue) => {
												this.props.appointment!.units = num(
													newValue!
												);
											}}
											data-testid="units-num"
										/>
									</div>
								</Col>
								<Col span={24}>
									<div className="appointment-input involved-teeth">
										<TagInputComponent
											label={text("involved teeth").c}
											options={ISOTeethArr.map((x) => {
												return {
													key: x.toString(),
													text: x.toString(),
												};
											})}
											suggestionsHeaderText={
												text("select involved teeth").c
											}
											noResultsFoundText={
												text("no teeth found").c
											}
											disabled={!this.canEdit}
											value={this.props
												.appointment!.involvedTeeth.sort()
												.map((x) => ({
													key: x.toString(),
													text: x.toString(),
												}))}
											onChange={(selectedKeys) => {
												this.props.appointment!.involvedTeeth = selectedKeys.map(
													(x) => num(x)
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
											label={text("prescription").c}
											options={modules.prescriptions!.docs.map(
												this.prescriptionToTagInput
											)}
											suggestionsHeaderText={
												text("select prescription").c
											}
											noResultsFoundText={
												text("no prescription found").c
											}
											disabled={!this.canEdit}
											value={this.props.appointment!.prescriptions.map(
												(x) => ({
													key: x.id,
													text: x.prescription,
												})
											)}
											onChange={(selectedKeys) => {
												this.props.appointment!.prescriptions = selectedKeys.map(
													(selectedID) => ({
														id: selectedID,
														prescription: this.prescriptionToTagInput(
															modules.prescriptions!.docs.find(
																(p) =>
																	p._id ===
																	selectedID
															)!
														).text,
													})
												);
											}}
										/>
									</div>

									<div id="prescription-items">
										<div className="print-heading">
											<h2>
												{this.props.appointment.operatingStaff
													.map((x) => x.name)
													.join(",")}
											</h2>
											<hr />
											<h3>
												Patient:{" "}
												{
													(
														this.props.appointment!
															.patient || {
															name: "",
														}
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
																	.patient || {
																	age: 0,
																}
															).age
														}
													</h4>
												</Col>
												<Col span={12}>
													<h4>
														Gender:{" "}
														{
															(
																this.props
																	.appointment!
																	.patient || {
																	gender:
																		"male",
																}
															).gender
														}
													</h4>
												</Col>
											</Row>
											<hr />
										</div>
										{this.props.appointment!.prescriptions.map(
											(item) => {
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
																	"right",
															}}
														>
															{this.canEdit ? (
																<IconButton
																	iconProps={{
																		iconName:
																			"delete",
																	}}
																	onClick={() => {
																		this.props.appointment!.prescriptions = this.props.appointment!.prescriptions.filter(
																			(
																				x
																			) =>
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
											text={text("print prescription").c}
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
						<SectionComponent title={text("expenses & price").h}>
							{modules.setting!.getSetting("time_tracking") ? (
								<div
									className="appointment-input time"
									style={{ maxWidth: 300 }}
								>
									<Label>
										{
											text(
												"time (hours, minutes, seconds)"
											).c
										}
									</Label>
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
												iconName: "Timer",
											}}
											disabled={!this.canEdit}
											className="appendage stop"
											text={text("stop").c}
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
												iconName: "Timer",
											}}
											disabled={!this.canEdit}
											className="appendage"
											text={text("start").c}
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
								</div>
							) : (
								""
							)}

							<div className="appointment-input paid">
								<Row gutter={8}>
									<Col xs={12}>
										<TextField
											type="number"
											disabled={!this.canEdit}
											label={text("price").c}
											value={this.props.appointment!.finalPrice.toString()}
											onChange={(e, newVal) => {
												this.props.appointment!.finalPrice = num(
													newVal!
												);
											}}
											prefix={modules.setting!.getSetting(
												"currencySymbol"
											)}
											data-testid="price"
										/>
									</Col>
									<Col xs={12}>
										<TextField
											type="number"
											disabled={!this.canEdit}
											label={text("paid").c}
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
								</Row>
								<Row gutter={8}>
									<Col xs={24} sm={8}>
										<TextField
											type="number"
											disabled
											label={
												modules.setting!.getSetting(
													"time_tracking"
												)
													? text("expenses").c +
													  " + " +
													  text("time value").r
													: text("expenses").c
											}
											value={round(
												this.props.appointment!
													.totalExpenses
											).toString()}
											prefix={modules.setting!.getSetting(
												"currencySymbol"
											)}
										/>
									</Col>
									<Col xs={12} sm={8}>
										<TextField
											type="number"
											disabled
											label={text("profit").c}
											value={round(
												this.props.appointment!.profit
											).toString()}
											prefix={modules.setting!.getSetting(
												"currencySymbol"
											)}
											errorMessage={
												this.props.appointment!.profit <
												0
													? text("price is too low").c
													: undefined
											}
										/>
									</Col>
									<Col xs={12} sm={8}>
										<TextField
											type="number"
											disabled
											label={
												this.props.appointment!
													.outstandingAmount
													? text("outstanding").c
													: this.props.appointment!
															.overpaidAmount
													? text("overpaid").c
													: text("outstanding").c
											}
											value={
												this.props.appointment!
													.outstandingAmount
													? this.props.appointment!.outstandingAmount.toString()
													: this.props.appointment!
															.overpaidAmount
													? this.props.appointment!.overpaidAmount.toString()
													: this.props.appointment!.outstandingAmount.toString()
											}
											prefix={modules.setting!.getSetting(
												"currencySymbol"
											)}
											errorMessage={
												this.props.appointment!
													.outstandingAmount
													? text("outstanding amount")
															.r
													: this.props.appointment!
															.overpaidAmount
													? text("overpaid amount").r
													: undefined
											}
										/>
									</Col>
								</Row>
							</div>
						</SectionComponent>
					) : (
						""
					)}

					{core.router.selectedSub === "delete" ? (
						<div>
							<br />
							<MessageBar messageBarType={MessageBarType.warning}>
								{text(
									"are you sure you want to delete this appointment?"
								)}
							</MessageBar>
							<br />
							<PrimaryButton
								className="delete"
								iconProps={{
									iconName: "delete",
								}}
								text={text("delete").r}
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
			seconds: padWithZero(seconds),
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
			} ${text(p.form as any)}`,
		};
	}
}
