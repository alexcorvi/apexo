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
import {
	Appointment,
	CephalometricItemInterface,
	genderToString,
	OrthoCase,
	Patient,
	PatientAppointmentsPanel,
	PrescriptionItem,
	StaffMember
	} from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
	Icon,
	IconButton,
	Panel,
	PanelType,
	PersonaInitialsColor,
	Shimmer,
	TextField,
	TooltipHost
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

@observer
export class OrthoPage extends React.Component<{
	dateFormat: string;
	currencySymbol: string;
	cases: OrthoCase[];
	filteredCases: OrthoCase[];
	currentUser: StaffMember;
	patientsWithNoOrtho: Patient[];
	allPatients: Patient[];
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	onDeleteOrtho: (id: string) => void;
	onAddOrtho: ({
		orthoCase,
		patient
	}: {
		orthoCase: OrthoCase;
		patient?: Patient;
	}) => void;
	onAddAppointment: (appointment: Appointment) => void;
	saveFile: (obj: {
		blob: Blob;
		ext: string;
		dir: string;
	}) => Promise<string>;
	getFile: (path: string) => Promise<string>;
	removeFile: (path: string) => Promise<any>;
	onDeleteAppointment: (id: string) => void;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	newModal: (modal: ModalInterface) => void;
	cephLoader: (obj: CephalometricItemInterface) => Promise<string>;
	doDeleteOrtho: (id: string) => void;
}> {
	tabs = [
		{
			key: "details",
			title: "Patient Details",
			icon: "DietPlanNotebook"
		},
		{
			key: "dental",
			title: "Dental History",
			icon: "teeth"
		},
		{
			key: "sheet",
			title: "Orthodontic Case Sheet",
			icon: "GroupedList"
		},
		{
			key: "album",
			title: "Orthodontic Album",
			icon: "TripleColumn"
		},
		{
			key: "gallery",
			title: "Gallery and X-Rays",
			icon: "PhotoCollection"
		},
		{
			key: "appointments",
			title: "Upcoming Appointments",
			icon: "Calendar",
			hidden: !this.props.currentUser.canViewAppointments
		},
		{
			key: "delete",
			title: "Delete",
			icon: "Trash",
			hidden: !this.canEdit,
			hiddenOnPanel: true
		}
	];

	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = "";
	@observable selectedId: string = "";
	@observable viewWhich: string = "";

	@computed get selectedCase() {
		return this.props.cases.find(
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
		return this.props.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div className="orthodontic-cases-component p-15 p-l-10 p-r-10">
				<DataTableComponent
					maxItemsOnLoad={10}
					className={"orthodontic-cases-data-table"}
					heads={[
						text("Orthodontic Patient"),
						text("Started/Finished Treatment"),
						text("Last/Next Appointment"),
						text("Total/Outstanding Payments")
					]}
					rows={this.props.filteredCases
						.filter(orthoCase => orthoCase.patient)
						.map(orthoCase => {
							const patient = orthoCase.patient || new Patient();
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
																genderToString(
																	patient.gender
																)
															)}{" "}
															- {patient.age}{" "}
															{text("years old")}
														</span>
													}
													size={3}
												/>
												<br />
												<TableActions
													items={this.tabs}
													onSelect={key => {
														if (key === "delete") {
															this.props.onDeleteOrtho(
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
																	this.props
																		.dateFormat
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
													onClick={() => {}}
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
																	this.props
																		.dateFormat
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
													onClick={() => {}}
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
																	this.props
																		.dateFormat
															  )
															: text(
																	"No last appointment"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Previous" />
													)}
													onClick={() => {}}
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
																	this.props
																		.dateFormat
															  )
															: text(
																	"No next appointment"
															  )
													}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Next" />
													)}
													onClick={() => {}}
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
														this.props
															.currencySymbol +
														patient.totalPayments.toString()
													}
													subText={text(
														"Payments made"
													)}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="CheckMark" />
													)}
													onClick={() => {}}
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
														this.props
															.currencySymbol +
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
													onClick={() => {}}
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
						options={this.props.patientsWithNoOrtho.map(
							patient => ({
								key: patient._id,
								text: patient.name
							})
						)}
						onAdd={val => {
							this.showAdditionPanel = false;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = val.key;
							this.props.onAddOrtho({ orthoCase: orthoCase });
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
							const newPatient = new Patient();
							newPatient.name = this.newPatientName;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = newPatient._id;
							this.props.onAddOrtho({
								orthoCase: orthoCase,
								patient: newPatient
							});
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
									items={this.tabs}
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
										currentUser={this.props.currentUser}
										usedLabels={this.props.allPatients
											.map(x => x.labels)
											.reduce(
												(a: string[], b) =>
													a.concat(
														b.map(x => x.text)
													),
												[]
											)}
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
										currentUser={this.props.currentUser}
									/>
								) : (
									""
								)}

								{this.viewWhich === "sheet" ? (
									<OrthoCaseSheetPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
									/>
								) : (
									""
								)}

								{this.viewWhich === "album" ? (
									<OrthoRecordsPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
										dateFormat={this.props.dateFormat}
										getFile={x => this.props.getFile(x)}
										removeFile={x =>
											this.props.removeFile(x)
										}
										saveFile={obj =>
											this.props.saveFile(obj)
										}
										addModal={x => this.props.newModal(x)}
									/>
								) : (
									""
								)}

								{this.viewWhich === "gallery" ? (
									<OrthoGalleryPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
										dateFormat={this.props.dateFormat}
										saveFile={x => this.props.saveFile(x)}
										removeFile={x =>
											this.props.removeFile(x)
										}
										getFile={x => this.props.getFile(x)}
										cephLoader={x =>
											this.props.cephLoader(x)
										}
									/>
								) : (
									""
								)}

								{this.viewWhich === "appointments" ? (
									<PatientAppointmentsPanel
										patient={this.selectedPatient}
										currentUser={this.props.currentUser}
										appointments={
											this.selectedCase.patient!
												.appointments
										}
										onAdd={appointment =>
											this.props.onAddAppointment(
												appointment
											)
										}
										dateFormat={this.props.dateFormat}
										onDeleteAppointment={id =>
											this.props.onDeleteAppointment(id)
										}
										availablePrescriptions={
											this.props.availablePrescriptions
										}
										availableTreatments={
											this.props.availableTreatments
										}
										currencySymbol={
											this.props.currencySymbol
										}
										prescriptionsEnabled={
											this.props.prescriptionsEnabled
										}
										timeTrackingEnabled={
											this.props.timeTrackingEnabled
										}
										operatingStaff={
											this.props.operatingStaff
										}
										appointmentsForDay={(a, b, c) =>
											this.props.appointmentsForDay(
												a,
												b,
												c
											)
										}
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
												this.props.doDeleteOrtho(
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
			</div>
		);
	}
}
