import './appointment-thumb.scss';

import * as React from 'react';

import { appointmentsComponents, appointmentsData } from '../../../modules/appointments';
import { treatmentsComponents, treatmentsData } from '../../../modules/treatments';

import { Icon } from 'office-ui-fabric-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { patientsComponents } from '../../../modules/patients';

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
	 * Small view
	 * 
	 * @type {boolean}
	 */
		small?: boolean;
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

	/**
	 * A reference to parent element for className insertion
	 * 
	 * @type {HTMLElement}
	 * @memberof AppointmentThumb
	 */
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
				{this.props.hideTreatment ? (
					''
				) : (
					<treatmentsComponents.TreatmentLink small={this.props.small} id={treatmentID} />
				)}
				{this.props.hideDate ? (
					''
				) : (
					<appointmentsComponents.DateLink
						className="hidden-xs"
						time={this.props.appointment.date}
						format="{d}/{m}/{yyyy} ({RR})"
					/>
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
