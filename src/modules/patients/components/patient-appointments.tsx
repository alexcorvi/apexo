import { SectionComponent } from "@common-components";
import { text } from "@core";
import { Appointment, AppointmentsList, Patient, StaffMember } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientAppointmentsPanel extends React.Component<
	{
		patient: Patient;
		onAdd: (appointment: Appointment) => void;
		appointments: Appointment[];
		currentUser: StaffMember;
	},
	{}
> {
	@computed
	get appointments() {
		return this.props.appointments.filter(item => {
			return item.patientID === this.props.patient._id;
		});
	}

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
						list={this.appointments}
					/>
					{this.appointments.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.info}>
							{text("This patient does not have any appointment")}
						</MessageBar>
					)}
					<br />
					{this.canEdit ? (
						<DefaultButton
							onClick={() => {
								const apt = new Appointment();
								apt.patientID = this.props.patient._id;
								apt.date = new Date().getTime();
								this.props.onAdd(apt);
								if (this.l) {
									this.l.selectedAppointmentID = apt._id;
								}
							}}
							iconProps={{ iconName: "add" }}
							text={text("Book new appointment")}
						/>
					) : (
						""
					)}
				</SectionComponent>
			</div>
		);
	}
}
