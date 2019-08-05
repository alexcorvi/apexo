import {
	Col,
	DataTableComponent,
	PanelTabs,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TableActions,
	TagInputComponent
	} from "@common-components";
import { imagesTable, ModalInterface, text } from "@core";
import * as core from "@core";
import { Patient, PatientAppointmentsPanel } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PersonaInitialsColor,
	PrimaryButton,
	Shimmer,
	TextField
	} from "office-ui-fabric-react";
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
const OrthoCaseSheetPanel = loadable({
	loader: async () =>
		(await import("modules/orthodontic/components/case-sheet"))
			.OrthoCaseSheetPanel,
	loading: () => <Shimmer />
});
const OrthoRecordsPanel = loadable({
	loader: async () =>
		(await import("modules/orthodontic/components/records"))
			.OrthoRecordsPanel,
	loading: () => <Shimmer />
});
const OrthoGalleryPanel = loadable({
	loader: async () =>
		(await import("modules/orthodontic/components/ortho-gallery"))
			.OrthoGalleryPanel,
	loading: () => <Shimmer />
});

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />
});

@observer
export class OrthoPage extends React.Component {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = "";
	@observable selectedId: string = "";
	@observable viewWhich: string = "";

	@observable selectedAppointmentId = "";

	@computed get selectedCase() {
		return modules.orthoCases!.docs.find(
			orthoCase => orthoCase._id === this.selectedId
		);
	}

	@computed get selectedPatient() {
		if (this.selectedCase) {
			if (this.selectedCase.patient) {
				return this.selectedCase.patient;
			}
		}
	}

