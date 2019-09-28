import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	tagType
	} from "@common-components";
import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { firstDayOfTheWeekDayPicker, formatDate, round } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Dropdown, Label, Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";
const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

const AgeBarChart = loadable({
	loader: async () => (await import("./chart.age")).AgeBarChart,
	loading: () => <Shimmer />
});
const AppointmentsByDateChart = loadable({
	loader: async () =>
		(await import("./chart.appointments-date")).AppointmentsByDateChart,
	loading: () => <Shimmer />
});
const FinancesByDateChart = loadable({
	loader: async () => (await import("./chart.finance")).FinancesByDateChart,
	loading: () => <Shimmer />
});
const GenderPieChart = loadable({
	loader: async () => (await import("./chart.gender")).GenderPieChart,
	loading: () => <Shimmer />
});
const MostAppliedTreatmentsChart = loadable({
	loader: async () =>
		(await import("./chart.most-applied-treatments"))
			.MostAppliedTreatmentsChart,
	loading: () => <Shimmer />
});
const MostInvolvedTeethChart = loadable({
	loader: async () =>
		(await import("./chart.most-involved-teeth")).MostInvolvedTeethChart,
	loading: () => <Shimmer />
});
const TreatmentsByGenderChart = loadable({
	loader: async () =>
		(await import("./chart.treatments-gender")).TreatmentsByGenderChart,
	loading: () => <Shimmer />
});
const TreatmentsNumberChart = loadable({
	loader: async () =>
		(await import("./chart.treatments-number")).TreatmentsNumberChart,
	loading: () => <Shimmer />
});

@observer
export class StatisticsPage extends React.Component {
	@computed get appointment() {
		return modules.appointments!.docs.find(
			x => x._id === core.router.selectedID
		);
	}

