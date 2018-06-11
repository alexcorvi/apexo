import './user.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CompoundButton, Link, Panel, PanelType } from 'office-ui-fabric-react';

import { API } from '../';
import { AppointmentThumb } from '../../assets/components/appointment-thumb/appointment-thumb';
import { Profile } from '../../assets/components/profile/profile';
import { computed } from 'mobx';
import { components as modulesComponents } from '../../modules';
import { observer } from 'mobx-react';
import { user } from './data.user';

@observer
export class UserComponent extends React.Component<{}, {}> {
	@computed
	get todayAppointments() {
		if (!user.currentDoctor) {
			return [];
		} else if (user.todayAppointments) {
			return user.todayAppointments;
		} else {
			return [];
		}
	}

	render() {
		return (
			<Panel
				className="user-component"
				type={PanelType.medium}
				isLightDismiss
				isOpen={user.visible}
				onDismiss={() => (user.visible = false)}
				headerText="Your account"
				onRenderHeader={() => {
					return (
						<div className="persona">
							<Profile
								name={user.currentDoctor.name}
								secondaryElement={
									<Link
										onClick={() => {
											user.logout();
										}}
									>
										Logout
									</Link>
								}
							/>
						</div>
					);
				}}
			>
				<br />
				<h3>{this.todayAppointments.length ? `Today's appointments` : 'No Appointments today'}</h3>
				<div className="appointments-listing">
					{this.todayAppointments.map((appointment) => {
						const date = new Date(appointment.date);
						const dateLink = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
						return (
							<AppointmentThumb
								key={appointment._id}
								appointment={appointment}
								small={true}
								hideDate={true}
								showPatient={true}
								labeled={true}
								onClick={() => {
									API.router.go([ 'appointments', dateLink ]);
									user.visible = false;
								}}
							/>
						);
					})}
				</div>
			</Panel>
		);
	}
}
