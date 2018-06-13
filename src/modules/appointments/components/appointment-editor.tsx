import './appointment-editor.scss';

import * as React from 'react';

import { Appointment, appointments } from '../data';
import { DatePicker, Dropdown, Icon, Panel, PanelType, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { Label, LabelType } from '../../../assets/components/label/label.component';
import { computed, observable, toJS } from 'mobx';
import { Row, Col } from 'antd';
import { API } from '../../../core';
import { Profile } from '../../../assets/components/profile/profile';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { convert } from '../../../assets/utils/teeth-numbering-systems';
import { doctorsData } from '../../doctors';
import { observer } from 'mobx-react';
import { patientsData } from '../../patients';
import { prescriptionsData } from '../../prescriptions';
import { round } from '../../../assets/utils/round';
import { settingsData } from '../../settings';
import { treatmentsData } from '../../treatments';
import { Gallery } from '../../../assets/components/gallery/gallery';
import { Treatment } from '../../treatments/data/class.treatment';

@observer
export class AppointmentEditor extends React.Component<
	{
		appointment: Appointment | null;
		onDismiss: () => void;
		onDelete: () => void;
	},
	{}
> {
	timerInput: TextField[] = [];
	@computed
	get otherAppointmentsNumber() {
		const appointment = this.props.appointment;
		if (appointment === null) {
			return [].length - 1;
		}
		const date = new Date(appointment.date);
		return appointments
			.appointmentsForDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
			.filter((a) => a._id !== appointment._id).length;
	}

	@computed
	get treatmentOptions() {
		const list: Treatment[] = JSON.parse(JSON.stringify(treatmentsData.treatments.list));
		if (this.props.appointment && this.props.appointment.treatmentID.indexOf('|') > -1) {
			const arr = this.props.appointment.treatmentID.split('|');
			const _id = this.props.appointment.treatmentID;
			const type = arr[0];
			const expenses = Number(arr[1]);
			list.push(new Treatment({ _id, expenses, type }));
		}
		return list;
	}

	render() {
		return (
			<Panel
				isOpen={!!this.props.appointment}
				type={PanelType.medium}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={this.props.onDismiss}
			>
				{this.props.appointment ? (
					<div className="appointment-editor">
						<div className="m-b-15 appointment-top">
							<Profile
								name={this.props.appointment.patient.name}
								secondaryText={patientsData.genderToString(this.props.appointment.patient.gender)}
								tertiaryText={`${this.props.appointment.patient.age} years old`}
								onClick={() =>
									this.props.appointment
										? API.router.go([ 'patients', this.props.appointment.patient._id ])
										: ''}
							/>
						</div>
						<hr className="appointment-hr" />
						<Row gutter={6}>
							<Col sm={12}>
								<div className="appointment-input date">
									<label>Date: </label>
									<DatePicker
										className="appointment-date"
										placeholder="Select a date..."
										value={new Date(this.props.appointment.date)}
										onSelectDate={(date) => {
											if (date) {
												if (this.props.appointment === null) {
													return;
												}
												this.props.appointment.setDate(date.getTime());
											}
										}}
									/>
									<p className="insight">
										With{' '}
										<span className={'num-' + this.otherAppointmentsNumber}>
											{this.otherAppointmentsNumber}
										</span>{' '}
										other appointment{this.otherAppointmentsNumber > 1 ? 's' : ''}
									</p>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input date">
									<label>Operating Doctors: </label>
									<TagInput
										placeholder="Select operating doctors..."
										options={doctorsData.doctors.list
											.filter((doctor) => {
												if (!this.props.appointment) {
													return;
												}
												return (
													doctor.onDuty.indexOf(
														new Date(this.props.appointment.date).getDay()
													) !== -1
												);
											})
											.map((x) => ({ key: x._id, text: x.name }))}
										value={this.props.appointment.doctors.map((x) => ({
											key: x._id,
											text: x.name
										}))}
										strict={true}
										onChange={(newValue) => {
											if (!this.props.appointment) {
												return;
											}
											this.props.appointment.doctorsID = newValue.map((x) => x.key);
										}}
									/>
								</div>
							</Col>
						</Row>

						<hr className="appointment-hr" />
						<Row gutter={6}>
							<Col sm={12}>
								<div className="appointment-input diagnosis">
									<label>Complaint: </label>
									<TextField
										value={this.props.appointment.complaint}
										onChanged={(newValue) => {
											if (!this.props.appointment) {
												return;
											}
											this.props.appointment.complaint = newValue;
										}}
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input diagnosis">
									<label>Diagnosis: </label>
									<TextField
										value={this.props.appointment.diagnosis}
										onChanged={(newValue) => {
											if (!this.props.appointment) {
												return;
											}
											this.props.appointment.diagnosis = newValue;
										}}
									/>
								</div>
							</Col>
						</Row>

						<Row gutter={6}>
							<Col sm={12}>
								<div className="appointment-input treatment">
									<label>Treatment: </label>
									<Dropdown
										className="treatment-type"
										selectedKey={this.props.appointment.treatmentID}
										options={this.treatmentOptions.map((tr) => {
											return {
												key: tr._id,
												text: tr.type
											};
										})}
										onChanged={(newValue) => {
											if (this.props.appointment) {
												this.props.appointment.treatmentID = newValue.key.toString();
											}
										}}
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input involved-teeth">
									<label>Involved Teeth: </label>
									<TagInput
										placeholder="Enter tooth number..."
										value={this.props.appointment.involvedTeeth.map((x) => ({
											key: x.toString(),
											text: x.toString()
										}))}
										strict={true}
										options={patientsData.ISOTeethArr.map((x) => {
											return {
												key: x.toString(),
												text: x.toString()
											};
										})}
										formatText={(x) => `${x.toString()} - ${convert(Number(x)).Palmer}`}
										onChange={(newValue) => {
											if (!this.props.appointment) {
												return;
											}
											this.props.appointment.involvedTeeth = newValue.map((x) => Number(x.key));
										}}
									/>
								</div>
							</Col>
						</Row>

						<hr className="appointment-hr" />

						<Row gutter={6}>
							<Col sm={12}>
								<div className="appointment-input time">
									<label>Time (Hours, minutes, seconds)</label>
									<TextField
										className="time-input hours"
										type="number"
										ref={(el) => (el ? (this.timerInput[0] = el) : '')}
										value={this.formatMillisecondsToTime(this.props.appointment.time).hours}
										onChanged={(newVal) => this.manuallyUpdateTime()}
									/>
									<TextField
										className="time-input minutes"
										type="number"
										ref={(el) => (el ? (this.timerInput[1] = el) : '')}
										value={this.formatMillisecondsToTime(this.props.appointment.time).minutes}
										onChanged={(newVal) => this.manuallyUpdateTime()}
									/>
									<TextField
										className="time-input seconds"
										type="number"
										ref={(el) => (el ? (this.timerInput[2] = el) : '')}
										value={this.formatMillisecondsToTime(this.props.appointment.time).seconds}
										onChanged={(newVal) => {
											this.manuallyUpdateTime();
										}}
									/>
									{this.props.appointment.timer ? (
										<PrimaryButton
											iconProps={{ iconName: 'Timer' }}
											className="appendage"
											style={{ background: '#ff9800' }}
											text="Stop"
											onClick={() => {
												if (!this.props.appointment) {
													return;
												}
												const timer = this.props.appointment.timer;
												if (timer) {
													clearInterval(timer);
												}
												this.props.appointment.timer = null;
											}}
										/>
									) : (
										<PrimaryButton
											iconProps={{ iconName: 'Timer' }}
											className="appendage"
											text="Start"
											onClick={() => {
												if (!this.props.appointment) {
													return;
												}
												const i = appointments.getIndexByID(this.props.appointment._id);
												const appointment = appointments.list[i];
												this.props.appointment.timer = window.setInterval(() => {
													appointment.time = appointment.time + 1000;
												}, 1000);
											}}
										/>
									)}
									<p className="payment-insight">
										<Label
											text={
												'Time value: ' +
												settingsData.settings.getSetting('currencySymbol') +
												round(this.props.appointment.spentTimeValue).toString()
											}
											type={LabelType.info}
										/>
										<br />
										<Label
											text={
												'Expenses: ' +
												settingsData.settings.getSetting('currencySymbol') +
												round(this.props.appointment.expenses).toString()
											}
											type={LabelType.info}
										/>
									</p>
								</div>
							</Col>
							<Col sm={12}>
								<div className="appointment-input paid">
									<label>Final Price</label>
									<TextField
										type="number"
										value={this.props.appointment.paidAmount.toString()}
										onChanged={(newVal) => {
											if (this.props.appointment === null) {
												return;
											}
											this.props.appointment.paidAmount = Number(newVal);
										}}
										prefix={settingsData.settings.getSetting('currencySymbol')}
									/>
									<p className="payment-insight">
										<Label
											text={
												'Profit: ' +
												settingsData.settings.getSetting('currencySymbol') +
												round(this.props.appointment.profit).toString()
											}
											type={LabelType.success}
										/>
										<br />
										<Label
											text={
												'Profit percentage: ' +
												round(this.props.appointment.profitPercentage * 100).toString() +
												'%'
											}
											type={LabelType.success}
										/>
									</p>
								</div>
							</Col>
						</Row>
						{settingsData.settings.getSetting('module_prescriptions') ? (
							<div>
								<hr className="appointment-hr" />
								<div className="appointment-input prescription">
									<label>Prescription: </label>
									<TagInput
										className="prescription"
										value={this.props.appointment.prescriptions.map((x) => ({
											key: x.id,
											text: x.prescription
										}))}
										options={prescriptionsData.prescriptions.list.map(this.prescriptionToTagInput)}
										onChange={(newValue) => {
											if (!this.props.appointment) {
												return;
											}
											this.props.appointment.prescriptions = newValue.map((x) => ({
												id: x.key,
												prescription: x.text
											}));
										}}
										strict={true}
										placeholder="Enter prescription..."
									/>
								</div>
							</div>
						) : (
							''
						)}

						<hr className="appointment-hr" />

						<Gallery
							gallery={this.props.appointment.records}
							onChange={(list) => {
								if (!this.props.appointment) {
									return;
								}
								this.props.appointment.records = list;
							}}
						/>
						<br />

						<hr className="appointment-hr" />
						<Row gutter={6}>
							<Col sm={8}>
								<Toggle
									defaultChecked={this.props.appointment.paid}
									onText="Paid"
									offText="Unpaid"
									onChanged={(newVal) => {
										if (this.props.appointment === null) {
											return;
										}
										this.props.appointment.paid = newVal;
									}}
								/>
							</Col>
							<Col sm={8}>
								<Toggle
									defaultChecked={this.props.appointment.done}
									onText="Done"
									offText="Not Done"
									onChanged={(newVal) => {
										if (this.props.appointment === null) {
											return;
										}
										this.props.appointment.done = newVal;
									}}
								/>
							</Col>
							<Col sm={8}>
								<PrimaryButton
									className="delete"
									iconProps={{
										iconName: 'trash'
									}}
									text="Delete"
									onClick={() => {
										const appointment = this.props.appointment;
										if (!appointment) {
											return;
										}
										appointments.deleteModal(appointment._id);
										this.props.onDelete();
									}}
								/>
							</Col>
						</Row>
						<br />
						<br />
						<br />
					</div>
				) : (
					''
				)}
			</Panel>
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
			return n > 9 ? n.toString() : '0' + n.toString();
		}
	}
	manuallyUpdateTime() {
		const msInSecond = 1000;
		const msInMinute = msInSecond * 60;
		const msInHour = msInMinute * 60;
		if (!this.props.appointment) {
			return;
		}
		const hours = Number(this.timerInput[0].value);
		const minutes = Number(this.timerInput[1].value);
		const seconds = Number(this.timerInput[2].value);
		if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
			return;
		}
		this.props.appointment.time = hours * msInHour + minutes * msInMinute + seconds * msInSecond;
	}
	prescriptionToTagInput(p: prescriptionsData.PrescriptionItem) {
		return {
			key: p._id,
			text: `${p.name}: ${p.doseInMg}mg	${prescriptionsData.itemFormToString(p.form)}	${p.timesPerDay}X1`
		};
	}
}
