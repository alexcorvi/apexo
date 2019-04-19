import { text } from "@core";
import { Appointment, AppointmentThumbComponent, PrescriptionItem, StaffMember } from "@modules";
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
	{
		list: Appointment[];
		currentUser: StaffMember;
		dateFormat: string;
		onDeleteAppointment: (id: string) => void;
		availableTreatments: { _id: string; expenses: number; type: string }[];
		availablePrescriptions: PrescriptionItem[];
		appointmentsForDay: (
			year: number,
			month: number,
			day: number,
			filter?: string | undefined,
			operatorID?: string | undefined
		) => Appointment[];
		currencySymbol: string;
		prescriptionsEnabled: boolean;
		timeTrackingEnabled: boolean;
		operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	},
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
		return this.props.currentUser.canEditAppointments;
	}

	@computed get selectedAppointment() {
		return this.props.list.find(x => x._id === this.selectedAppointmentID);
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
											dateFormat={this.props.dateFormat}
											onDeleteAppointment={() =>
												this.props.onDeleteAppointment(
													appointment._id
												)
											}
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
				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => (this.selectedAppointmentID = "")}
						onDeleteAppointment={id => {
							this.props.onDeleteAppointment(id);
							this.selectedAppointmentID = "";
						}}
						availableTreatments={this.props.availableTreatments}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						currentUser={this.props.currentUser}
						dateFormat={this.props.dateFormat}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						operatingStaff={this.props.operatingStaff}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
