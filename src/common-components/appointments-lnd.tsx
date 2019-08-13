import * as CC from "@common-components";
import * as core from "@core";
import * as modules from "@modules";
import * as utils from "@utils";
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
		appointments: modules.Appointment[];
		onClick: (id: string) => void;
		secondaryText?: ALSecondaryText;
		rightColumn?: ALRightColumn;
		canDelete: boolean;
		className?: string;
	},
	{}
> {
	secondaryText(appointment: modules.Appointment) {
		if (this.props.secondaryText === ALSecondaryText.operators) {
			return appointment.operatingStaff.map(x => x.name).join(", ");
		} else {
			return (appointment.patient || { name: "" }).name;
		}
	}

	rightColumn(appointment: modules.Appointment) {
		if (this.props.rightColumn === ALRightColumn.patient) {
			const patient = appointment.patient || modules.patients!.new();
			return (
				<div key={patient._id}>
					<CC.Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
						<div key={patient._id} className="m-t-5 fs-11">
							{patient.name}
						</div>
					</CC.Col>
					<CC.Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={0}>
						<CC.ProfileComponent
							key={patient._id}
							name={patient.name}
							onRenderInitials={() => (
								<span>{patient.name[0]}</span>
							)}
							size={1}
							className="m-b-5"
						/>
					</CC.Col>
				</div>
			);
		} else if (this.props.rightColumn === ALRightColumn.deleteButton) {
			return (
				<Icon
					iconName="delete"
					className="delete"
					onClick={ev => {
						modules.appointments!.deleteModal(appointment._id);
						ev.stopPropagation();
					}}
				/>
			);
		} else {
			return appointment.operatingStaff.map(operator => (
				<div key={operator._id}>
					<CC.Col xxl={0} xl={0} lg={0} md={0} sm={0} xs={24}>
						<div key={operator._id} className="m-t-5 fs-11">
							{operator.name}
						</div>
					</CC.Col>
					<CC.Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={0}>
						<CC.ProfileComponent
							key={operator._id}
							name={operator.name}
							onRenderInitials={() => (
								<span>{operator.name[0]}</span>
							)}
							size={1}
							className="m-b-5"
						/>
					</CC.Col>
				</div>
			));
		}
	}

	dayString(appointment: modules.Appointment) {
		if (utils.isToday(appointment.date)) {
			return "Today";
		} else if (appointment.dueTomorrow) {
			return "Tomorrow";
		} else if (appointment.dueYesterday) {
			return "Yesterday";
		} else {
			return utils.formatDate(
				appointment.date,
				modules.setting!.getSetting("date_format")
			);
		}
	}

	timeString(appointment: modules.Appointment) {
		if (appointment.isDone) {
			return core.text("Done");
		} else if (appointment.isMissed) {
			return core.text("Missed");
		} else {
			return appointment.formattedTime;
		}
	}

	render() {
		return (
			<table
				className={`ms-table appointments-lnd ${this.props.className}`}
			>
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
								{`${core.text(
									this.dayString(appointment)
								)} - ${this.timeString(appointment)}`}
							</td>
						</tr>
						<tr>
							<td>
								<CC.ProfileSquaredComponent
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