	render() {
		return (
			<div className="sc-pg">
				<DataTableComponent
					maxItemsOnLoad={20}
					className={"appointments-data-table"}
					heads={[
						text("Appointment"),
						text("Treatment"),
						text("Paid"),
						text("Outstanding"),
						text("Expenses"),
						text("Profits")
					]}
					rows={
						core.router.innerWidth > 999
							? modules.statistics.selectedAppointments.map(
									appointment => ({
										id: appointment._id,
										searchableString:
											appointment.searchableString,
										cells: [
											{
												dataValue: (
													appointment.patient || {
														name: ""
													}
												).name,
												component: (
													<ProfileComponent
														secondaryElement={
															<span>
																{formatDate(
																	appointment.date,
																	modules.setting!.getSetting(
																		"date_format"
																	)
																)}{" "}
																/{" "}
																{appointment.operatingStaff.map(
																	x => (
																		<i
																			key={
																				x._id
																			}
																		>
																			{
																				x.name
																			}{" "}
																		</i>
																	)
																)}
															</span>
														}
														name={
															(
																appointment!
																	.patient || {
																	name: ""
																}
															).name
														}
														size={3}
													/>
												),
												onClick: () => {
													core.router.select({
														id: appointment._id,
														sub: "details"
													});
												},
												className: "no-label"
											},
											{
												dataValue:
													appointment.treatmentID,
												component: (
													<ProfileSquaredComponent
														text={
															appointment.treatment
																? appointment
																		.treatment
																		.type
																: ""
														}
														subText={formatDate(
															appointment.date,
															modules.setting!.getSetting(
																"date_format"
															)
														)}
														size={3}
													/>
												),
												className: "hidden-xs"
											},
											{
												dataValue:
													appointment.paidAmount,
												component: (
													<span>
														{modules.setting!.getSetting(
															"currencySymbol"
														) +
															round(
																appointment.paidAmount
															).toString()}
													</span>
												),
												className: "hidden-xs"
											},
											{
												dataValue:
													appointment.outstandingAmount,
												component: (
													<span>
														{modules.setting!.getSetting(
															"currencySymbol"
														) +
															round(
																appointment.outstandingAmount
															).toString()}
													</span>
												),
												className: "hidden-xs"
											},
											{
												dataValue: appointment.expenses,
												component: (
													<span>
														{modules.setting!.getSetting(
															"currencySymbol"
														) +
															round(
																appointment.expenses
															).toString()}
													</span>
												),
												className: "hidden-xs"
											},
											{
												dataValue: appointment.profit,
												component: (
													<span>
														{modules.setting!.getSetting(
															"currencySymbol"
														) +
															round(
																appointment.profit
															).toString()}
													</span>
												),
												className: "hidden-xs"
											}
										]
									})
							  )
							: []
					}
					farItems={[
						{
							key: "1",
							onRender: () => {
								return (
									<Dropdown
										defaultSelectedKey="all"
										options={[
											{
												key: "all",
												text: text("All staff members")
											}
										].concat(
											modules.staff!.operatingStaff.map(
												member => {
													return {
														key: member._id,
														text: member.name
													};
												}
											)
										)}
										onChange={(ev, member) => {
											modules.statistics.specificMemberID = member!.key.toString();
										}}
									/>
								);
							}
						}
					]}
					hideSearch
					commands={[
						{
							key: "2",
							onRender: () => {
								return (
									<DatePicker
										onSelectDate={date => {
											if (date) {
												date.setHours(0, 0, 0, 0);
												modules.statistics.startingDate = date.getTime();
											}
										}}
										value={
											new Date(
												modules.statistics.startingDate
											)
										}
										formatDate={d =>
											`${text("From")}: ${formatDate(
												d,
												modules.setting!.getSetting(
													"date_format"
												)
											)}`
										}
										firstDayOfWeek={firstDayOfTheWeekDayPicker(
											modules.setting!.getSetting(
												"weekend_num"
											)
										)}
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
												date.setHours(0, 0, 0, 0);
												modules.statistics.endingDate = date.getTime();
											}
										}}
										value={
											new Date(
												modules.statistics.endingDate
											)
										}
										formatDate={d =>
											`${text("Until")}: ${formatDate(
												d,
												modules.setting!.getSetting(
													"date_format"
												)
											)}`
										}
										firstDayOfWeek={firstDayOfTheWeekDayPicker(
											modules.setting!.getSetting(
												"weekend_num"
											)
										)}
									/>
								);
							}
						}
					]}
				/>

				{this.appointment ? (
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => core.router.unSelect()}
					/>
				) : (
					""
				)}

				<div className="totals">
					<Row>
						<Col sm={6} xs={12}>
							<Label>
								{text("Appointments")}:{" "}
								<TagComponent
									text={round(
										modules.statistics.selectedAppointments
											.length
									).toString()}
									type={tagType.primary}
								/>
							</Label>
						</Col>
						<Col sm={6} xs={12}>
							<Label>
								{text("Payments")}:{" "}
								<TagComponent
									text={
										modules.setting!.getSetting(
											"currencySymbol"
										) +
										round(
											modules.statistics.totalPayments
										).toString()
									}
									type={tagType.warning}
								/>
							</Label>
						</Col>
						<Col sm={6} xs={12}>
							<Label>
								{text("Expenses")}:{" "}
								<TagComponent
									text={
										modules.setting!.getSetting(
											"currencySymbol"
										) +
										round(
											modules.statistics.totalExpenses
										).toString()
									}
									type={tagType.danger}
								/>
							</Label>
						</Col>
						<Col sm={6} xs={12}>
							<Label>
								{text("Profits")}:{" "}
								<TagComponent
									text={
										modules.setting!.getSetting(
											"currencySymbol"
										) +
										round(
											modules.statistics.totalProfits
										).toString()
									}
									type={tagType.success}
								/>
							</Label>
						</Col>
					</Row>
				</div>

				<div className="charts container-fluid">
					<div className="row">
						<div className={"chart-wrapper col-xs-12"}>
							<SectionComponent
								title={text("Appointments by Date")}
							>
								<AppointmentsByDateChart
									selectedAppointmentsByDay={
										modules.statistics
											.selectedAppointmentsByDay
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12"}>
							<SectionComponent title={text("Finances by Date")}>
								<FinancesByDateChart
									dateFormat={modules.setting!.getSetting(
										"date_format"
									)}
									selectedFinancesByDay={
										modules.statistics.selectedFinancesByDay
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent title={text("Patients' Gender")}>
								<GenderPieChart
									selectedPatients={
										modules.statistics.selectedPatients
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent
								title={text("Most Applied Treatments")}
							>
								<MostAppliedTreatmentsChart
									selectedAppointments={
										modules.statistics.selectedAppointments
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent
								title={text("Most Involved Teeth")}
							>
								<MostInvolvedTeethChart
									selectedAppointments={
										modules.statistics.selectedAppointments
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent
								title={text("Treatments by gender")}
							>
								<TreatmentsByGenderChart
									selectedTreatments={
										modules.statistics.selectedTreatments
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent
								title={text("Treatments by profits")}
							>
								<TreatmentsNumberChart
									selectedTreatments={
										modules.statistics.selectedTreatments
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent title={text("Patients' Age")}>
								<AgeBarChart
									selectedPatients={
										modules.statistics.selectedPatients
									}
								/>
							</SectionComponent>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
