import {
	Col,
	DataTableComponent,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TableActions,
	TagInputComponent
	} from "@common-components";
import { imagesTable, text } from "@core";
import * as core from "@core";
import { PatientAppointmentsPanel } from "@modules";
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

	@observable selectedAppointmentId = "";

	@computed get selectedCase() {
		return modules.orthoCases!.docs.find(
			orthoCase => orthoCase._id === core.router.selectedID
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
				title: "Case Sheet",
				icon: "GroupedList",
				bubbleContent:
					orthoCase.computedProblems.length +
					orthoCase.problemsList.length
			},
			{
				key: "archive",
				title: "Visits Archive",
				icon: "Archive",
				bubbleContent: orthoCase.visits.length
			},
			{
				key: "gallery",
				title: "Gallery",
				icon: "PhotoCollection",
				bubbleContent: orthoCase.patient!.gallery.length
			},
			{
				key: "appointments",
				title: "Appointments",
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
							const patient = orthoCase.patient!;
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
															core.router.selectID(
																orthoCase._id,
																key
															);
														}
													}}
												/>
											</div>
										),
										className: "no-label",
										onClick: () => {
											core.router.selectID(
												orthoCase._id,
												"sheet"
											);
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
																	core.router.selectSub(
																		"details"
																	);
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
																	core.router.selectSub(
																		"details"
																	);
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
					<br />
					<TagInputComponent
						label={text("Choose patient")}
						options={modules.patients!.docs.map(patient => ({
							text: patient.name,
							key: patient._id
						}))}
						suggestionsHeaderText={text("Select patient")}
						noResultsFoundText={text("No patients found")}
						maxItems={1}
						disabled={!this.canEdit}
						value={[]}
						onChange={selectedKeys => {
							if (selectedKeys[0]) {
								this.showAdditionPanel = false;
								const orthoCase = modules.orthoCases!.new();
								orthoCase.patientID = selectedKeys[0];
								modules.orthoCases!.add(orthoCase);
								core.router.selectID(orthoCase._id, "sheet");
							}
						}}
					/>
					<Row className="m-t-15">
						<Col xs={10}>
							<hr />
						</Col>

						<Col xs={4}>
							<i className="new-or">or</i>
						</Col>
						<Col xs={10}>
							<hr />
						</Col>
					</Row>
					<TextField
						label="Add new patient"
						placeholder={text(`Patient name`)}
						value={this.newPatientName}
						onChange={(e, v) => (this.newPatientName = v!)}
					/>
					<DefaultButton
						onClick={() => {
							const newPatient = modules.patients!.new();
							newPatient.name = this.newPatientName;
							newPatient.fromJSON(newPatient.toJSON()); // init. teeth
							modules.patients!.add(newPatient);

							const orthoCase = modules.orthoCases!.new();
							orthoCase.patientID = newPatient._id;
							modules.orthoCases!.add(orthoCase);

							this.newPatientName = "";
							core.router.selectID(orthoCase._id, "details");
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
							core.router.selectedTab
						)
					}
					type={PanelType.medium}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => {
						core.router.unSelect();
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
								<PanelTop
									title={this.selectedPatient!.name}
									type={"Orthodontic case"}
									onDismiss={() => core.router.unSelect()}
									avatar={
										this.selectedPatient!.avatar
											? imagesTable.table[
													this.selectedPatient!.avatar
											  ]
												? imagesTable.table[
														this.selectedPatient!
															.avatar
												  ]
												: imagesTable.fetchImage(
														this.selectedPatient!
															.avatar
												  )
											: undefined
									}
								/>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={key => {
										core.router.selectTab(key);
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
								{core.router.selectedTab === "details" ? (
									<PatientDetailsPanel
										patient={this.selectedPatient!}
										onChangeViewWhich={key =>
											core.router.selectTab(key)
										}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "dental" ? (
									<DentalHistoryPanel
										patient={this.selectedPatient!}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "sheet" ? (
									<OrthoCaseSheetPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "archive" ? (
									<OrthoRecordsPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "gallery" ? (
									<OrthoGalleryPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "appointments" ? (
									<PatientAppointmentsPanel
										patient={this.selectedPatient}
									/>
								) : (
									""
								)}

								{core.router.selectedTab === "delete" ? (
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
													core.router.selectedID
												);
												core.router.unSelect();
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
