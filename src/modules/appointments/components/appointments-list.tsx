import { ALRightColumn, ALSecondaryText, AppointmentsListNoDate } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment, PrescriptionItem, StaffMember } from "@modules";
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
		operatorsAsSecondaryText?: boolean;
	},
	{}
> {
	@observable filter: string = "";

	@observable selectedAppointmentID: string = "";

	@computed
	get filteredAndSorted() {
		return (this.filter
			? textualFilter(this.props.list, this.filter)
			: this.props.list
		).sort((a, b) => a.date - b.date);
	}

	@computed get canEdit() {
		return core.user.currentUser!.canEditAppointments;
	}

	@computed get selectedAppointment() {
		return this.props.list.find(x => x._id === this.selectedAppointmentID);
	}

	render() {
		return (
			<div className="appointments-list">
				{this.props.list.length > 0 ? (
					<div className="main">
						{
							<AppointmentsListNoDate
								appointments={this.filteredAndSorted}
								onClick={id =>
									(this.selectedAppointmentID = id)
								}
								secondaryText={
									this.props.operatorsAsSecondaryText
										? ALSecondaryText.operators
										: ALSecondaryText.patient
								}
								rightColumn={ALRightColumn.deleteButton}
								canDelete={this.canEdit}
							/>
						}
					</div>
				) : (
					""
				)}
				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => (this.selectedAppointmentID = "")}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
