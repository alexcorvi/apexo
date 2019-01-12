import * as dateUtils from "../../../assets/utils/date";
import * as React from "react";
import { API } from "../../../core";
import { appointmentsData } from "../../appointments";
import { AppointmentsList } from "../../../assets/components/appointments-list/appointments-list";
import { Col, Row } from "../../../assets/components/grid/index";
import {
	IconButton,
	Panel,
	PanelType,
	TextField,
	Toggle,
	MessageBar,
	MessageBarType
} from "office-ui-fabric-react";
import { computed, observable } from "mobx";
import { DataTable } from "../../../assets/components/data-table/data-table.component";
import { StaffMember, staffMembers } from "../data";
import { observer } from "mobx-react";
import { Profile } from "../../../assets/components/profile/profile";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { Section } from "../../../assets/components/section/section";
import { settings } from "../../settings/data";
import { TagInput } from "../../../assets/components/tag-input/tag-input";
import setting from "../../settings/data/data.settings";
import "./staff-listing.scss";

@observer
export class StaffListing extends React.Component<{}, {}> {
	@observable selectedId: string = API.router.currentLocation.split("/")[1];

	@computed get canEdit() {
		return API.user.currentUser.canEditStaff;
	}

	@computed
	get selectedMemberIndex() {
		return staffMembers.getIndexByID(this.selectedId);
	}

	@computed
	get member() {
		return staffMembers.list[this.selectedMemberIndex];
	}

