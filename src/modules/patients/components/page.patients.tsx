import {
	Col,
	DataTableComponent,
	PanelTabs,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TableActions,
	TagComponent
	} from "@common-components";
import { imagesTable, text } from "@core";
import * as core from "@core";
import { Patient, PatientAppointmentsPanel, PatientGalleryPanel } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Icon,
	IconButton,
	Panel,
	PanelType,
	PersonaInitialsColor,
	Shimmer
	} from "office-ui-fabric-react";
import { MessageBar, MessageBarType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const PatientDetailsPanel = loadable({
	loader: async () =>
		(await import("modules/patients/components/patient-details"))
			.PatientDetailsPanel,
	loading: () => <Shimmer />
});
const DentalHistoryPanel = loadable({
	loader: async () =>
		(await import("modules/patients/components/dental-history"))
			.DentalHistoryPanel,
	loading: () => <Shimmer />
});

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class PatientsPage extends React.Component {
	@observable selectedAppointmentId = "";
	@observable selectedId: string = core.router.currentLocation.split("/")[1];

	@observable viewWhich: string = core.router.currentLocation.split("/")[1]
		? "details"
		: "";

	@computed
	get selectedPatient() {
		return modules.patients!.docs.find(
			patient => patient._id === this.selectedId
		);
	}

	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			x => x._id === this.selectedAppointmentId
		);
	}

	tabs(patient: Patient) {
		return [
			{
				key: "details",
				title: "Patient Details",
				icon: "DietPlanNotebook"
			},
			{
				key: "dental",
				title: "Dental History",
				icon: "teeth",
				bubbleContent: patient.teeth.filter(
					x => x.notes.length || x.condition !== "sound"
				).length
			},
			{
				key: "gallery",
				title: "Gallery and X-Rays",
				icon: "PhotoCollection",
				bubbleContent: patient.gallery.length
			},
			{
				key: "appointments",
				title: "Appointments",
				icon: "Calendar",
				hidden: !core.user.currentUser!.canViewAppointments,
				bubbleContent: patient.appointments.length
			},
			{
				key: "delete",
				title: "Delete",
				icon: "Trash",
				hidden: !this.canEdit,
				hiddenOnPanel: true
			}
		];
	}

	render() {
		return (
			<div className="patients-component">
				{this.selectedPatient ? (
					<Panel
						key={this.selectedId}
						isOpen={!!this.selectedPatient}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedId = "";
							this.viewWhich = "";
						}}
						onRenderNavigation={() => {
							return (
								<div className="panel-heading">
									<Row>
										<Col span={22}>
											<ProfileComponent
												name={
													this.selectedPatient!.name
												}
												size={2}
												avatar={
													this.selectedPatient!.avatar
														? imagesTable.table[
																this
																	.selectedPatient!
																	.avatar
														  ]
															? imagesTable.table[
																	this
																		.selectedPatient!
																		.avatar
															  ]
															: imagesTable.fetchImage(
																	this
																		.selectedPatient!
																		.avatar
															  )
														: undefined
												}
											/>
										</Col>
										<Col span={2} className="close">
											<IconButton
												data-testid="close-panel"
												iconProps={{
													iconName: "cancel"
												}}
												onClick={() => {
													this.selectedId = "";
													this.viewWhich = "";
												}}
											/>
										</Col>
									</Row>
									<PanelTabs
										currentSelectedKey={this.viewWhich}
										onSelect={key => {
											this.viewWhich = key as any;
										}}
										items={this.tabs(this.selectedPatient!)}
									/>
								</div>
							);
						}}
					>
						{this.viewWhich === "details" ? (
							<PatientDetailsPanel
								patient={this.selectedPatient!}
								onChangeViewWhich={key =>
									(this.viewWhich = key)
								}
							/>
						) : (
							""
						)}
						{this.viewWhich === "dental" ? (
							<DentalHistoryPanel
								patient={this.selectedPatient!}
							/>
						) : (
							""
						)}
						{this.viewWhich === "gallery" ? (
							<PatientGalleryPanel
								patient={this.selectedPatient}
							/>
						) : (
							""
						)}
						{this.viewWhich === "appointments" ? (
							<PatientAppointmentsPanel
								patient={this.selectedPatient}
							/>
						) : (
							""
						)}

						{this.viewWhich === "delete" ? (
							<div>
								<br />
								<MessageBar
									messageBarType={MessageBarType.warning}
								>
									{`${text("All of the patient")} ${
										this.selectedPatient.name
									}${text(
										"'s data will be deleted along with"
									)} ${
										this.selectedPatient.appointments.length
									} ${text("of appointments")}.`}
								</MessageBar>
								<br />
								<PrimaryButton
									className="delete"
									iconProps={{
										iconName: "delete"
									}}
									text={text("Delete")}
									onClick={() => {
										modules.patients!.delete(
											this.selectedId
										);

										this.selectedId = "";
										this.viewWhich = "";
									}}
								/>
							</div>
						) : (
							""
						)}
					</Panel>
				) : (
					""
				)}
				<DataTableComponent
					maxItemsOnLoad={10}
					className={"patients-data-table"}
					heads={[
						text("Patient"),
						text("Last/Next Appointment"),
						text("Total/Outstanding Payments"),
						text("Label")
					]}
					rows={modules.patients!.docs.map(patient => ({
						id: patient._id,
						searchableString: patient.searchableString,
						cells: [
							{
								dataValue:
									patient.name +
									" " +
									patient.gender +
									" " +
									patient.age,
								component: (
									<div>
										<ProfileComponent
											name={patient.name}
											avatar={
												patient.avatar
													? imagesTable.table[
															patient.avatar
													  ]
														? imagesTable.table[
																patient.avatar
														  ]
														: imagesTable.fetchImage(
																patient.avatar
														  )
													: undefined
											}
											secondaryElement={
												<span>
													{text(patient.gender)} -{" "}
													{patient.age}{" "}
													{text("years old")}
												</span>
											}
											size={3}
										/>
										<br />

										<TableActions
											items={this.tabs(patient)}
											onSelect={key => {
												if (key === "delete") {
													modules.patients!.deleteModal(
														patient._id
													);
												} else {
													this.selectedId =
														patient._id;
													this.viewWhich = key as any;
												}
											}}
										/>
									</div>
								),
								className: "no-label",
								onClick: () => {
									this.selectedId = patient._id;
									this.viewWhich = "details";
								}
							},
							{
								dataValue: (
									patient.lastAppointment ||
									patient.nextAppointment || { date: 0 }
								).date,
								component: (
									<div>
										<ProfileSquaredComponent
											text={
												patient.lastAppointment
													? patient.lastAppointment
															.treatment
														? patient
																.lastAppointment
																.treatment.type
														: ""
													: ""
											}
											subText={
												patient.lastAppointment
													? formatDate(
															patient
																.lastAppointment
																.date,
															modules.setting!.getSetting(
																"date_format"
															)
													  )
													: text(
															"No last appointment"
													  )
											}
											size={3}
											onClick={
												patient.lastAppointment
													? () => {
															this.selectedAppointmentId =
																patient.lastAppointment._id;
													  }
													: undefined
											}
											onRenderInitials={() => (
												<Icon iconName="Previous" />
											)}
											initialsColor={
												patient.lastAppointment
													? undefined
													: PersonaInitialsColor.transparent
											}
										/>
										<br />
										<ProfileSquaredComponent
											text={
												patient.nextAppointment
													? patient.nextAppointment
															.treatment
														? patient
																.nextAppointment
																.treatment.type
														: ""
													: ""
											}
											subText={
												patient.nextAppointment
													? formatDate(
															patient
																.nextAppointment
																.date,
															modules.setting!.getSetting(
																"date_format"
															)
													  )
													: text(
															"No next appointment"
													  )
											}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="Next" />
											)}
											onClick={
												patient.nextAppointment
													? () => {
															this.selectedAppointmentId =
																patient.nextAppointment._id;
													  }
													: undefined
											}
											initialsColor={
												patient.nextAppointment
													? undefined
													: PersonaInitialsColor.transparent
											}
										/>
									</div>
								),
								className: "hidden-xs"
							},
							{
								dataValue: patient.totalPayments,
								component: (
									<div>
										<ProfileSquaredComponent
											text={
												modules.setting!.getSetting(
													"currencySymbol"
												) +
												patient.totalPayments.toString()
											}
											subText={text("Payments made")}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="CheckMark" />
											)}
											initialsColor={
												patient.totalPayments > 0
													? PersonaInitialsColor.darkBlue
													: PersonaInitialsColor.transparent
											}
										/>
										<br />
										<ProfileSquaredComponent
											text={
												modules.setting!.getSetting(
													"currencySymbol"
												) +
												(patient.differenceAmount < 0
													? patient.outstandingAmount.toString()
													: patient.differenceAmount >
													  0
													? patient.overpaidAmount.toString()
													: "0")
											}
											subText={
												patient.differenceAmount < 0
													? text("Outstanding amount")
													: patient.differenceAmount >
													  0
													? text("Overpaid amount")
													: text(
															"No outstanding amount"
													  )
											}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="Cancel" />
											)}
											initialsColor={
												patient.differenceAmount !== 0
													? PersonaInitialsColor.darkRed
													: PersonaInitialsColor.transparent
											}
										/>
									</div>
								),
								className: "hidden-xs"
							},
							{
								dataValue: patient.labels
									.map(x => x.text)
									.join(","),
								component: (
									<div>
										{patient.labels.map((label, index) => {
											return (
												<TagComponent
													key={index}
													text={label.text}
													type={label.type}
												/>
											);
										})}
									</div>
								),
								className: "hidden-xs"
							}
						]
					}))}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () => {
											const patient = modules.patients!.new();
											modules.patients!.add(patient);
											this.selectedId = patient._id;
											this.viewWhich = "details";
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
				/>
				{this.selectedAppointment ? (
					<AppointmentEditorPanel
						appointment={this.selectedAppointment}
						onDismiss={() => (this.selectedAppointmentId = "")}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
