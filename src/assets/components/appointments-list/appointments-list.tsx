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
	@observable from: number = new Date().getTime() - 86400000 * 7;
	@observable to: number = new Date().getTime() + 86400000 * 7;
	@observable filter: string = '';

	@observable selectedAppointmentID: string = '';

	@computed
	get dateFiltered() {
		return this.props.list.filter((appointment) => {
			return appointment.date > this.from && appointment.date < this.to;
		});
	}

	@computed
	get filtered() {
		return this.filter ? textualFilter(this.dateFiltered, this.filter) : this.dateFiltered;
	}

	openAppointment(id: string) {
		this.selectedAppointmentID = id;
	}

	render() {
		return (
			<div className="appointments-list">
				{this.props.list.length > 0 ? (
					<div className="main">
						<Row gutter={6}>
							<Col md={8}>
								<DatePicker
									label="From"
									value={new Date(this.from)}
									onSelectDate={(d) => {
										if (d) {
											this.from = d.getTime();
										}
									}}
								/>
							</Col>
							<Col md={8}>
								<DatePicker
									label="To"
									value={new Date(this.to)}
									onSelectDate={(d) => {
										if (d) {
											this.to = d.getTime();
										}
									}}
								/>
							</Col>
							<Col md={8}>
								<TextField label="Filter" value={this.filter} onChanged={(v) => (this.filter = v)} />
							</Col>
						</Row>
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
