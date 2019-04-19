import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TagInputComponent
	} from "@common-components";
import { ModalInterface, text } from "@core";
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
	isOnline: boolean;
	isDropboxActive: boolean;
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
}> {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = "";
	@observable selectedId: string = "";
	@observable viewWhich: number = 0;

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
												<TooltipHost
													content={text(
														"Patient Details"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"DietPlanNotebook"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 1;
														}}
													/>
												</TooltipHost>

												<TooltipHost
													content={text(
														"Dental History"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName: "Teeth"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 2;
														}}
													/>
												</TooltipHost>

												<TooltipHost
													content={text(
														"Orthodontic Case Sheet"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"GroupedList"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 3;
														}}
													/>
												</TooltipHost>

												<TooltipHost
													content={text(
														"Orthodontic Album"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"TripleColumn"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 4;
														}}
													/>
												</TooltipHost>

												<TooltipHost
													content={text(
														"Gallery and X-Rays"
													)}
												>
													<IconButton
														className="action-button"
														iconProps={{
															iconName:
																"PhotoCollection"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 5;
														}}
													/>
												</TooltipHost>

												{this.props.currentUser
													.canViewAppointments ? (
													<TooltipHost
														content={text(
															"Patient Appointments"
														)}
													>
														<IconButton
															className="action-button"
															iconProps={{
																iconName:
																	"Calendar"
															}}
															onClick={() => {
																this.selectedId =
																	orthoCase._id;
																this.viewWhich = 6;
															}}
														/>
													</TooltipHost>
												) : (
													""
												)}
												<TooltipHost
													content={text("Delete")}
												>
													<IconButton
														className="action-button delete"
														iconProps={{
															iconName: "Trash"
														}}
														onClick={() =>
															this.props.onDeleteOrtho(
																orthoCase._id
															)
														}
														disabled={!this.canEdit}
													/>
												</TooltipHost>
											</div>
										),
										className: "no-label"
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
							this.viewWhich = 3;
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
							this.viewWhich = 3;
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
						this.viewWhich = 0;
					}}
					onRenderNavigation={() => {
						if (!this.selectedCase) {
							return <div />;
						}
						if (!this.selectedPatient) {
							return <div />;
						}
						return (
							<Row className="panel-heading">
								<Col span={22}>
									<ProfileComponent
										name={this.selectedPatient!.name}
										secondaryElement={
											<span>
												{this.viewWhich === 1
													? text("Patient Details")
													: ""}
												{this.viewWhich === 2
													? text("Dental History")
													: ""}
												{this.viewWhich === 3
													? text(
															"Orthodontic Case Sheet"
													  )
													: ""}
												{this.viewWhich === 4
													? text("Orthodontic Album")
													: ""}
												{this.viewWhich === 5
													? text("Gallery and X-Rays")
													: ""}
												{this.viewWhich === 6
													? text(
															"Patient Appointments"
													  )
													: ""}
											</span>
										}
										size={3}
									/>
								</Col>
								<Col span={2} className="close">
									<IconButton
										iconProps={{ iconName: "cancel" }}
										onClick={() => {
											this.selectedId = "";
											this.viewWhich = 0;
										}}
									/>
								</Col>
							</Row>
						);
					}}
				>
					<div>
						{this.selectedCase && this.selectedPatient ? (
							<div className="ortho-single-component">
								{this.viewWhich === 1 ? (
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
									/>
								) : (
									""
								)}

								{this.viewWhich === 2 ? (
									<DentalHistoryPanel
										patient={this.selectedPatient!}
										currentUser={this.props.currentUser}
									/>
								) : (
									""
								)}

								{this.viewWhich === 3 ? (
									<OrthoCaseSheetPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
									/>
								) : (
									""
								)}

								{this.viewWhich === 4 ? (
									<OrthoRecordsPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
										isOnline={this.props.isOnline}
										isDropboxActive={
											this.props.isDropboxActive
										}
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

								{this.viewWhich === 5 ? (
									<OrthoGalleryPanel
										orthoCase={this.selectedCase}
										currentUser={this.props.currentUser}
										isOnline={this.props.isOnline}
										isDropboxActive={
											this.props.isDropboxActive
										}
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

								{this.viewWhich === 6 ? (
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
