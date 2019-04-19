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
import { Appointment, Patient, PrescriptionItem, StaffMember, Treatment } from "@modules";
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
export class StatisticsPage extends React.Component<{
	onChooseStaffMember: (id: string) => void;
	setStartingDate: (timestamp: number) => void;
	setEndingDate: (timestamp: number) => void;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	onDeleteAppointment: (id: string) => void;
	selectedAppointments: Appointment[];
	dateFormat: string;
	currencySymbol: string;
	startingDate: number;
	endingDate: number;
	totalPayments: number;
	totalExpenses: number;
	totalProfits: number;
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	currentUser: StaffMember;
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	selectedAppointmentsByDay: {
		appointments: Appointment[];
		day: Date;
	}[];
	selectedPatients: Patient[];
	selectedFinancesByDay: {
		day: Date;
		appointments: {
			paid: number;
			expenses: number;
			profit: number;
			profitPercentage: number;
			isPaid: boolean;
			isDone: boolean;
		}[];
	}[];
	selectedTreatments: {
		treatment: Treatment;
		male: number;
		female: number;
		profit: number;
		times: number;
	}[];
}> {
	@observable appointment: Appointment | null = null;

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
											this.props.operatingStaff.map(
												member => {
													return {
														key: member._id,
														text: member.name
													};
												}
											)
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
						onDeleteAppointment={id => {
							this.props.onDeleteAppointment(id);
							this.appointment = null;
						}}
						availableTreatments={this.props.availableTreatments}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						currentUser={this.props.currentUser}
						dateFormat={this.props.dateFormat}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						operatingStaff={this.props.operatingStaff}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
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
						<div className={"chart-wrapper col-xs-12"}>
							<SectionComponent
								title={text("Appointments by Date")}
							>
								<AppointmentsByDateChart
									selectedAppointmentsByDay={
										this.props.selectedAppointmentsByDay
									}
									dateFormat={this.props.dateFormat}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12"}>
							<SectionComponent title={text("Finances by Date")}>
								<FinancesByDateChart
									dateFormat={this.props.dateFormat}
									selectedFinancesByDay={
										this.props.selectedFinancesByDay
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent title={text("Patients' Gender")}>
								<GenderPieChart
									selectedPatients={
										this.props.selectedPatients
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
										this.props.selectedAppointments
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
										this.props.selectedAppointments
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
										this.props.selectedTreatments
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
										this.props.selectedTreatments
									}
								/>
							</SectionComponent>
						</div>

						<div className={"chart-wrapper col-xs-12 col-lg-6"}>
							<SectionComponent title={text("Patients' Age")}>
								<AgeBarChart
									selectedPatients={
										this.props.selectedPatients
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
