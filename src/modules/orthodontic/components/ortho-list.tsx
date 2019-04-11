import "./ortho-list.scss";
import {
	Col,
	DataTableComponent,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	TagInputComponent
	} from "@common-components";
import { lang, user } from "@core";
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
						lang("Orthodontic Patient"),
						lang("Started/Finished Treatment"),
						lang("Last/Next Appointment"),
						lang("Total/Outstanding Payments")
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
															{lang(
																genderToString(
																	patient.gender
																)
															)}{" "}
															- {patient.age}{" "}
															{lang("years old")}
														</span>
													}
													size={3}
												/>
												<br />
												<TooltipHost
													content={lang(
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
													content={lang(
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
													content={lang(
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
													content={lang(
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
													content={lang(
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
														content={lang(
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
													content={lang("Delete")}
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
															? lang(
																	"Started treatment"
															  )
															: lang(
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
															? lang(
																	"Finished treatment"
															  )
															: lang(
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
															: lang(
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
															: lang(
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
													subText={lang(
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
															? lang(
																	"Outstanding amount"
															  )
															: patient.differenceAmount >
															  0
															? lang(
																	"Overpaid amount"
															  )
															: lang(
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
										name: lang("Add new"),
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
					<h4>{lang("Choose patient")}</h4>
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
						placeholder={lang(`Type to select patient`)}
					/>
					<br />
					<hr />
					<h4>Or add new patient</h4>
					<br />
					<TextField
						placeholder={lang(`Patient name`)}
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
						text={lang("Add new")}
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
													? lang("Patient Details")
													: ""}
												{this.viewWhich === 2
													? lang("Dental History")
													: ""}
												{this.viewWhich === 3
													? lang(
															"Orthodontic Case Sheet"
													  )
													: ""}
												{this.viewWhich === 4
													? lang("Orthodontic Album")
													: ""}
												{this.viewWhich === 5
													? lang("Gallery and X-Rays")
													: ""}
												{this.viewWhich === 6
													? lang(
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
