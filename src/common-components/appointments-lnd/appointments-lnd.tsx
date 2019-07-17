import { Col, ProfileComponent, ProfileSquaredComponent } from "@common-components";
import { Appointment, Patient } from "@modules";
import { formatDate, isToday } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

export enum ALSecondaryText {
	patient,
	operators
}

export enum ALRightColumn {
	operators,
	deleteButton,
	patient
}

@observer
export class AppointmentsListNoDate extends React.Component<
	{
		appointments: Appointment[];
		onClick: (id: string) => void;
		dateFormat: string;
		secondaryText?: ALSecondaryText;
		rightColumn?: ALRightColumn;
		onDeleteAppointment: (id: string) => void;
		canDelete: boolean;
	},
	{}
> {
	secondaryText(appointment: Appointment) {
		if (this.props.secondaryText === ALSecondaryText.operators) {
			return appointment.operatingStaff.map(x => x.name).join(", ");
		} else {
			return (appointment.patient || { name: "" }).name;
		}
	}

	rightColumn(appointment: Appointment) {
		if (this.props.rightColumn === ALRightColumn.patient) {
			const patient = appointment.patient || new Patient();
			return (
				<div key={patient._id}>
					<Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
						<div key={patient._id} className="m-t-5 fs-11">
							{patient.name}
						</div>
					</Col>
					<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={0}>
						<ProfileComponent
							key={patient._id}
							name={patient.name}
							onRenderInitials={() => (
								<span>{patient.name[0]}</span>
							)}
							size={1}
							className="m-b-5"
						/>
					</Col>
				</div>
			);
		} else if (this.props.rightColumn === ALRightColumn.deleteButton) {
			return (
				<Icon
					iconName="delete"
					className="delete"
					onClick={ev => {
						this.props.onDeleteAppointment(appointment._id);
						ev.stopPropagation();
					}}
				/>
			);
		} else {
			return appointment.operatingStaff.map(operator => (
				<div key={operator._id}>
					<Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
						<div key={operator._id} className="m-t-5 fs-11">
							{operator.name}
						</div>
					</Col>
					<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={0}>
						<ProfileComponent
							key={operator._id}
							name={operator.name}
							onRenderInitials={() => (
								<span>{operator.name[0]}</span>
							)}
							size={1}
							className="m-b-5"
						/>
					</Col>
				</div>
			));
		}
	}

	dayString(appointment: Appointment) {
		if (isToday(appointment.date)) {
			return "Today";
		} else if (appointment.dueTomorrow) {
			return "Tomorrow";
		} else if (appointment.dueYesterday) {
			return "Yesterday";
		} else {
			return formatDate(appointment.date, this.props.dateFormat);
		}
	}

	timeString(appointment: Appointment) {
		if (appointment.isDone) {
			return "Done";
		} else if (appointment.isMissed) {
			return "Missed";
		} else {
			return appointment.formattedTime;
		}
	}

	render() {
		return (
			<table className="ms-table appointments-lnd">
				{this.props.appointments.map(appointment => (
					<tbody
						key={appointment._id}
						onClick={() => this.props.onClick(appointment._id)}
						className={`appointment-body ${
							appointment.isDone ? "done" : ""
						} ${appointment.isMissed ? "missed" : ""}`}
					>
						<tr>
							<td colSpan={2} className="hat-time">
								{`${this.dayString(
									appointment
								)} - ${this.timeString(appointment)}`}
							</td>
						</tr>
						<tr className="home-td today-appointment">
							<td>
								<ProfileSquaredComponent
									text={
										appointment.treatment
											? appointment.treatment.type
											: ""
									}
									subText={this.secondaryText(appointment)}
								/>
							</td>
							<td>{this.rightColumn(appointment)}</td>
						</tr>
					</tbody>
				))}
			</table>
		);
	}
}
