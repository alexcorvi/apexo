import { num } from "../../../utils/num";
import { Col, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	Appointment,
	AppointmentsList,
	Patient,
	PrescriptionItem,
	StaffMember,
} from "@modules";
import {
	DefaultButton,
	Dropdown,
	Link,
	MessageBar,
	MessageBarType,
	Toggle,
} from "office-ui-fabric-react";

@observer
export class PatientAppointmentsPanel extends React.Component<{
	patient: Patient;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	@computed get orthoCase() {
		return modules.orthoCases!.docs!.find(
			(oc) => oc.patientID === this.props.patient._id
		);
	}

	@computed get patientDoneAppointments() {
		return this.props.patient.appointments.filter((x) => x.isDone);
	}

	l: AppointmentsList | null = null;

	render() {
		return (
			<div className="spa-panel appointments">
				<SectionComponent title={text(`patient appointments`).h}>
					<AppointmentsList
						ref={(l) => (this.l = l)}
						list={this.props.patient.appointments}
						operatorsAsSecondaryText
					/>
					{this.props.patient.appointments.length ? (
						""
					) : (
						<div style={{ marginTop: 15 }}>
							<MessageBar messageBarType={MessageBarType.info}>
								{
									text(
										"this patient does not have any appointment"
									).c
								}
							</MessageBar>
						</div>
					)}
					<br />
					{this.canEdit ? (
						<div>
							{modules.treatments!.docs.length ? (
								<div>
									<Dropdown
										className="new-appointment"
										onChange={(ev, option) => {
											const newApt =
												modules.appointments!.new();
											newApt.patientID =
												this.props.patient._id;
											newApt.date = new Date().getTime();
											newApt.treatmentID =
												option!.key.toString();
											modules.appointments!.add(newApt);
											if (this.l) {
												this.l.selectedAppointmentID =
													newApt._id;
												core.router.select({
													sub: "details",
												});
											}
										}}
										onRenderItem={(item, render) => {
											return item!.key === "ph" ? (
												<span />
											) : (
												render!(item)
											);
										}}
										options={modules
											.treatments!.docs.map(
												(treatment) => ({
													text: treatment.type,
													key: treatment._id,
												})
											)
											.concat([
												{
													key: "ph",
													text:
														"＋ " +
														text(
															"book new appointment"
														).c,
												},
											])}
										selectedKey="ph"
									/>
								</div>
							) : (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{
										text(
											"you need to add treatments in the treatments section before being able to book new appointments"
										).c
									}
									<br />
									<Link
										onClick={() => {
											core.router.go([
												modules.treatmentsNamespace,
											]);
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

				{this.orthoCase ? (
					<SectionComponent
						title={
							text("orthodontic") +
							" " +
							text("started") +
							"/" +
							text("finished")
						}
					>
						<Row gutter={8}>
							<Col span={12}>
								<Toggle
									onText={text("started").c}
									offText={text("not started yet").c}
									checked={this.orthoCase.isStarted}
									onChange={(ev, val) =>
										(this.orthoCase!.isStarted = val!)
									}
									disabled={!this.canEdit}
								/>
								{this.orthoCase.isStarted ? (
									<Dropdown
										selectedKey={this.orthoCase.startedDate.toString()}
										options={this.patientDoneAppointments.map(
											(appointment) => {
												return {
													key: appointment.date.toString(),
													text: `${formatDate(
														appointment.date,
														modules.setting!.getSetting(
															"date_format"
														)
													)} ${
														appointment.treatment
															? `, ${appointment.treatment.type}`
															: ""
													}`,
												};
											}
										)}
										disabled={!this.canEdit}
										onChange={(ev, newValue) => {
											this.orthoCase!.startedDate = num(
												newValue!.key
											);
										}}
									/>
								) : (
									""
								)}
							</Col>{" "}
							<Col span={12}>
								<Toggle
									onText={text("finished").c}
									offText={text("not finished yet").c}
									checked={this.orthoCase.isFinished}
									onChange={(ev, val) =>
										(this.orthoCase!.isFinished = val!)
									}
									disabled={!this.canEdit}
								/>
								{this.orthoCase.isFinished ? (
									<Dropdown
										selectedKey={this.orthoCase.finishedDate.toString()}
										options={this.patientDoneAppointments.map(
											(appointment) => {
												return {
													key: appointment.date.toString(),
													text: `${formatDate(
														appointment.date,
														modules.setting!.getSetting(
															"date_format"
														)
													)} ${
														appointment.treatment
															? `, ${appointment.treatment.type}`
															: ""
													}`,
												};
											}
										)}
										disabled={!this.canEdit}
										onChange={(ev, newValue) => {
											this.orthoCase!.finishedDate = num(
												newValue!.key
											);
										}}
									/>
								) : (
									""
								)}
							</Col>
						</Row>
					</SectionComponent>
				) : (
					""
				)}
			</div>
		);
	}
}
