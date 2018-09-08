import * as dateUtils from '../../../assets/utils/date';
import * as React from 'react';
import { appointmentsComponents, appointmentsData } from '../../../modules/appointments';
import { computed } from 'mobx';
import { Icon } from 'office-ui-fabric-react';
import { observer } from 'mobx-react';
import { patientsComponents } from '../../../modules/patients';
import { ProfileSquared } from '../profile/profile-squared';
import { treatmentsComponents, treatmentsData } from '../../../modules/treatments';
import './appointment-thumb.scss';

@observer
export class AppointmentThumb extends React.Component<
	{
		/**
	 * Appointment to view a thumb of
	 * 
	 * @type {Appointment}
	 */
		appointment: appointmentsData.Appointment;
		/**
		 * Callback for click
		 * 
		 */
		onClick?: () => void;
		/**
		 * View a delete button
		 * 
		 * @type {boolean}
		 */
		canDelete?: boolean;
		/**
		 * Add custom className
		 * 
		 * @type {string}
		 */
		className?: string;
		/**
		 * add :before labels
		 * 
		 * @type {boolean}
		 */
		labeled?: boolean;

		/**
		 * show date thumb
		*/
		hideDate?: boolean;

		/**
		 * show patient
		 */
		showPatient?: boolean;

		hideTreatment?: boolean;
	},
	{}
> {
	@computed
	get className() {
		let className = 'appointment-thumbnail-component';
		if (this.props.labeled) {
			className = className + ' labeled';
			if (this.props.appointment.dueToday) {
				className = className + ' today-due';
			}
			if (this.props.appointment.dueTomorrow) {
				className = className + ' tomorrow-due';
			}
			if (this.props.appointment.missed) {
				className = className + ' missed';
			}
			if (this.props.appointment.outstanding) {
				className = className + ' to-be-paid';
			}
			if (this.props.appointment.future) {
				className = className + ' future';
			}
		}
		if (this.props.onClick) {
			className = className + ' clickable';
		}
		return className;
	}

	el: HTMLElement | undefined;
	render() {
		const treatmentID = this.props.appointment.treatmentID;
		return (
			<div
				ref={(el) => (el ? (this.el = el) : '')}
				className={this.className}
				onClick={this.props.onClick || (() => {})}
			>
				{this.props.showPatient ? (
					<patientsComponents.PatientLink
						className="appointment-patient-link"
						id={this.props.appointment.patientID}
					/>
				) : (
					''
				)}{' '}
				{this.props.labeled ? (
					<div className="m-b-5">
						<ProfileSquared
							text={this.props.appointment.treatment.type}
							subText={dateUtils.relativeFormat(this.props.appointment.date)}
							size={3}
						/>
					</div>
				) : (
					<div>
						{' '}
						{this.props.hideTreatment ? (
							''
						) : (
							<div className="m-b-5">
								<treatmentsComponents.TreatmentLink notClickable small id={treatmentID} />
							</div>
						)}
						{this.props.hideDate ? (
							''
						) : (
							<appointmentsComponents.DateLink
								notClickable
								className="hidden-xs"
								time={this.props.appointment.date}
								format="{d}/{m}/{yyyy} ({RR})"
							/>
						)}
					</div>
				)}
				{this.props.canDelete ? (
					<Icon
						iconName="delete"
						className="delete"
						onMouseEnter={() => {
							if (!this.el) {
								return;
							}
							this.el.className = this.el.className + ' to-delete';
						}}
						onMouseLeave={() => {
							if (!this.el) {
								return;
							}
							this.el.className = this.el.className.split(' to-delete').join('');
						}}
						onClick={(ev) => {
							appointmentsData.appointments.deleteModal(this.props.appointment._id);
							ev.stopPropagation();
						}}
					/>
				) : (
					''
				)}
			</div>
		);
	}
}
