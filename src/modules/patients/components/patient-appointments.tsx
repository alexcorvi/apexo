import "./patient-appointments.scss";
import { SectionComponent } from "@common-components";
import { lang, user } from "@core";
import { Appointment, appointments, AppointmentsList, Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientAppointmentsPanel extends React.Component<
	{ patient: Patient },
	{}
> {
	@computed
	get appointments() {
		return appointments.list.filter(item => {
			return item.patientID === this.props.patient._id;
		});
	}

	@computed get canEdit() {
		return user.currentUser.canEditPatients;
	}

	l: AppointmentsList | null = null;

	render() {
		return (
			<div className="single-patient-appointments appointments">
				<SectionComponent title={lang(`Patient Appointments`)}>
					<AppointmentsList
						ref={l => (this.l = l)}
						list={this.appointments}
					/>
					{this.appointments.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.info}>
							{lang("This patient does not have any appointment")}
						</MessageBar>
					)}
					<br />
					{this.canEdit ? (
						<DefaultButton
							onClick={() => {
								const apt = new Appointment();
								apt.patientID = this.props.patient._id;
								apt.date = new Date().getTime();
								appointments.list.push(apt);
								if (this.l) {
									this.l.selectedAppointmentID = apt._id;
								}
							}}
							iconProps={{ iconName: "add" }}
							text={lang("Book new appointment")}
						/>
					) : (
						""
					)}
				</SectionComponent>
			</div>
		);
	}
}
