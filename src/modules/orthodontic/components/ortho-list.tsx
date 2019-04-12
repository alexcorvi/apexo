import "./ortho-list.scss";
import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TagInputComponent
	} from "@common-components";
import { text, user } from "@core";
import {
	DentalHistoryPanel,
	genderToString,
	OrthoCase,
	orthoCases,
	OrthoCaseSheetPanel,
	OrthoGalleryPanel,
	OrthoRecordsPanel,
	Patient,
	PatientAppointmentsPanel,
	PatientDetailsPanel,
	patients,
	setting
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
	TextField,
	TooltipHost
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class OrthoPage extends React.Component<{}, {}> {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = "";

	@observable selectedId: string = "";
	@observable viewWhich: number = 0;

	@computed get selectedCase() {
		return orthoCases.list.find(
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
		return user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div className="orthodontic-cases-component p-15 p-l-10 p-r-10">
				<DataTableComponent
					maxItemsOnLoad={15}
					className={"orthodontic-cases-data-table"}
					heads={[
						text("Orthodontic Patient"),
						text("Started/Finished Treatment"),
						text("Last/Next Appointment"),
						text("Total/Outstanding Payments")
					]}
					rows={orthoCases.filtered
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

												{user.currentUser
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
															orthoCases.deleteModal(
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
																	setting.getSetting(
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
																	setting.getSetting(
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
																	setting.getSetting(
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
																	setting.getSetting(
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
														setting.getSetting(
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
														setting.getSetting(
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
						options={orthoCases.patientsWithNoOrtho.map(
							patient => ({
								key: patient._id,
								text: patient.name
							})
						)}
						onAdd={val => {
							this.showAdditionPanel = false;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = val.key;
							orthoCases.list.push(orthoCase);
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
							patients.list.push(newPatient);
							orthoCases.list.push(orthoCase);
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
										patient={this.selectedPatient}
									/>
								) : (
									""
								)}

								{this.viewWhich === 2 ? (
									<DentalHistoryPanel
										patient={this.selectedPatient}
									/>
								) : (
									""
								)}

								{this.viewWhich === 3 ? (
									<OrthoCaseSheetPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === 4 ? (
									<OrthoRecordsPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === 5 ? (
									<OrthoGalleryPanel
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === 6 ? (
									<PatientAppointmentsPanel
										patient={this.selectedPatient}
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