	render() {
		return (
			<div className="staff-component p-15 p-l-10 p-r-10">
				<Row gutter={16}>
					<Col lg={16}>
						<DataTable
							onDelete={
								this.canEdit
									? id => {
											if (this.canEdit) {
												staffMembers.deleteModal(id);
											}
									  }
									: undefined
							}
							maxItemsOnLoad={15}
							heads={[
								"Staff Member",
								"Last Appointment",
								"Next Appointment"
							]}
							rows={staffMembers.list.map(member => ({
								id: member._id,
								searchableString: member.searchableString,
								cells: [
									{
										dataValue: member.name,
										component: (
											<Profile
												name={member.name}
												secondaryElement={
													<span>
														{
															member
																.nextAppointments
																.length
														}{" "}
														upcoming appointments
													</span>
												}
												onClick={() => {
													this.selectedId =
														member._id;
												}}
												size={3}
											/>
										),
										onClick: () => {
											this.selectedId = member._id;
										},
										className: "no-label"
									},
									{
										dataValue: (
											member.lastAppointment || {
												date: 0
											}
										).date,
										component: member.lastAppointment ? (
											<ProfileSquared
												text={
													member.lastAppointment
														.treatment.type
												}
												subText={dateUtils.relativeFormat(
													member.lastAppointment.date
												)}
												size={3}
												onClick={() => {}}
											/>
										) : (
											"Not registered"
										),
										className: "hidden-xs"
									},
									{
										dataValue: (
											member.nextAppointment || {
												date: Infinity
											}
										).date,
										component: member.nextAppointment ? (
											<ProfileSquared
												text={
													member.nextAppointment
														.treatment.type
												}
												subText={dateUtils.relativeFormat(
													member.nextAppointment.date
												)}
												size={3}
												onClick={() => {}}
											/>
										) : (
											"Not registered"
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
												name: "Add New",
												onClick: () => {
													const member = new StaffMember();
													staffMembers.list.push(
														member
													);
													this.selectedId =
														member._id;
												},
												iconProps: {
													iconName: "Add"
												}
											}
									  ]
									: []
							}
						/>
					</Col>
					<Col lg={8}>
						<table className="ms-table duty-table">
							<tbody>
								{[
									"Sunday",
									"Monday",
									"Tuesday",
									"Wednesday",
									"Thursday",
									"Friday",
									"Saturday"
								].map((dayName, index) => {
									return (
										<tr key={dayName}>
											<th className="day-name">
												{dayName}
											</th>
											<td>
												{staffMembers.list
													.filter(
														member =>
															member.onDutyDays.indexOf(
																dayName
															) !== -1
													)
													.map(member => {
														return (
															<Profile
																className="m-b-5"
																size={3}
																key={member._id}
																name={
																	member.name
																}
																secondaryElement={
																	<span>
																		{
																			(
																				member
																					.weeksAppointments[
																					index
																				] ||
																				[]
																			)
																				.length
																		}{" "}
																		appointments
																		for{" "}
																		{dayName.toLowerCase()}
																	</span>
																}
																onClick={() => {
																	this.selectedId =
																		member._id;
																}}
															/>
														);
													})}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Col>
				</Row>

				{this.member ? (
					<Panel
						isOpen={!!this.member}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedId = "";
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.member.name ? (
										<Profile
											name={this.member.name}
											secondaryElement={
												<span>
													{this.member.operates
														? ""
														: "non"}
													operating staff
												</span>
											}
											tertiaryText={this.member.phone}
											size={3}
										/>
									) : (
										<p />
									)}
								</Col>
								<Col span={4} className="close">
									<IconButton
										iconProps={{ iconName: "cancel" }}
										onClick={() => {
											this.selectedId = "";
										}}
									/>
								</Col>
							</Row>
						)}
					>
						<div className="staff-editor">
							<Section title="Information" showByDefault>
								<div className="staff-input">
									<TextField
										label="Name: "
										value={this.member.name}
										onChanged={val =>
											(this.member.name = val)
										}
										disabled={!this.canEdit}
									/>
								</div>

								<div className="staff-input">
									<label>Days on duty: </label>
									<TagInput
										strict={true}
										placeholder={"Enter day name..."}
										options={this.member.days.map(x => ({
											key: x,
											text: x
										}))}
										onChange={newVal => {
											this.member.onDutyDays = newVal.map(
												x => x.text
											);
										}}
										value={this.member.onDutyDays.map(
											x => ({ text: x, key: x })
										)}
										sortFunction={(a, b) =>
											this.member.days.indexOf(a.text) -
											this.member.days.indexOf(b.text)
										}
										disabled={!this.canEdit}
									/>
								</div>
								{this.member._id ===
								API.user.currentUser._id ? (
									<div className="staff-input">
										<TextField
											label="Login PIN"
											value={this.member.pin}
											onChanged={v =>
												(this.member.pin = v)
											}
											onClick={() => {}}
										/>
									</div>
								) : (
									""
								)}
							</Section>

							{settings.getSetting("ask_for_user_contact") ? (
								<Section title="Contact Details" showByDefault>
									<Row gutter={12}>
										<Col sm={12}>
											<div className="staff-input">
												<TextField
													label="Phone Number: "
													value={this.member.phone}
													onChanged={val =>
														(this.member.phone = val)
													}
													disabled={!this.canEdit}
												/>
											</div>
										</Col>
										<Col sm={12}>
											<div className="staff-input">
												<TextField
													label="Email: "
													value={this.member.email}
													onChanged={val =>
														(this.member.email = val)
													}
													disabled={!this.canEdit}
												/>
											</div>
										</Col>
									</Row>
								</Section>
							) : (
								""
							)}

							{this.canEdit ? (
								<Section
									title="Level and permission"
									showByDefault
								>
									{this.member._id ===
									API.user.currentUser._id ? (
										<div>
											<MessageBar
												messageBarType={
													MessageBarType.warning
												}
											>
												You can't edit your own level
												and permissions
											</MessageBar>
											<br />
										</div>
									) : (
										""
									)}
									<Toggle
										defaultChecked={this.member.operates}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Operates on patients"
										offText="Does not operate on patients"
										onChanged={newVal => {
											this.member.operates = newVal;
										}}
									/>

									<Toggle
										defaultChecked={
											this.member.canViewStaff
										}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Can view staff page"
										offText="Can not view staff page"
										onChanged={newVal => {
											this.member.canViewStaff = newVal;
										}}
									/>
									<Toggle
										defaultChecked={
											this.member.canViewPatients
										}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Can view patients page"
										offText="Can not view patients page"
										onChanged={newVal => {
											this.member.canViewPatients = newVal;
										}}
									/>
									{setting.getSetting(
										"module_orthodontics"
									) ? (
										<Toggle
											defaultChecked={
												this.member.canViewOrtho
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can view orthodontics page"
											offText="Can not view orthodontics page"
											onChanged={newVal => {
												this.member.canViewOrtho = newVal;
											}}
										/>
									) : (
										""
									)}
									<Toggle
										defaultChecked={
											this.member.canViewAppointments
										}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Can view appointments page"
										offText="Can not view appointments page"
										onChanged={newVal => {
											this.member.canViewAppointments = newVal;
										}}
									/>
									<Toggle
										defaultChecked={
											this.member.canViewTreatments
										}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Can view treatments page"
										offText="Can not view treatments page"
										onChanged={newVal => {
											this.member.canViewTreatments = newVal;
										}}
									/>
									{setting.getSetting(
										"module_prescriptions"
									) ? (
										<Toggle
											defaultChecked={
												this.member.canViewPrescriptions
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can view prescriptions page"
											offText="Can not view prescriptions page"
											onChanged={newVal => {
												this.member.canViewPrescriptions = newVal;
											}}
										/>
									) : (
										""
									)}
									{setting.getSetting("module_statistics") ? (
										<Toggle
											defaultChecked={
												this.member.canViewStats
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can view statistics page"
											offText="Can not view statistics page"
											onChanged={newVal => {
												this.member.canViewStats = newVal;
											}}
										/>
									) : (
										""
									)}

									<Toggle
										defaultChecked={
											this.member.canViewSettings
										}
										disabled={
											this.member._id ===
											API.user.currentUser._id
										}
										onText="Can view settings page"
										offText="Can not view settings page"
										onChanged={newVal => {
											this.member.canViewSettings = newVal;
										}}
									/>

									{this.member.canViewStaff ? (
										<Toggle
											defaultChecked={
												this.member.canEditStaff
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit staff page"
											offText="Can not edit staff page"
											onChanged={newVal => {
												this.member.canEditStaff = newVal;
											}}
										/>
									) : (
										""
									)}
									{this.member.canViewPatients ? (
										<Toggle
											defaultChecked={
												this.member.canEditPatients
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit patients page"
											offText="Can not edit patients page"
											onChanged={newVal => {
												this.member.canEditPatients = newVal;
											}}
										/>
									) : (
										""
									)}

									{settings.getSetting(
										"module_orthodontics"
									) && this.member.canViewOrtho ? (
										<Toggle
											defaultChecked={
												this.member.canEditOrtho
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit orthodontics page"
											offText="Can not edit orthodontics page"
											onChanged={newVal => {
												this.member.canEditOrtho = newVal;
											}}
										/>
									) : (
										""
									)}

									{this.member.canViewAppointments ? (
										<Toggle
											defaultChecked={
												this.member.canEditAppointments
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit appointments page"
											offText="Can not edit appointments page"
											onChanged={newVal => {
												this.member.canEditAppointments = newVal;
											}}
										/>
									) : (
										""
									)}

									{this.member.canViewTreatments ? (
										<Toggle
											defaultChecked={
												this.member.canEditTreatments
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit treatments page"
											offText="Can not edit treatments page"
											onChanged={newVal => {
												this.member.canEditTreatments = newVal;
											}}
										/>
									) : (
										""
									)}

									{setting.getSetting(
										"module_prescriptions"
									) && this.member.canViewPrescriptions ? (
										<Toggle
											defaultChecked={
												this.member.canEditPrescriptions
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit prescriptions page"
											offText="Can not edit prescriptions page"
											onChanged={newVal => {
												this.member.canEditPrescriptions = newVal;
											}}
										/>
									) : (
										""
									)}

									{this.member.canViewSettings ? (
										<Toggle
											defaultChecked={
												this.member.canEditSettings
											}
											disabled={
												this.member._id ===
												API.user.currentUser._id
											}
											onText="Can edit settings page"
											offText="Can not edit settings page"
											onChanged={newVal => {
												this.member.canEditSettings = newVal;
											}}
										/>
									) : (
										""
									)}
								</Section>
							) : (
								""
							)}

							{API.user.currentUser.canViewAppointments ? (
								<Section title="Appointments" showByDefault>
									<AppointmentsList
										list={appointmentsData.appointments.list.filter(
											x =>
												x.staffID.indexOf(
													this.selectedId
												) > -1
										)}
									/>
								</Section>
							) : (
								""
							)}
						</div>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
