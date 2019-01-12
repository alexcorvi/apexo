import * as React from "react";
import { appointmentsData } from "../../../appointments";
import { AppointmentsList } from "../../../../assets/components/appointments-list/appointments-list";
import { computed } from "mobx";
import { PrimaryButton } from "office-ui-fabric-react";
import { Patient } from "../../data";
import { observer } from "mobx-react";
import "./patient-appointments.scss";
import { API } from "../../../../core/index";

@observer
export class PatientAppointments extends React.Component<
	{ patient: Patient; hideTitle?: boolean },
	{}
> {
	@computed
	get appointments() {
		return appointmentsData.appointments.list.filter(item => {
			return item.patientID === this.props.patient._id;
		});
	}

	@computed get canEdit() {
		return API.user.currentUser.canEditPatients;
	}

	l: AppointmentsList | null = null;

	render() {
		return (
			<div className="single-patient-appointments appointments">
				{this.props.hideTitle ? "" : <h3>Appointments</h3>}
				<AppointmentsList
					ref={l => (this.l = l)}
					list={this.appointments}
				/>
				{this.appointments.length ? (
					""
				) : (
					<p className="no-appointments">
						This patient does not have any appointment.
					</p>
				)}
				<br />
				{this.canEdit ? (
					<PrimaryButton
						onClick={() => {
							const apt = new appointmentsData.Appointment();
							apt.patientID = this.props.patient._id;
							apt.date = new Date().getTime();
							appointmentsData.appointments.list.push(apt);
							if (this.l) {
								this.l.selectedAppointmentID = apt._id;
							}
						}}
						iconProps={{ iconName: "add" }}
					>
						Book New Appointment
					</PrimaryButton>
				) : (
					""
				)}
			</div>
		);
	}
}
