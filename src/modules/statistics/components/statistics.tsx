import "./statistics.scss";

import * as React from "react";

import {
	Label as ColoredLabel,
	LabelType
} from "../../../assets/components/label/label.component";
import { DatePicker, Dropdown, Label } from "office-ui-fabric-react";
import { Row, Col } from "../../../assets/components/grid/index";
import { observer } from "mobx-react";
import { round } from "../../../assets/utils/round";
import { statistics } from "../data";
import { data } from "../../";
import { Section } from "../../../assets/components/section/section";
import { lang } from "../../../core/i18/i18";
import { DataTable } from "../../../assets/components/data-table/data-table.component";
import { Profile } from "../../../assets/components/profile/profile";
import * as dateUtils from "../../../assets/utils/date";
import { AppointmentEditor } from "../../appointments/components";
import { Appointment } from "../../appointments/data";
import { observable } from "mobx";

@observer
export class StatisticsComponent extends React.Component<{}, {}> {
	@observable appointment: Appointment | null = null;

	render() {
		return (
			<div className="statistics-component p-15 p-l-10 p-r-10">
				<DataTable
					maxItemsOnLoad={15}
					className={"appointments-data-table"}
					heads={[
						lang("Appointment"),
						lang("Operators"),
						lang("Paid amount"),
						lang("Expenses"),
						lang("Profits")
					]}
					rows={statistics.selectedAppointments.map(appointment => ({
						id: appointment._id,
						searchableString: appointment.searchableString,
						cells: [
							{
								dataValue: appointment.treatment
									? appointment.treatment.type
									: "",
								component: (
									<Profile
										secondaryElement={
											<span>
												{dateUtils.relativeFormat(
													appointment.date
												)}{" "}
												/{" "}
												{appointment.treatment
													? appointment.treatment.type
													: ""}
											</span>
										}
										name={appointment!.patient.name}
										size={3}
									/>
								),
								onClick: () => {
									this.appointment = appointment;
								},
								className: "no-label"
							},
							{
								dataValue: appointment.operatingStaff
									.map(x => x.name)
									.join(", "),
								component: (
									<div>
										{appointment.operatingStaff.map(
											staffMember => (
												<Profile
													name={staffMember.name}
													size={2}
												/>
											)
										)}
									</div>
								),
								className: "hidden-xs"
							},
							{
								dataValue: appointment.paidAmount,
								component: (
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												appointment.paidAmount
											).toString()
										}
										type={LabelType.warning}
									/>
								),
								className: "hidden-xs"
							},
							{
								dataValue: appointment.expenses,
								component: (
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												appointment.expenses
											).toString()
										}
										type={LabelType.info}
									/>
								),
								className: "hidden-xs"
							},
							{
								dataValue: appointment.profit,
								component: (
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(appointment.profit).toString()
										}
										type={LabelType.primary}
									/>
								),
								className: "hidden-xs"
							}
						]
					}))}
					commands={[
						{
							key: "1",
							onRender: () => {
								return (
									<Dropdown
										placeHolder={lang(
											"Filter By Staff Member"
										)}
										defaultValue=""
										options={[
											{
												key: "",
												text: lang("All Members")
											}
										].concat(
											data.staffData.staffMembers.list.map(
												member => {
													return {
														key: member._id,
														text: member.name
													};
												}
											)
										)}
										onChanged={member => {
											statistics.filterByMember = member.key.toString();
										}}
									/>
								);
							}
						},
						{
							key: "2",
							onRender: () => {
								return (
									<DatePicker
										onSelectDate={date => {
											if (date) {
												statistics.startingDate = statistics.getDayStartingPoint(
													date.getTime()
												);
											}
										}}
										value={
											new Date(statistics.startingDate)
										}
									/>
								);
							}
						},
						{
							key: "3",
							onRender: () => {
								return (
									<DatePicker
										onSelectDate={date => {
											if (date) {
												statistics.endingDate = statistics.getDayStartingPoint(
													date.getTime()
												);
											}
										}}
										value={new Date(statistics.endingDate)}
									/>
								);
							}
						}
					]}
				/>

				<AppointmentEditor
					appointment={this.appointment}
					onDismiss={() => (this.appointment = null)}
					onDelete={() => (this.appointment = null)}
				/>

				<div className="container-fluid m-t-20 quick">
					<Section title={lang("Quick stats")} showByDefault>
						<Row>
							<Col sm={6} xs={12}>
								<label>
									{lang("Appointments")}:{" "}
									<ColoredLabel
										text={round(
											statistics.selectedAppointments
												.length
										).toString()}
										type={LabelType.primary}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Payments")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalPayments
											).toString()
										}
										type={LabelType.warning}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Expenses")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalExpenses
											).toString()
										}
										type={LabelType.danger}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Profits")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalProfits
											).toString()
										}
										type={LabelType.success}
									/>
								</label>
							</Col>
						</Row>
					</Section>
				</div>

				<div className="charts container-fluid">
					<div className="row">
						{statistics.charts.map((chart, index) => {
							return (
								<div
									key={index + chart.name}
									className={
										"chart-wrapper " +
										(chart.className ||
											"col-xs-12 col-md-5 col-lg-4")
									}
								>
									<Section title={chart.name} showByDefault>
										<chart.Component />
									</Section>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
