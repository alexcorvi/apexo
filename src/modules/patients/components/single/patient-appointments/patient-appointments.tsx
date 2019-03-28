import * as React from "react";
import { appointmentsData } from "../../../../appointments";
import { AppointmentsList } from "../../../../../assets/components/appointments-list/appointments-list";
import { computed } from "mobx";
import {
	PrimaryButton,
	MessageBar,
	MessageBarType
} from "office-ui-fabric-react";
import { Patient } from "../../../data";
import { observer } from "mobx-react";
import "./patient-appointments.scss";
import { API } from "../../../../../core/index";
import { lang } from "../../../../../core/i18/i18";
import { Section } from "../../../../../assets/components/section/section";

@observer
export class PatientAppointments extends React.Component<
	{ patient: Patient },
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
				<Section title="Patient Appointments">
					<AppointmentsList
						ref={l => (this.l = l)}
						list={this.appointments}
					/>
					{this.appointments.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.info}>
							This patient does not have any appointment
						</MessageBar>
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
							{lang("Book new appointment")}
						</PrimaryButton>
					) : (
						""
					)}
				</Section>
			</div>
		);
	}
}
