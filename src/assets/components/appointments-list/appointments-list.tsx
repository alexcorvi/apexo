import * as React from 'react';
import { Appointment, appointments } from '../../../modules/appointments/data';
import { AppointmentEditor } from '../../../modules/appointments/components';
import { AppointmentThumb } from '../appointment-thumb/appointment-thumb';
import { Col, Row } from '../grid';
import { computed, observable } from 'mobx';
import {
	DatePicker,
	Dropdown,
	Icon,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle
	} from 'office-ui-fabric-react';
import { observer } from 'mobx-react';
import { textualFilter } from '../../../assets/utils/textual-filter';

@observer
export class AppointmentsList extends React.Component<{ list: Appointment[] }, {}> {
	@observable filter: string = '';

	@observable selectedAppointmentID: string = '';

	@computed
	get filtered() {
		return this.filter ? textualFilter(this.props.list, this.filter) : this.props.list;
	}

	render() {
		return (
			<div className="appointments-list">
				{this.props.list.length > 0 ? (
					<div className="main">
						<TextField label="Filter" value={this.filter} onChanged={(v) => (this.filter = v)} />

						<hr />
						<p
							style={{
								textAlign: 'right',
								fontSize: '13px',
								color: '#9E9E9E'
							}}
						>
							Results: {this.filtered.length} out of {this.props.list.length}
						</p>

						{this.filtered.length ? (
							this.filtered.sort((a, b) => a.date - b.date).map((appointment) => {
								return (
									<AppointmentThumb
										key={appointment._id}
										onClick={() => (this.selectedAppointmentID = appointment._id)}
										appointment={appointment}
										canDelete={true}
									/>
								);
							})
						) : (
							<p className="no-appointments">Nothing found...</p>
						)}
					</div>
				) : (
					''
				)}
				<AppointmentEditor
					onDismiss={() => (this.selectedAppointmentID = '')}
					appointment={appointments.list[appointments.getIndexByID(this.selectedAppointmentID)]}
					onDelete={() => (this.selectedAppointmentID = '')}
				/>
			</div>
		);
	}
}
