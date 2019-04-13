import { ProfileSquaredComponent } from "@common-components";
import { Appointment, appointments, setting } from "@modules";
import { PatientLinkComponent } from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class AppointmentThumbComponent extends React.Component<
	{
		appointment: Appointment;

		onClick?: () => void;

		canDelete?: boolean;

		className?: string;

		hideDate?: boolean;

		showPatient?: boolean;

		hideTreatment?: boolean;
	},
	{}
> {
	@computed
	get className() {
		let className = "atc-c";
		className = className + " labeled";
		if (this.props.appointment.dueToday) {
			className = className + " today-due";
		}
		if (this.props.appointment.dueTomorrow) {
			className = className + " tomorrow-due";
		}
		if (this.props.appointment.missed) {
			className = className + " missed";
		}
		if (this.props.appointment.isOutstanding) {
			className = className + " to-be-paid";
		}
		if (this.props.appointment.isOverpaid) {
			className = className + " over-paid";
		}
		if (this.props.appointment.future) {
			className = className + " future";
		}
		if (this.props.onClick) {
			className = className + " clickable";
		}
		return className;
	}

	el: HTMLElement | undefined;
	render() {
		return (
			<div
				ref={el => (el ? (this.el = el) : "")}
				className={this.className}
				onClick={this.props.onClick || (() => {})}
			>
				{this.props.showPatient ? (
					<PatientLinkComponent
						className="appointment-patient-link"
						id={this.props.appointment.patientID}
					/>
				) : (
					""
				)}
				<div className="m-b-5">
					<ProfileSquaredComponent
						text={
							this.props.appointment.treatment
								? this.props.appointment.treatment.type
								: ""
						}
						subText={formatDate(
							this.props.appointment.date,
							setting.getSetting("date_format")
						)}
						size={3}
					/>
				</div>
				{this.props.canDelete ? (
					<Icon
						iconName="delete"
						className="delete"
						onMouseEnter={() => {
							this.el!.className =
								this.el!.className + " to-delete";
						}}
						onMouseLeave={() => {
							this.el!.className = this.el!.className.split(
								" to-delete"
							).join("");
						}}
						onClick={ev => {
							appointments.deleteModal(
								this.props.appointment._id
							);
							ev.stopPropagation();
						}}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
