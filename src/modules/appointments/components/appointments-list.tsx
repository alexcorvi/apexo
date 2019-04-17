import { text, user } from "@core";
import { Appointment, appointments, AppointmentThumbComponent } from "@modules";
import { textualFilter } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Shimmer, TextField } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

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
		return user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div className="appointments-list">
				{this.props.list.length > 0 ? (
					<div className="main">
						<TextField
							label={text("Filter")}
							value={this.filter}
							onChange={(e, v) => {
								this.filter = v!;
							}}
						/>

						<hr />
						<p
							style={{
								textAlign: "right",
								fontSize: "13px",
								color: "#9E9E9E"
							}}
						>
							{text("Results")}: {this.filtered.length}{" "}
							{text("out of")} {this.props.list.length}
						</p>

						{this.filtered.length ? (
							this.filtered
								.sort((a, b) => a.date - b.date)
								.map(appointment => {
									return (
										<AppointmentThumbComponent
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
								{text("Nothing found") + "..."}
							</p>
						)}
					</div>
				) : (
					""
				)}
				{appointments.list[
					appointments.getIndexByID(this.selectedAppointmentID)
				] ? (
					<AppointmentEditorPanel
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
				) : (
					""
				)}
			</div>
		);
	}
}
