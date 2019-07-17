import { SectionComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment, AppointmentsList, Patient, PrescriptionItem, StaffMember } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Dropdown, Link, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientAppointmentsPanel extends React.Component<
	{
		patient: Patient;
		currentUser: StaffMember;
		appointments: Appointment[];
		onAdd: (appointment: Appointment) => void;
		dateFormat: string;
		onDeleteAppointment: (id: string) => void;
		doDeleteAppointment: (id: string) => void;
		availableTreatments: { _id: string; expenses: number; type: string }[];
		availablePrescriptions: PrescriptionItem[];
		appointmentsForDay: (
			year: number,
			month: number,
			day: number,
			filter?: string | undefined,
			operatorID?: string | undefined
		) => Appointment[];
		currencySymbol: string;
		prescriptionsEnabled: boolean;
		timeTrackingEnabled: boolean;
		operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	},
	{}
> {
	@computed get canEdit() {
		return this.props.currentUser.canEditPatients;
	}

	l: AppointmentsList | null = null;

	render() {
		return (
			<div className="spa-panel appointments">
				<SectionComponent title={text(`Patient Appointments`)}>
					<AppointmentsList
						ref={l => (this.l = l)}
						list={this.props.appointments}
						currentUser={this.props.currentUser}
						dateFormat={this.props.dateFormat}
						onDeleteAppointment={id =>
							this.props.onDeleteAppointment(id)
						}
						doDeleteAppointment={id =>
							this.props.doDeleteAppointment(id)
						}
						availableTreatments={this.props.availableTreatments}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						operatingStaff={this.props.operatingStaff}
						operatorsAsSecondaryText
					/>
					{this.props.appointments.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.info}>
							{text("This patient does not have any appointment")}
						</MessageBar>
					)}
					<br />
					{this.canEdit ? (
						<div>
							{this.props.availableTreatments.length ? (
								<div>
									<Dropdown
										className="new-appointment"
										onChange={(ev, option) => {
											const apt = new Appointment();
											apt.patientID = this.props.patient._id;
											apt.date = new Date().getTime();
											apt.treatmentID = option!.key.toString();
											this.props.onAdd(apt);
											if (this.l) {
												this.l.selectedAppointmentID =
													apt._id;
											}
										}}
										onRenderItem={(item, render) => {
											return item!.key === "ph" ? (
												<span />
											) : (
												render!(item)
											);
										}}
										options={this.props.availableTreatments
											.map(treatment => ({
												text: treatment.type,
												key: treatment._id
											}))
											.concat([
												{
													key: "ph",
													text:
														"＋ Book new appointment"
												}
											])}
										selectedKey="ph"
									/>
								</div>
							) : (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{text(
										"You need to add treatments in the treatments section before being able to book new appointments"
									)}
									<br />
									<Link
										onClick={() => {
											core.router.go(["treatments"]);
										}}
									>
										Go to treatments
									</Link>
								</MessageBar>
							)}
						</div>
					) : (
						""
					)}
				</SectionComponent>
			</div>
		);
	}
}
