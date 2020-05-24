import { imagesTable, text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	DataTableComponent,
	LastNextAppointment,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	ProfileSquaredComponent,
	TableActions,
	TagComponent,
} from "@common-components";
import {
	Patient,
	PatientAppointmentsPanel,
	PatientGalleryPanel,
} from "@modules";
import {
	Icon,
	Panel,
	PanelType,
	PersonaInitialsColor,
	Shimmer,
} from "office-ui-fabric-react";
import {
	MessageBar,
	MessageBarType,
	PrimaryButton,
} from "office-ui-fabric-react";

const PatientDetailsPanel = loadable({
	loader: async () =>
		(await import("modules/patients/components/patient-details"))
			.PatientDetailsPanel,
	loading: () => <Shimmer />,
});
const DentalHistoryPanel = loadable({
	loader: async () =>
		(await import("modules/patients/components/dental-history"))
			.DentalHistoryPanel,
	loading: () => <Shimmer />,
});

const AppointmentEditorPanel = loadable({
	loader: async () =>
		(await import("modules/appointments/components/appointment-editor"))
			.AppointmentEditorPanel,
	loading: () => <Shimmer />,
});

@observer
export class PatientsPage extends React.Component {
	dt: DataTableComponent | null = null;
	@observable selectedAppointmentId = "";

	@computed
	get selectedPatient() {
		return modules.patients!.docs.find(
			(patient) => patient._id === core.router.selectedID
		);
	}

	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	@computed get selectedAppointment() {
		return modules.appointments!.docs.find(
			(x) => x._id === this.selectedAppointmentId
		);
	}

	tabs = [
		{
			key: "details",
			title: text("patient details").h,
			icon: "DietPlanNotebook",
		},
		{
			key: "dental",
			title: text("dental history").h,
			icon: "teeth",
		},
		{
			key: "gallery",
			title: text("gallery").h,
			icon: "PhotoCollection",
		},
		{
			key: "appointments",
			title: text("appointments").h,
			icon: "Calendar",
			hidden: !core.user.currentUser!.canViewAppointments,
		},
		{
			key: "delete",
			title: text("delete").h,
			icon: "Trash",
			hidden: !this.canEdit,
		},
	];

	render() {
		return (
			<div className="patients-component">
				{this.selectedPatient ? (
					<Panel
						key={core.router.selectedID}
						isOpen={!!this.selectedPatient}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => {
							return (
								<div className="panel-heading">
									<PanelTop
										title={this.selectedPatient!.name}
										type={text("patient").c}
										subTitle={`${
											text(this.selectedPatient!.gender).c
										} - ${this.selectedPatient!.age} ${
											text("years old").r
										}`}
										onDismiss={() => core.router.unSelect()}
										avatar={
											this.selectedPatient!.avatar
												? imagesTable.table[
														this.selectedPatient!
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
									<PanelTabs
										currentSelectedKey={
											core.router.selectedTab
										}
										onSelect={(key) => {
											core.router.select({ tab: key });
										}}
										items={this.tabs}
									/>
								</div>
							);
						}}
					>
						{core.router.selectedTab === "details" ? (
							<PatientDetailsPanel
								patient={this.selectedPatient!}
								onChangeViewWhich={(key) =>
									core.router.select({ tab: key })
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
						{core.router.selectedTab === "gallery" ? (
							<PatientGalleryPanel
								patient={this.selectedPatient}
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
									messageBarType={MessageBarType.warning}
								>
									{`${text("all of the patient").c} ${
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
										iconName: "delete",
									}}
									text={text("delete").c}
									onClick={() => {
										modules.patients!.delete(
											core.router.selectedID
										);
										core.router.unSelect();
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
					ref={(dt) => (this.dt = dt)}
					maxItemsOnLoad={10}
					className={"patients-data-table"}
					heads={[
						text("patient name").h,
						`${text("previous").h}/${text("next").h} ${text(
							"appointment"
						)}`,
						`${text("total").h}/${text("outstanding").h} ${
							text("payment").h
						}`,
						text("labels").c,
					]}
					rows={modules.patients!.docs.map((patient) => ({
						id: patient._id,
						className:
							"pg-pn-" +
							patient.name.toLowerCase().replace(/\s/g, ""),
						searchableString: patient.searchableString,
						actions: this.tabs
							.filter((x) => !x.hidden)
							.map((x) => ({
								key: x.key,
								title: x.title,
								icon: x.icon,
								onClick: () => {
									if (x.key === "delete") {
										modules.patients!.deleteModal(
											patient._id
										);
									} else {
										core.router.select({
											id: patient._id,
											tab: x.key,
										});
									}
								},
							})),
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
												<span className="itl">
													<span className="cap">
														{text(patient.gender)}
													</span>{" "}
													- {patient.age}{" "}
													{text("years old")}
												</span>
											}
											size={3}
										/>
										<br />
									</div>
								),
								className: "no-label",
								onClick: () => {
									core.router.select({
										id: patient._id,
										tab: "details",
									});
								},
							},
							{
								dataValue: (
									patient.lastAppointment ||
									patient.nextAppointment || { date: 0 }
								).date,
								component: (
									<LastNextAppointment
										lastAppointment={
											patient.lastAppointment
										}
										nextAppointment={
											patient.nextAppointment
										}
										onClick={(id) => {
											this.selectedAppointmentId = id;
											core.router.select({
												sub: "details",
											});
										}}
									></LastNextAppointment>
								),
								className: "hidden-xs",
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
											subText={text("payments made").c}
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
													? text("outstanding amount")
															.c
													: patient.differenceAmount >
													  0
													? text("overpaid amount").c
													: text(
															"no outstanding amount"
													  ).c
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
								className: "hidden-xs",
							},
							{
								dataValue: patient.labels
									.map((x) => x.text)
									.join(","),
								component: (
									<div>
										{patient.labels.map((label, index) => {
											return (
												<TagComponent
													key={index}
													text={label.text}
													type={label.type}
													highlighted={
														this.dt
															? this.dt
																	.filterString ===
															  label.text
															: false
													}
													onClick={() => {
														if (this.dt) {
															if (
																this.dt
																	.filterString ===
																label.text
															) {
																this.dt.filterString =
																	"";
															} else {
																this.dt.filterString =
																	label.text;
															}
														}
														this.forceUpdate();
													}}
												/>
											);
										})}
									</div>
								),
								className: "hidden-xs",
							},
						],
					}))}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("add new").c,
										onClick: () => {
											const patient = modules.patients!.new();
											patient.fromJSON(patient.toJSON()); // init. teeth
											modules.patients!.add(patient);
											core.router.select({
												id: patient._id,
												tab: "details",
											});
										},
										iconProps: {
											iconName: "Add",
										},
									},
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
