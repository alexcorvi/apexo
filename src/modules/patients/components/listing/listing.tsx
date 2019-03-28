import * as dateUtils from "../../../../assets/utils/date";
import * as React from "react";
import { API } from "../../../../core";
import { computed, observable } from "mobx";
import { DataTable } from "../../../../assets/components/data-table/data-table.component";
import { genderToString, patients } from "../../data";
import { Label } from "../../../../assets/components/label/label.component";
import { observer } from "mobx-react";
import { Patient } from "../../data";
import { Profile } from "../../../../assets/components/profile/profile";
import { ProfileSquared } from "../../../../assets/components/profile/profile-squared";
import "./listing.scss";
import { lang } from "../../../../core/i18/i18";
import {
	IconButton,
	Icon,
	PersonaInitialsColor,
	Panel,
	PanelType
} from "office-ui-fabric-react";
import setting from "../../../settings/data/data.settings";
import { Row, Col } from "../../../../assets/components/grid";
import { PatientDetails } from "../single/patient-details/patient-details";
import { DentalHistory } from "../single/dental-history/dental-history";
import { PatientAppointments } from "../single/patient-appointments/patient-appointments";
import { SinglePatientGallery } from "../single/gallery/gallery";

@observer
export class PatientsListing extends React.Component<{}, {}> {
	@observable selectedId: string = API.router.currentLocation.split("/")[1];

	@observable viewWhich: number = 0;

	@computed
	get patient() {
		return patients.list.find(patient => patient._id === this.selectedId);
	}

	@computed get canEdit() {
		return API.user.currentUser.canEditPatients;
	}

	render() {
		return (
			<div className="patients-component p-15 p-l-10 p-r-10">
				{this.patient ? (
					<Panel
						key={this.selectedId + this.viewWhich}
						isOpen={!!this.patient}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedId = "";
							this.viewWhich = 0;
						}}
						onRenderNavigation={() => {
							return (
								<Row className="panel-heading">
									<Col span={22}>
										<Profile
											name={this.patient!.name}
											secondaryElement={
												<div>
													{this.viewWhich === 1
														? lang(
																"Patient Details"
														  )
														: ""}
													{this.viewWhich === 2
														? lang("Dental History")
														: ""}
													{this.viewWhich === 3
														? lang("Gallery")
														: ""}
													{this.viewWhich === 4
														? lang("Appointments")
														: ""}
												</div>
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
						{this.viewWhich === 1 ? (
							<PatientDetails patient={this.patient} />
						) : (
							""
						)}
						{this.viewWhich === 2 ? (
							<DentalHistory patient={this.patient} />
						) : (
							""
						)}
						{this.viewWhich === 3 ? (
							<SinglePatientGallery patient={this.patient} />
						) : (
							""
						)}
						{this.viewWhich === 4 ? (
							<PatientAppointments patient={this.patient} />
						) : (
							""
						)}
					</Panel>
				) : (
					""
				)}
				<DataTable
					maxItemsOnLoad={15}
					className={"patients-data-table"}
					heads={[
						lang("Patient"),
						lang("Last/Next Appointment"),
						lang("Total/Outstanding Payments"),
						lang("Label")
					]}
					rows={patients.list.map(patient => ({
						id: patient._id,
						searchableString: patient.searchableString,
						cells: [
							{
								dataValue:
									patient.name +
									" " +
									patient.age +
									" " +
									genderToString(patient.gender),
								component: (
									<div>
										<Profile
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
										<IconButton
											className="action-button"
											iconProps={{
												iconName: "DietPlanNotebook"
											}}
											onClick={() => {
												this.selectedId = patient._id;
												this.viewWhich = 1;
											}}
										/>
										<IconButton
											className="action-button"
											iconProps={{
												iconName: "Teeth"
											}}
											onClick={() => {
												this.selectedId = patient._id;
												this.viewWhich = 2;
											}}
										/>
										<IconButton
											className="action-button"
											iconProps={{
												iconName: "PhotoCollection"
											}}
											onClick={() => {
												this.selectedId = patient._id;
												this.viewWhich = 3;
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
														patient._id;
													this.viewWhich = 4;
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
												patients.deleteModal(
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
								dataValue: (
									patient.lastAppointment ||
									patient.nextAppointment || { date: 0 }
								).date,
								component: (
									<div>
										<ProfileSquared
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
											subText={lang("Payments made")}
											size={3}
											onRenderInitials={() => (
												<Icon iconName="CheckMark" />
											)}
											onClick={() => {}}
											initialsColor={
												patient.totalPayments > 0
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
												(patient.differenceAmount < 0
													? patient.outstandingAmount.toString()
													: patient.differenceAmount >
													  0
													? patient.overpaidAmount.toString()
													: "0")
											}
											subText={
												patient.differenceAmount < 0
													? lang("Outstanding amount")
													: patient.differenceAmount >
													  0
													? lang("Overpaid amount")
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
												<Label
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
										name: lang("Add New"),
										onClick: () => {
											const patient = new Patient();
											patients.list.push(patient);
											this.selectedId = patient._id;
											API.router.go([
												"patients",
												patient._id
											]);
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
				/>
			</div>
		);
	}
}
