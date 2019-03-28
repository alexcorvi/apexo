import * as React from "react";
import { Appointment, appointments } from "../../../modules/appointments/data";
import { AppointmentEditor } from "../../../modules/appointments/components";
import { AppointmentThumb } from "../appointment-thumb/appointment-thumb";
import { computed, observable } from "mobx";
import { TextField } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { textualFilter } from "../../../assets/utils/textual-filter";
import { lang } from "../../../core/i18/i18";
import { API } from "../../../core";

@observer
export class AppointmentsList extends React.Component<
	{ list: Appointment[] },
	{}
> {
	@observable filter: string = "";

	@observable selectedAppointmentID: string = "";

	@computed
	get filtered() {
		return this.filter
			? textualFilter(this.props.list, this.filter)
			: this.props.list;
	}
	@computed get canEdit() {
		return API.user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div className="appointments-list">
				{this.props.list.length > 0 ? (
					<div className="main">
						<TextField
							label={lang("Filter")}
							value={this.filter}
							onChanged={v => (this.filter = v)}
						/>

						<hr />
						<p
							style={{
								textAlign: "right",
								fontSize: "13px",
								color: "#9E9E9E"
							}}
						>
							{lang("Results")}: {this.filtered.length}{" "}
							{lang("out of")} {this.props.list.length}
						</p>

						{this.filtered.length ? (
							this.filtered
								.sort((a, b) => a.date - b.date)
								.map(appointment => {
									return (
										<AppointmentThumb
											key={appointment._id}
											onClick={() =>
												(this.selectedAppointmentID =
													appointment._id)
											}
											appointment={appointment}
											canDelete={this.canEdit}
										/>
									);
								})
						) : (
							<p className="no-appointments">
								{lang("Nothing found") + "..."}
							</p>
						)}
					</div>
				) : (
					""
				)}
				<AppointmentEditor
					onDismiss={() => (this.selectedAppointmentID = "")}
					appointment={
						appointments.list[
							appointments.getIndexByID(
								this.selectedAppointmentID
							)
						]
					}
					onDelete={() => (this.selectedAppointmentID = "")}
				/>
			</div>
		);
	}
}
