import './calendar.scss';

import * as React from 'react';

import { Appointment, Calendar as CalendarClass, appointments } from '../data';
import { Icon, TextField, Toggle } from 'office-ui-fabric-react';
import { computed, observable } from 'mobx';
import { Row, Col } from 'antd';
import { API } from '../../../core';
import { AppointmentEditor } from './appointment-editor';
import { observer } from 'mobx-react';
import { patientsComponents } from '../../patients';
import { patientsData } from '../../patients';
import { settingsData } from '../../settings/index';
import { treatmentsComponents } from '../../treatments';

@observer
export class Calendar extends React.Component<{}, {}> {
	@observable filter: string = '';

	c: CalendarClass = new CalendarClass();
	@observable appointment: Appointment | null = null;

	@observable showAll: boolean = true;

	componentDidMount() {
		const dateString = API.router.currentLocation.split('/')[1];
		if (!dateString) {
			return;
		}
		const dateArray = dateString.split(/\W/);
		this.c.selectedYear = Number(dateArray[0]);
		this.c.selectedMonth = Number(dateArray[1]) - 1;
		this.c.selectedDay = Number(dateArray[2]) - 1;
	}

	componentDidUpdate() {
		this.unifyHeight();
	}

	unifyHeight() {
		const parent = document.getElementById('full-day-cols');
		if (!parent) {
			return;
		}
		const els = document.getElementsByClassName('full-day-col') as HTMLCollectionOf<HTMLDivElement>;
		let largest = 0;
		for (let index = 0; index < els.length; index++) {
			const height = els[index].clientHeight;
			if (height > largest) {
				largest = height;
			}
		}
		for (let index = 0; index < els.length; index++) {
			els[index].style.minHeight = largest ? largest + 'px' : 'auto';
		}
	}

	render() {
		return (
			<div className="calendar-component container-fluid">
				<div className="selector year-selector">
					<Row>
						{[
							this.c.currentYear - 2,
							this.c.currentYear - 1,
							this.c.currentYear,
							this.c.currentYear + 1
						].map((year) => {
							return (
								<Col key={year} span={6} className="centered">
									<a
										onClick={() => {
											this.c.selectedYear = year;
											this.c.selectedMonth = 0;
											this.c.selectedDay = 0;
										}}
										className={
											(this.c.selectedYear === year ? 'selected' : '') +
											(this.c.currentYear === year ? ' current' : '')
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
						{this.c.monthsShort.map((monthShort, index) => {
							return (
								<Col key={monthShort} sm={2} xs={4} className="centered">
									<a
										onClick={() => {
											this.c.selectedMonth = index;
											this.c.selectedDay = 0;
										}}
										className={
											(this.c.selectedMonth === index ? 'selected' : '') +
											(this.c.currentMonth === index && this.c.currentYear === this.c.selectedYear
												? ' current'
												: '')
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
							{this.c.selectedMonthDays.map((day) => {
								return (
									<div
										key={day.date}
										onClick={() => {
											this.c.selectedDay = day.date;
										}}
										className={
											'day-col' +
											(this.c.selectedDay === day.date ? ' selected' : '') +
											(API.user.currentDoctor.holidays.indexOf(day.weekDay.index) > -1
												? ' holiday'
												: '') +
											(day.weekDay.index === 6 ? ' weekend' : '')
										}
									>
										<div className="day-name">{day.weekDay.dayShort}</div>
										<a
											className={
												'day-number info-row' +
												(day.date === this.c.currentDay &&
												this.c.currentMonth === this.c.selectedMonth &&
												this.c.selectedYear === this.c.currentYear
													? ' current'
													: '')
											}
										>
											{day.date + 1}
										</a>
									</div>
								);
							})}
						</div>
						<div>
							{this.c.selectedMonthDays.map((day) => {
								const number = appointments.appointmentsForDay(
									this.c.selectedYear,
									this.c.selectedMonth + 1,
									day.date + 1,
									undefined,
									this.showAll ? undefined : API.user.currentDoctor._id
								).length;
								return (
									<div
										key={day.date}
										onClick={() => {
											this.c.selectedDay = day.date;
										}}
										className={
											'day-col' +
											(day.weekDay.index === 6 ? ' weekend' : '') +
											(API.user.currentDoctor.holidays.indexOf(day.weekDay.index) > -1
												? ' holiday'
												: '')
										}
									>
										<div className={'info-row appointments-num num-' + number}>{number}</div>
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
									onText="All appointments"
									offText="My appointments only"
									onChanged={(newValue) => {
										this.showAll = newValue;
									}}
								/>
							</Col>
							<Col sm={12} md={18} xs={0} className="filter">
								<TextField
									placeholder="Type to filter"
									onChanged={(newVal) => (this.filter = newVal)}
								/>
							</Col>
						</Row>
					</div>
					<div id="full-day-cols">
						{this.c.selectedWeek.map((day) => {
							return (
								<div
									key={day.date}
									className={
										'full-day-col' +
										(API.user.currentDoctor.holidays.indexOf(day.weekDay.index) > -1
											? ' holiday'
											: '') +
										(this.c.selectedDay === day.date ? ' selected' : '')
									}
									onClick={() => {
										this.c.selectedDay = day.date;
									}}
									style={{
										width: (100 / this.c.selectedWeek.length).toString() + '%'
									}}
								>
									<h4>
										<b>{day.date + 1}</b>
										&nbsp;&nbsp;&nbsp;
										<span className="day-name">{day.weekDay.day}</span>
									</h4>
									{appointments
										.appointmentsForDay(
											this.c.selectedYear,
											this.c.selectedMonth + 1,
											day.date + 1,
											this.filter,
											this.showAll ? undefined : API.user.currentDoctor._id
										)
										.map((appointment) => {
											return (
												<div
													key={appointment._id}
													className="appointment"
													onClick={() => {
														this.appointment =
															appointments.list[
																appointments.getIndexByID(appointment._id)
															];
													}}
												>
													<treatmentsComponents.TreatmentLink
														id={appointment.treatmentID}
														small={true}
														notClickable
													/>
													<br />
													<patientsComponents.PatientLink
														notClickable
														id={appointment.patient._id}
													/>
													{appointment.doctors.map((doctor) => {
														return (
															<div key={doctor._id} className="m-t-5 fs-11">
																<Icon iconName="Contact" /> Dr. {doctor.name}
															</div>
														);
													})}
												</div>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>
				<AppointmentEditor
					appointment={this.appointment}
					onDismiss={() => (this.appointment = null)}
					onDelete={() => (this.appointment = null)}
				/>
			</div>
		);
	}
}
