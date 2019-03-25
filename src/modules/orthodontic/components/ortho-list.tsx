import * as dateUtils from "../../../assets/utils/date";
import * as React from "react";
import { cases, OrthoCase } from "../data";
import {
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	IconButton,
	PersonaInitialsColor,
	Icon
} from "office-ui-fabric-react";
import { observable, computed } from "mobx";
import { DataTable } from "../../../assets/components/data-table/data-table.component";
import { genderToString } from "../../patients/data/enum.gender";
import { observer } from "mobx-react";
import { patientsData } from "../../patients";
import { Profile } from "../../../assets/components/profile/profile";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { TagInput } from "../../../assets/components/tag-input/tag-input";
import "./ortho-list.scss";
import { API } from "../../../core/index";
import { lang } from "../../../core/i18/i18";
import setting from "../../settings/data/data.settings";
import { Row, Col } from "../../../assets/components/grid";
import {
	PatientDetails,
	DentalHistory,
	PatientAppointments
} from "../../patients/components";
import { OrthoCaseSheet } from "./case-sheet";
import { Orthograph } from "./orthograph";

@observer
export class OrthoList extends React.Component<{}, {}> {
	@observable showAdditionPanel: boolean = false;
	@observable newPatientName: string = "";

	@observable selectedId: string = cases.list[0]._id;
	@observable viewWhich: number = 4;

	@computed get selectedCase() {
		return cases.list.find(orthoCase => orthoCase._id === this.selectedId);
	}

	@computed get selectedPatient() {
		if (this.selectedCase) {
			if (this.selectedCase.patient) {
				return this.selectedCase.patient;
			}
		}
	}

	@computed get canEdit() {
		return API.user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div className="orthodontic-cases-component p-15 p-l-10 p-r-10">
				<DataTable
					maxItemsOnLoad={15}
					className={"orthodontic-cases-data-table"}
					heads={[
						lang("Orthodontic Patient"),
						lang("Started/Finished Treatment"),
						lang("Last/Next Appointment"),
						lang("Total/Outstanding Payments")
					]}
					rows={cases.filtered
						.filter(orthoCase => orthoCase.patient)
						.map(orthoCase => {
							const patient =
								orthoCase.patient || new patientsData.Patient();
							return {
								id: orthoCase._id,
								searchableString: orthoCase.searchableString,
								cells: [
									{
										dataValue: patient.name,
										component: (
											<div>
												<Profile
													name={patient.name}
													secondaryElement={
														<span>
															{genderToString(
																patient.gender
															)}{" "}
															- {patient.age}{" "}
															years old
														</span>
													}
													size={3}
												/>
												<br />
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
												<IconButton
													className="action-button"
													iconProps={{
														iconName: "GroupedList"
													}}
													onClick={() => {
														this.selectedId =
															orthoCase._id;
														this.viewWhich = 3;
													}}
												/>
												<IconButton
													className="action-button"
													iconProps={{
														iconName: "TripleColumn"
													}}
													onClick={() => {
														this.selectedId =
															orthoCase._id;
														this.viewWhich = 4;
													}}
												/>
												<IconButton
													className="action-button"
													iconProps={{
														iconName: "Diagnostic"
													}}
													onClick={() => {
														this.selectedId =
															orthoCase._id;
														this.viewWhich = 5;
													}}
												/>
												{API.user.currentUser
													.canViewAppointments ? (
													<IconButton
														className="action-button"
														iconProps={{
															iconName: "Calendar"
														}}
														onClick={() => {
															this.selectedId =
																orthoCase._id;
															this.viewWhich = 6;
														}}
													/>
												) : (
													""
												)}
												<IconButton
													className="action-button delete"
													iconProps={{
														iconName: "Trash"
													}}
													onClick={() =>
														cases.deleteModal(
															patient._id
														)
													}
													disabled={!this.canEdit}
												/>
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
												<ProfileSquared
													text={
														orthoCase.isStarted
															? dateUtils.unifiedDateFormat(
																	orthoCase.startedDate
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
												<ProfileSquared
													text={
														orthoCase.isFinished
															? dateUtils.unifiedDateFormat(
																	orthoCase.finishedDate
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
												<ProfileSquared
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
															? dateUtils.unifiedDateFormat(
																	patient
																		.lastAppointment
																		.date
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
												<ProfileSquared
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
															? dateUtils.unifiedDateFormat(
																	patient
																		.nextAppointment
																		.date
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
												<ProfileSquared
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
												<ProfileSquared
													text={
														setting.getSetting(
															"currencySymbol"
														) +
														patient.outstandingAmount.toString()
													}
													subText={lang(
														"Outstanding amount"
													)}
													size={3}
													onRenderInitials={() => (
														<Icon iconName="Cancel" />
													)}
													onClick={() => {}}
													initialsColor={
														patient.outstandingAmount >
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
										name: lang("Add New"),
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
					<h4>Choose Patient</h4>
					<br />
					<TagInput
						strict
						value={[]}
						options={cases.patientsWithNoOrtho.map(patient => ({
							key: patient._id,
							text: patient.name
						}))}
						onAdd={val => {
							this.showAdditionPanel = false;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = val.key;
							cases.list.push(orthoCase);
							this.selectedId = orthoCase._id;
						}}
						placeholder="Type to select patient"
					/>
					<br />
					<hr />
					<h4>Or add new patient</h4>
					<br />
					<TextField
						placeholder="Patient name"
						value={this.newPatientName}
						onChanged={v => (this.newPatientName = v)}
					/>
					<PrimaryButton
						onClick={() => {
							const newPatient = new patientsData.Patient();
							newPatient.name = this.newPatientName;
							const orthoCase = new OrthoCase();
							orthoCase.patientID = newPatient._id;
							patientsData.patients.list.push(newPatient);
							cases.list.push(orthoCase);
							this.newPatientName = "";
							this.selectedId = orthoCase._id;
						}}
						iconProps={{
							iconName: "add"
						}}
					>
						Add New
					</PrimaryButton>
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
									<Profile
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
															"Orthodontic Case sheet"
													  )
													: ""}
												{this.viewWhich === 4
													? lang("Orthodontic Album")
													: ""}
												{this.viewWhich === 5
													? lang("Diagnostic X-Rays")
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
									<PatientDetails
										patient={this.selectedPatient}
									/>
								) : (
									""
								)}

								{this.viewWhich === 2 ? (
									<DentalHistory
										patient={this.selectedPatient}
									/>
								) : (
									""
								)}

								{this.viewWhich === 3 ? (
									<OrthoCaseSheet
										orthoCase={this.selectedCase}
									/>
								) : (
									""
								)}

								{this.viewWhich === 4 ? (
									<Orthograph orthoCase={this.selectedCase} />
								) : (
									""
								)}
								{this.viewWhich === 6 ? (
									<PatientAppointments
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
