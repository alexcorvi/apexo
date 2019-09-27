import { Col, ProfileSquaredComponent, Row } from "@common-components";
import * as core from "@core";
import { text } from "@core";
import { Calendar, calendar } from "@modules";
import { PatientLinkComponent } from "@modules";
import * as modules from "@modules";
import { dateNames, firstDayOfTheWeekDayPicker } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Calendar as MSCal,
	DateRangeType,
	Icon,
	IconButton,
	Shimmer,
	TextField,
	Toggle
	} from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class CalendarPage extends React.Component {
	@observable filter: string = "";

	@computed get appointment() {
		return modules.appointments!.docs.find(
			a => a._id === core.router.selectedID
		);
	}

	@computed get selectedAppointments() {
		return this.c.selectedWeekDays.map(day => {
			return modules.appointments!.appointmentsForDay(
				this.c.selected.year,
				this.c.selected.month + 1,
				day.dateNum,
				this.filter,
				this.showAll ? undefined : core.user.currentUser!._id
			);
		});
	}

	@computed get noAppointmentsThisWeek() {
		return !this.selectedAppointments.find(x => x.length > 0);
	}

	@observable showAll: boolean = true;

	@observable c: Calendar = calendar;

	@observable collapsedMobileCalendar: boolean = false;

	componentDidMount() {
		this.unifyHeight();
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
		if (!(core.router.innerWidth > 400)) {
			return;
		}
		const parent = document.getElementById("full-day-cols");
		if (!parent) {
			return;
		}
		const els = document.getElementsByClassName(
			"full-day-col"
		) as HTMLCollectionOf<HTMLDivElement>;
		let largest = 0;
		for (let index = 0; index < els.length; index++) {
			const height = els[index].clientHeight;
			if (height > largest) {
				largest = height;
			}
		}
		for (let index = 0; index < els.length; index++) {
			els[index].style.minHeight = largest ? largest + "px" : "auto";
		}
	}

	render() {
		return (
			<div className="calendar-component">
				{core.router.innerWidth > 400 ? (
					<div>
						<div className="selector year-selector">
							<Row>
								{[
									this.c.selected.year - 1,
									this.c.selected.year - 1,
									this.c.selected.year,
									this.c.selected.year + 1,
									this.c.selected.year + 1
								].map((year, i) => {
									return (
										<Col
											key={year + i}
											span={i === 2 ? 4 : 5}
											className="centered"
										>
											{i === 0 || i === 4 ? (
												<IconButton
													onClick={() => {
														this.c.select({
															year,
															month: 0,
															day: 1
														});
														this.forceUpdate();
													}}
													iconProps={{
														iconName:
															i === 0
																? "Previous"
																: "Next"
													}}
												></IconButton>
											) : (
												<a
													onClick={() => {
														this.c.select({
															year,
															month: 0,
															day: 1
														});
														this.forceUpdate();
													}}
													className={
														(this.c.selected
															.year === year
															? "selected"
															: "") +
														(this.c.currentYear ===
														year
															? " current"
															: "")
													}
												>
													{year}
												</a>
											)}
										</Col>
									);
								})}
							</Row>
						</div>

						<div className="selector month-selector">
							<Row>
								{dateNames
									.monthsShort()
									.map((monthShort, index) => {
										return (
											<Col
												key={monthShort}
												sm={2}
												xs={4}
												className="centered"
											>
												<a
													onClick={() => {
														this.c.select({
															month: index,
															day: 1
														});
													}}
													className={
														(this.c.selected
															.month === index
															? "selected"
															: "") +
														(this.c.currentMonth ===
															index &&
														this.c.currentYear ===
															this.c.selected.year
															? " current"
															: "")
													}
												>
													{text(monthShort)}
												</a>
											</Col>
										);
									})}
							</Row>
						</div>
						<div className="selector day-selector">
							<div className="day-selector-border">
								<div className="day-selector-wrapper">
									<div>
										{this.c.selectedMonthDays.map(day => {
											return (
												<div
													key={day.dateNum}
													onClick={() => {
														this.c.select({
															day: day.dateNum
														});
														setTimeout(() => {
															scroll(
																0,
																this.findPos(
																	document.getElementById(
																		"day_" +
																			day.dateNum
																	)
																)
															);
														}, 0);
													}}
													className={
														"day-col" +
														(this.c.selected.day ===
														day.dateNum
															? " selected"
															: "") +
														(core.user.currentUser!.onDutyDays.indexOf(
															day.weekDay
																.dayLiteral
														) === -1
															? " holiday"
															: "") +
														(day.weekDay.isWeekend
															? " weekend"
															: "")
													}
												>
													<div className="day-name">
														{text(
															day.weekDay.dayLiteralShort
																.substr(0, 2)
																.toUpperCase()
														)}
													</div>
													<a
														className={
															"day-number info-row" +
															(day.dateNum ===
																this.c
																	.currentDay &&
															this.c
																.currentMonth ===
																this.c.selected
																	.month &&
															this.c.selected
																.year ===
																this.c
																	.currentYear
																? " current"
																: "")
														}
													>
														{day.dateNum}
													</a>
												</div>
											);
										})}
									</div>
									<div>
										{this.c.selectedMonthDays.map(day => {
											const number = modules.appointments!.appointmentsForDay(
												this.c.selected.year,
												this.c.selected.month + 1,
												day.dateNum,
												undefined,
												this.showAll
													? undefined
													: core.user.currentUser!._id
											).length;
											return (
												<div
													key={day.dateNum}
													onClick={() => {
														this.c.select({
															day: day.dateNum
														});
													}}
													className={
														"day-col" +
														(this.c.selected.day ===
														day.dateNum
															? " selected"
															: "") +
														(core.user.currentUser!.onDutyDays.indexOf(
															day.weekDay
																.dayLiteral
														) === -1
															? " holiday"
															: "") +
														(day.weekDay.isWeekend
															? " weekend"
															: "")
													}
												>
													<div
														className={
															"info-row appointments-num num-" +
															number
														}
													>
														{number}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div
						className={`mobile-calendar${
							this.collapsedMobileCalendar ? " collapsed" : ""
						}`}
					>
						<MSCal
							onSelectDate={date => {
								this.c.selected.year = date.getFullYear();
								this.c.selected.month = date.getMonth();
								this.c.selected.day = date.getDate();
							}}
							value={
								new Date(
									this.c.selected.year,
									this.c.selected.month,
									this.c.selected.day
								)
							}
							strings={{
								months: dateNames.months(),
								shortMonths: dateNames.monthsShort(),
								days: [
									"Sunday",
									"Monday",
									"Tuesday",
									"Wednesday",
									"Thursday",
									"Friday",
									"Saturday"
								],
								shortDays: [
									"Su",
									"Mo",
									"Tu",
									"We",
									"Th",
									"Fr",
									"Sa"
								],
								goToToday: "Go to today"
							}}
							firstDayOfWeek={firstDayOfTheWeekDayPicker(
								modules.setting!.getSetting("weekend_num")
							)}
							dateRangeType={DateRangeType.WorkWeek}
							isMonthPickerVisible={false}
							showGoToToday={false}
							autoNavigateOnSelection
						/>
						<div className="collapse">
							<IconButton
								onClick={() =>
									(this.collapsedMobileCalendar = !this
										.collapsedMobileCalendar)
								}
								iconProps={{
									iconName: this.collapsedMobileCalendar
										? "chevronDown"
										: "ChevronUp"
								}}
							></IconButton>
						</div>
					</div>
				)}

				<div
					className={`week-view${
						this.collapsedMobileCalendar ? " full-height" : ""
					}`}
				>
					{core.router.innerWidth > 400 ? (
						<div className="filters">
							<Row>
								<Col sm={12} md={6} xs={24}>
									<Toggle
										checked={this.showAll}
										onText={text("All appointments")}
										offText={text("My appointments only")}
										onChange={(ev, newValue) => {
											this.showAll = newValue!;
										}}
									/>
								</Col>
								<Col sm={12} md={18} xs={0} className="filter">
									<TextField
										placeholder={text("Type to filter")}
										onChange={(ev, newVal) =>
											(this.filter = newVal!)
										}
									/>
								</Col>
							</Row>
						</div>
					) : (
						""
					)}

					<div
						id="full-day-cols"
						key={JSON.stringify(this.c.selected)}
					>
						{this.c.selectedWeekDays.map((day, index) => {
							return (
								<div
									key={day.dateNum}
									id={"day" + "_" + day.dateNum}
									className={
										"full-day-col" +
										(this.c.selected.day === day.dateNum
											? " selected"
											: "") +
										(day.dateNum === this.c.currentDay &&
										this.c.currentMonth ===
											this.c.selected.month &&
										this.c.selected.year ===
											this.c.currentYear
											? " current"
											: "")
									}
									onClick={() => {
										this.c.select({
											day: day.dateNum
										});
									}}
									style={{
										width:
											(
												100 /
												this.c.selectedWeekDays.length
											).toString() + "%"
									}}
								>
									<h4>
										<b>{day.dateNum}</b>
										&nbsp;&nbsp;&nbsp;
										<span className="day-name">
											{text(day.weekDay.dayLiteral)}
										</span>
									</h4>
									{this.selectedAppointments[index]
										.sort((a, b) => a.date - b.date)
										.map(appointment => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													onClick={() => {
														core.router.select({
															id: appointment._id,
															sub: "details"
														});
													}}
												>
													<div
														className={
															"time" +
															(appointment.isMissed
																? " missed"
																: appointment.isDone
																? " done"
																: "")
														}
													>
														{appointment.isMissed
															? text("Missed")
															: appointment.isDone
															? text("Done")
															: appointment.formattedTime}
													</div>
													<div className="m-b-5">
														<ProfileSquaredComponent
															text={
																appointment.treatment
																	? appointment
																			.treatment
																			.type
																	: ""
															}
															size={1}
														/>
													</div>
													<PatientLinkComponent
														id={
															(
																appointment.patient || {
																	_id: ""
																}
															)._id
														}
														name={
															(
																appointment.patient || {
																	name: ""
																}
															).name
														}
													/>
													{appointment.operatingStaff.map(
														operator => {
															return (
																<div
																	key={
																		operator._id
																	}
																	className="m-t-5 fs-11"
																>
																	<Icon iconName="Medical" />{" "}
																	{
																		operator.name
																	}
																</div>
															);
														}
													)}
												</div>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>

				{this.appointment && core.router.selectedSub ? (
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => core.router.unSelect()}
					/>
				) : (
					""
				)}
			</div>
		);
	}

	findPos(obj: HTMLElement | null) {
		let currentTop = 0;
		if (obj && obj.offsetParent) {
			do {
				currentTop += obj.offsetTop;
			} while ((obj = obj.offsetParent as HTMLElement));
			return currentTop - 70;
		}
		return 0;
	}
}