	@computed get canEdit() {
		return core.user.currentUser!.canEditOrtho;
	}

	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			x => x._id === this.selectedAppointmentId
		);
	}

	tabs(orthoCase: modules.OrthoCase) {
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
				bubbleContent: orthoCase.patient!.teeth.filter(
					x => x.notes.length || x.condition !== "sound"
				).length
			},
			{
				key: "sheet",
				title: "Orthodontic Case Sheet",
				icon: "GroupedList",
				bubbleContent:
					orthoCase.computedProblems.length +
					orthoCase.problemsList.length
			},
			{
				key: "album",
				title: "Orthodontic Album",
				icon: "TripleColumn",
				bubbleContent: orthoCase.visits.length
			},
			{
				key: "gallery",
				title: "Gallery and X-Rays",
				icon: "PhotoCollection",
				bubbleContent:
					orthoCase.patient!.gallery.length +
					orthoCase.cephalometricHistory.length
			},
			{
				key: "appointments",
				title: "Upcoming Appointments",
				icon: "Calendar",
				hidden: !core.user.currentUser!.canViewAppointments,
				bubbleContent: orthoCase.patient!.appointments.length
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
			<div className="orthodontic-cases-component">
				<DataTableComponent
					maxItemsOnLoad={10}
					className={"orthodontic-cases-data-table"}
					heads={[
						text("Orthodontic Patient"),
						text("Started/Finished Treatment"),
						text("Last/Next Appointment"),
						text("Total/Outstanding Payments")
					]}
					rows={modules
						.orthoCases!.docs.filter(orthoCase => orthoCase.patient)
						.map(orthoCase => {
							const patient =
								orthoCase.patient || modules.patients!.new();
							return {
								id: orthoCase._id,
								searchableString: orthoCase.searchableString,
								cells: [
									{
										dataValue: patient.name,
										component: (
											<div>
												<ProfileComponent
													name={patient.name}
													avatar={
														patient.avatar
															? imagesTable.table[
																	patient
																		.avatar
															  ]
																? imagesTable
																		.table[
																		patient
																			.avatar
																  ]
																: imagesTable.fetchImage(
																		patient.avatar
																  )
															: undefined
													}
													secondaryElement={
														<span>
															{text(
																patient.gender
															)}{" "}
															- {patient.age}{" "}
															{text("years old")}
														</span>
													}
													size={3}
												/>
												<br />
												<TableActions
													items={this.tabs(orthoCase)}
													onSelect={key => {
														if (key === "delete") {
															modules.orthoCases!.deleteModal(
																orthoCase._id
															);
														} else {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = key as any;
														}
													}}
												/>
											</div>
										),
										className: "no-label",
										onClick: () => {
											this.selectedId = orthoCase._id;
											this.viewWhich = "sheet";
										}
									},
									{
										dataValue: orthoCase.isFinished
											? Infinity
											: orthoCase.startedDate,
										component: (
											<div>
												<ProfileSquaredComponent
													text={
														orthoCase.isStarted
															? formatDate(
																	orthoCase.startedDate,
																	modules.setting!.getSetting(
																		"date_format"
																	)
															  )
															: ""
													}
													subText={
														orthoCase.isStarted
															? text(
																	"Started treatment"
															  )
															: text(
																	"Has not started yet"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="info" />
													)}
													initialsColor={
														orthoCase.isStarted
															? PersonaInitialsColor.teal
															: PersonaInitialsColor.transparent
													}
												/>
												<br />
												<ProfileSquaredComponent
													text={
														orthoCase.isFinished
															? formatDate(
																	orthoCase.finishedDate,
																	modules.setting!.getSetting(
																		"date_format"
																	)
															  )
															: ""
													}
													subText={
														orthoCase.isFinished
															? text(
																	"Finished treatment"
															  )
															: text(
																	"Has not finished yet"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="CheckMark" />
													)}
													initialsColor={
														orthoCase.isFinished
															? PersonaInitialsColor.blue
															: PersonaInitialsColor.transparent
													}
												/>
											</div>
										),
										className: "hidden-xs"
									},
									{
										dataValue: (
											patient.nextAppointment || {
												date: 0
											}
										).date,
										component: (
											<div>
												<ProfileSquaredComponent
													text={
														patient.lastAppointment
															? patient
																	.lastAppointment
																	.treatment
																? patient
																		.lastAppointment
																		.treatment
																		.type
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
													onRenderInitials={() => (
														<Icon iconName="Previous" />
													)}
													initialsColor={
														patient.lastAppointment
															? undefined
															: PersonaInitialsColor.transparent
													}
													onClick={
														patient.lastAppointment
															? () => {
																	this.selectedAppointmentId =
																		patient.lastAppointment._id;
															  }
															: undefined
													}
												/>
												<br />
												<ProfileSquaredComponent
													text={
														patient.nextAppointment
															? patient
																	.nextAppointment
																	.treatment
																? patient
																		.nextAppointment
																		.treatment
																		.type
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
													onClick={
														patient.nextAppointment
															? () => {
																	this.selectedAppointmentId =
																		patient.nextAppointment._id;
															  }
															: undefined
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Next" />
													)}
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
													subText={text(
														"Payments made"
													)}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="CheckMark" />
													)}
													initialsColor={
														patient.totalPayments >
														0
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
														(patient.differenceAmount <
														0
															? patient.outstandingAmount.toString()
															: patient.differenceAmount >
															  0
															? patient.overpaidAmount.toString()
															: "0")
													}
													subText={
														patient.differenceAmount <
														0
															? text(
																	"Outstanding amount"
															  )
															: patient.differenceAmount >
															  0
															? text(
																	"Overpaid amount"
															  )
															: text(
																	"No outstanding amount"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Cancel" />
													)}
													initialsColor={
														patient.differenceAmount !==
														0
															? PersonaInitialsColor.darkRed
															: PersonaInitialsColor.transparent
													}
												/>
											</div>
										),
										className: "hidden-xs"
									}
								]
							};
						})}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () =>
											(this.showAdditionPanel = true),
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
				/>
				<Panel
					isOpen={this.showAdditionPanel}
					type={PanelType.smallFixedFar}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => {
						this.showAdditionPanel = false;
					}}
				>
					<h4>{text("Choose patient")}</h4>
					<br />
					<TagInputComponent
						strict
						value={[]}
						options={modules.orthoCases!.patientsWithNoOrtho.map(
							patient => ({
								key: patient._id,
								text: patient.name
							})
						)}
						onAdd={val => {
							this.showAdditionPanel = false;
							const orthoCase = modules.orthoCases!.new();
							orthoCase.patientID = val.key;
							modules.orthoCases!.add(orthoCase);
							this.selectedId = orthoCase._id;
							this.viewWhich = "sheet";
						}}
						placeholder={text(`Type to select patient`)}
					/>
					<br />
					<hr />
					<h4>Or add new patient</h4>
					<br />
					<TextField
						placeholder={text(`Patient name`)}
						value={this.newPatientName}
						onChange={(e, v) => (this.newPatientName = v!)}
					/>
					<DefaultButton
						onClick={() => {
							const newPatient = modules.patients!.new();
							newPatient.name = this.newPatientName;
							modules.patients!.add(newPatient);

							const orthoCase = modules.orthoCases!.new();
							orthoCase.patientID = newPatient._id;
							modules.orthoCases!.add(orthoCase);

							this.newPatientName = "";
							this.selectedId = orthoCase._id;
							this.viewWhich = "details";
						}}
						iconProps={{
							iconName: "add"
						}}
						text={text("Add new")}
					/>
				</Panel>

				<Panel
					isOpen={
						!!(
							this.selectedCase &&
							this.selectedPatient &&
							this.viewWhich
						)
					}
					type={PanelType.medium}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => {
						this.selectedId = "";
						this.viewWhich = "";
					}}
					onRenderNavigation={() => {
						if (!this.selectedCase) {
							return <div />;
						}
						if (!this.selectedPatient) {
							return <div />;
						}
						return (
							<div className="panel-heading">
								<Row>
									<Col span={22}>
										<ProfileComponent
											name={this.selectedPatient!.name}
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
											iconProps={{ iconName: "cancel" }}
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
									items={this.tabs(this.selectedCase)}
								/>
							</div>
						);
					}}
				>
					<div>
						{this.selectedCase && this.selectedPatient ? (
							<div className="ortho-single-component">
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

								{this.viewWhich === "sheet" ? (
									<OrthoCaseSheetPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === "album" ? (
									<OrthoRecordsPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === "gallery" ? (
									<OrthoGalleryPanel
										orthoCase={this.selectedCase}
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
											messageBarType={
												MessageBarType.warning
											}
										>
											{text(
												"Orthodontic case will be deleted"
											)}
										</MessageBar>
										<br />
										<PrimaryButton
											className="delete"
											iconProps={{
												iconName: "delete"
											}}
											text={text("Delete")}
											onClick={() => {
												modules.orthoCases!.delete(
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
							</div>
						) : (
							""
						)}
					</div>
				</Panel>
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
