import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagType
	} from "@common-components";
import { text } from "@core";
import {
	ageBarChart,
	Appointment,
	appointmentsByDateChart,
	financesByDateChart,
	genderPieChart,
	mostAppliedTreatmentsChart,
	mostInvolvedTeethChart,
	Patient,
	treatmentsByGenderChart,
	treatmentsNumberChart
	} from "@modules";
import { formatDate, round } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Dropdown, Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";
const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class StatisticsPage extends React.Component<{
	selectedAppointments: Appointment[];
	dateFormat: string;
	currencySymbol: string;
	onChooseStaffMember: (id: string) => void;
	staffList: { name: string; _id: string }[];
	startingDate: number;
	setStartingDate: (timestamp: number) => void;
	endingDate: number;
	setEndingDate: (timestamp: number) => void;
	totalPayments: number;
	totalExpenses: number;
	totalProfits: number;
}> {
	@observable appointment: Appointment | null = null;

	@observable charts = [
		appointmentsByDateChart,
		financesByDateChart,
		treatmentsNumberChart,
		mostAppliedTreatmentsChart,
		genderPieChart,
		treatmentsByGenderChart,
		mostInvolvedTeethChart,
		ageBarChart
	];

	render() {
		return (
			<div className="sc-pg p-15 p-l-10 p-r-10">
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
					rows={this.props.selectedAppointments.map(appointment => ({
						id: appointment._id,
						searchableString: appointment.searchableString,
						cells: [
							{
								dataValue: (
									appointment.patient || new Patient()
								).name,
								component: (
									<ProfileComponent
										secondaryElement={
											<span>
												{formatDate(
													appointment.date,
													this.props.dateFormat
												)}{" "}
												/{" "}
												{appointment.operatingStaff.map(
													x => (
														<i key={x._id}>
															{x.name}{" "}
														</i>
													)
												)}
											</span>
										}
										name={
											(
												appointment!.patient ||
												new Patient()
											).name
										}
										size={3}
									/>
								),
								onClick: () => {
									this.appointment = appointment;
								},
								className: "no-label"
							},
							{
								dataValue: appointment.treatmentID,
								component: (
									<ProfileSquaredComponent
										text={
											appointment.treatment
												? appointment.treatment.type
												: ""
										}
										subText={formatDate(
											appointment.date,
											this.props.dateFormat
										)}
										size={3}
										onClick={() => {}}
									/>
								),
								className: "hidden-xs"
							},
							{
								dataValue: appointment.paidAmount,
								component: (
									<span>
										{this.props.currencySymbol +
											round(
												appointment.paidAmount
											).toString()}
									</span>
								),
								className: "hidden-xs"
							},
							{
								dataValue: appointment.outstandingAmount,
								component: (
									<span>
										{this.props.currencySymbol +
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
										{this.props.currencySymbol +
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
										{this.props.currencySymbol +
											round(
												appointment.profit
											).toString()}
									</span>
								),
								className: "hidden-xs"
							}
						]
					}))}
					farItems={[
						{
							key: "1",
							onRender: () => {
								return (
									<Dropdown
										placeholder={text(
											"Filter by staff member"
										)}
										defaultValue=""
										options={[
											{
												key: "",
												text: text("All members")
											}
										].concat(
											this.props.staffList.map(member => {
												return {
													key: member._id,
													text: member.name
												};
											})
										)}
										onChange={(ev, member) => {
											this.props.onChooseStaffMember(
												member!.key.toString()
											);
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
												this.props.setStartingDate(
													date.getTime()
												);
											}
										}}
										value={
											new Date(this.props.startingDate)
										}
										formatDate={d =>
											`${text("From")}: ${formatDate(
												d,
												this.props.dateFormat
											)}`
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
												date.setHours(0, 0, 0, 0);
												this.props.setEndingDate(
													date.getTime()
												);
											}
										}}
										value={new Date(this.props.endingDate)}
										formatDate={d =>
											`${text("Until")}: ${formatDate(
												d,
												this.props.dateFormat
											)}`
										}
									/>
								);
							}
						}
					]}
				/>

				{this.appointment ? (
					<AppointmentEditorPanel
						appointment={this.appointment}
						onDismiss={() => (this.appointment = null)}
						onDelete={() => (this.appointment = null)}
					/>
				) : (
					""
				)}

				<div className="container-fluid m-t-20 quick">
					<SectionComponent title={text("Quick stats")}>
						<Row>
							<Col sm={6} xs={12}>
								<label>
									{text("Appointments")}:{" "}
									<TagComponent
										text={round(
											this.props.selectedAppointments
												.length
										).toString()}
										type={TagType.primary}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{text("Payments")}:{" "}
									<TagComponent
										text={
											this.props.currencySymbol +
											round(
												this.props.totalPayments
											).toString()
										}
										type={TagType.warning}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{text("Expenses")}:{" "}
									<TagComponent
										text={
											this.props.currencySymbol +
											round(
												this.props.totalExpenses
											).toString()
										}
										type={TagType.danger}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{text("Profits")}:{" "}
									<TagComponent
										text={
											this.props.currencySymbol +
											round(
												this.props.totalProfits
											).toString()
										}
										type={TagType.success}
									/>
								</label>
							</Col>
						</Row>
					</SectionComponent>
				</div>

				<div className="charts container-fluid">
					<div className="row">
						{this.charts.map((chart, index) => {
							return (
								<div
									key={index + chart.name}
									className={
										"chart-wrapper " +
										(chart.className ||
											"col-xs-12 col-md-5 col-lg-4")
									}
								>
									<SectionComponent title={text(chart.name)}>
										<chart.Component />
									</SectionComponent>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
