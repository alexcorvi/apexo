import { Col, ProfileSquaredComponent, Row } from "@common-components";
import { text } from "@core";
import {
	Appointment,
	DayInfo,
	PatientLinkComponent,
	patientsNamespace,
	PrescriptionItem,
	StaffMember
	} from "@modules";
import { dateNames, num } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Icon, Shimmer, TextField, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});
@observer
export class CalendarPage extends React.Component<{
	currentUser: StaffMember;
	currentLocation: string;
	currentYear: number;
	currentMonth: number;
	currentDay: number;
	selectedYear: number;
	selectedMonth: number;
	selectedDay: number;
	selectedMonthDays: DayInfo[];
	selectedWeekDays: DayInfo[];
	dateFormat: string;
	currencySymbol: string;
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	availableTreatments: { type: string; expenses: number; _id: string }[];
	availablePrescriptions: PrescriptionItem[];
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	onSelectDate: ({
		year,
		month,
		day
	}: {
		year?: number | undefined;
		month?: number | undefined;
		day?: number | undefined;
	}) => void;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	onNavigation: (arr: string[]) => void;
}> {
	@observable filter: string = "";

	@observable appointment: Appointment | null = null;

	@observable showAll: boolean = true;

	componentDidMount() {
		this.unifyHeight();

		const dateString = this.props.currentLocation.split("/")[1];
		if (!dateString) {
			return;
		}
		const dateArray = dateString.split(/\W/);
		this.props.onSelectDate({ year: num(dateArray[0]) });
		this.props.onSelectDate({ month: num(dateArray[1]) - 1 });
		this.props.onSelectDate({ day: num(dateArray[2]) });
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
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
			<div className="calendar-component container-fluid">
				<div className="selector year-selector">
					<Row>
						{[
							this.props.currentYear - 2,
							this.props.currentYear - 1,
							this.props.currentYear,
							this.props.currentYear + 1
						].map(year => {
							return (
								<Col key={year} span={6} className="centered">
									<a
										onClick={() => {
											this.props.onSelectDate({
												year,
												month: 0,
												day: 1
											});
										}}
										className={
											(this.props.selectedYear === year
												? "selected"
												: "") +
											(this.props.currentYear === year
												? " current"
												: "")
										}
									>
										{year}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector month-selector">
					<Row>
						{dateNames.monthsShort().map((monthShort, index) => {
							return (
								<Col
									key={monthShort}
									sm={2}
									xs={4}
									className="centered"
								>
									<a
										onClick={() => {
											this.props.onSelectDate({
												month: index,
												day: 1
											});
										}}
										className={
											(this.props.selectedMonth === index
												? "selected"
												: "") +
											(this.props.currentMonth ===
												index &&
											this.props.currentYear ===
												this.props.selectedYear
												? " current"
												: "")
										}
									>
										{monthShort}
									</a>
								</Col>
							);
						})}
					</Row>
				</div>
				<div className="selector day-selector">
					<div className="day-selector-wrapper">
						<div>
							{this.props.selectedMonthDays.map(day => {
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											this.props.onSelectDate({
												day: day.dateNum
											});
											setTimeout(() => {
												scroll(
													0,
													this.findPos(
														document.getElementById(
															"day_" + day.dateNum
														)
													)
												);
											}, 0);
										}}
										className={
											"day-col" +
											(this.props.selectedDay ===
											day.dateNum
												? " selected"
												: "") +
											(this.props.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
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
													this.props.currentDay &&
												this.props.currentMonth ===
													this.props.selectedMonth &&
												this.props.selectedYear ===
													this.props.currentYear
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
							{this.props.selectedMonthDays.map(day => {
								const number = this.props.appointmentsForDay(
									this.props.selectedYear,
									this.props.selectedMonth + 1,
									day.dateNum,
									undefined,
									this.showAll
										? undefined
										: this.props.currentUser._id
								).length;
								return (
									<div
										key={day.dateNum}
										onClick={() => {
											this.props.onSelectDate({
												day: day.dateNum
											});
										}}
										className={
											"day-col" +
											(this.props.selectedDay ===
											day.dateNum
												? " selected"
												: "") +
											(this.props.currentUser.onDutyDays.indexOf(
												day.weekDay.dayLiteral
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
				<div className="week-view">
					<div className="filters">
						<Row>
							<Col sm={12} md={6} xs={24}>
								<Toggle
									defaultChecked={this.showAll}
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
					<div id="full-day-cols">
						{this.props.selectedWeekDays.map(day => {
							return (
								<div
									key={day.dateNum}
									id={"day" + "_" + day.dateNum}
									className={
										"full-day-col" +
										(this.props.currentUser.onDutyDays.indexOf(
											day.weekDay.dayLiteral
										) === -1
											? " holiday"
											: "") +
										(this.props.selectedDay === day.dateNum
											? " selected"
											: "")
									}
									onClick={() => {
										this.props.onSelectDate({
											day: day.dateNum
										});
									}}
									style={{
										width:
											(
												100 /
												this.props.selectedWeekDays
													.length
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
									{this.props
										.appointmentsForDay(
											this.props.selectedYear,
											this.props.selectedMonth + 1,
											day.dateNum,
											this.filter,
											this.showAll
												? undefined
												: this.props.currentUser._id
										)
										.sort((a, b) => a.date - b.date)
										.map(appointment => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													onClick={() =>
														(this.appointment = appointment)
													}
												>
													<div className="time">
														{
															appointment.formattedTime
														}
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
														onClick={() => {
															this.props.onNavigation(
																[
																	patientsNamespace,
																	(
																		appointment.patient || {
																			_id:
																				""
																		}
																	)._id
																]
															);
														}}
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
																	<Icon iconName="Contact" />{" "}
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
				{this.appointment ? (
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => (this.appointment = null)}
						onDeleteAppointment={() => (this.appointment = null)}
						currentUser={this.props.currentUser}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
						dateFormat={this.props.dateFormat}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						availableTreatments={this.props.availableTreatments}
						operatingStaff={this.props.operatingStaff}
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
