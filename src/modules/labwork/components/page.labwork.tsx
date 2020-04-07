import {
	Col,
	DataTableComponent,
	getRandomTagType,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagInputComponent
	} from "@common-components";
import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { firstDayOfTheWeekDayPicker, formatDate, num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { MessageBarType, Panel, PanelType, TextField, Toggle } from "office-ui-fabric-react";
import { DatePicker, MessageBar, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class LabworkPage extends React.Component {
	dt: null | DataTableComponent = null;

	tabs = [
		{
			key: "details",
			icon: "Contact",
			title: "Case Details"
		},
		{
			key: "lab",
			icon: "TestBeaker",
			title: "Lab Details"
		},
		{
			key: "delete",
			icon: "trash",
			title: "Delete",
			hidden: !this.canEdit
		}
	];

	@computed
	get canEdit() {
		return core.user.currentUser!.canEditLabwork;
	}

	@computed
	get selectedLabwork() {
		return modules.labworks!.docs.find(
			x => x._id === core.router.selectedID
		);
	}

	render() {
		return (
			<div className="lw-pg">
				<DataTableComponent
					ref={dt => (this.dt = dt)}
					onDelete={
						this.canEdit
							? id => {
									modules.labworks!.deleteModal(id);
							  }
							: undefined
					}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () => {
											const labwork = modules.labworks!.new();
											modules.labworks!.add(labwork);
											core.router.select({
												id: labwork._id,
												tab: "details"
											});
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
					heads={[
						text("Labwork"),
						text("Operating Staff"),
						text("Laboratory"),
						text("Dates")
					]}
					rows={modules.labworks!.docs.map(labwork => {
						return {
							id: labwork._id,
							searchableString: labwork.searchableString,
							actions: this.tabs
								.filter(x => !x.hidden)
								.map(x => ({
									key: x.key,
									title: x.title,
									icon: x.icon,
									onClick: () => {
										if (x.key === "delete") {
											modules.labworks!.deleteModal(
												labwork._id
											);
										} else {
											core.router.select({
												id: labwork._id,
												tab: x.key
											});
										}
									}
								})),
							cells: [
								{
									dataValue: labwork.caseTitle,
									component: (
										<ProfileSquaredComponent
											text={labwork.caseTitle}
											onRenderPrimaryText={() => {
												return (
													<div>
														<span
															style={{
																display:
																	"block",
																marginBottom:
																	"-5px"
															}}
														>
															{labwork.caseTitle}
														</span>
														<i
															style={{
																fontSize: 12
															}}
														>
															{(labwork
																.involvedTeeth
																.length
																? labwork
																		.involvedTeeth
																		.length +
																  " units"
																: "") +
																(labwork.patient
																	? " for " +
																	  labwork
																			.patient
																			.name
																	: "")}
														</i>
													</div>
												);
											}}
										/>
									),
									onClick: () => {
										core.router.select({
											id: labwork._id,
											tab: "details"
										});
									},
									className: "no-label"
								},

								{
									dataValue: labwork.operatingStaff
										.map(x => x.name)
										.join(" "),
									component: (
										<div>
											{labwork.operatingStaff.map(
												member => (
													<div
														key={member._id}
														className="m-b-5 m-r-5"
													>
														<ProfileComponent
															size={1}
															name={member.name}
														/>
													</div>
												)
											)}
										</div>
									),
									className: "hidden-xs"
								},
								{
									dataValue: labwork.labName,
									component: labwork.labName.length ? (
										<TagComponent
											text={labwork.labName}
											type={getRandomTagType(
												labwork.labName
											)}
											highlighted={
												this.dt
													? this.dt.filterString ===
													  labwork.labName
													: false
											}
											onClick={() => {
												if (this.dt) {
													if (
														this.dt.filterString ===
														labwork.labName
													) {
														this.dt.filterString =
															"";
													} else {
														this.dt.filterString =
															labwork.labName;
													}
												}
												this.forceUpdate();
											}}
										/>
									) : (
										""
									),
									className: "hidden-xs"
								},
								{
									dataValue: labwork.sentDate,
									component: (
										<div>
											{labwork.isSent ? (
												<TagComponent
													text={`Sent: ${formatDate(
														labwork.sentDate,
														modules.setting!.getSetting(
															"date_format"
														)
													)}`}
													type={getRandomTagType(
														labwork.labName
													)}
												/>
											) : (
												""
											)}
											<br />
											{labwork.isReceived ? (
												<TagComponent
													text={`Received: ${formatDate(
														labwork.receivedDate,
														modules.setting!.getSetting(
															"date_format"
														)
													)}`}
													type={getRandomTagType(
														labwork.labName
													)}
												/>
											) : (
												""
											)}
										</div>
									),
									className: "hidden-xs"
								}
							]
						};
					})}
					maxItemsOnLoad={20}
				/>

				{this.selectedLabwork ? (
					<Panel
						isOpen={!!this.selectedLabwork}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => (
							<div className="panel-heading">
								<PanelTop
									title={this.selectedLabwork!.caseTitle}
									type={"Labwork"}
									subTitle={
										this.selectedLabwork!.patient
											? this.selectedLabwork!.patient.name
											: ""
									}
									square
									onDismiss={() => core.router.unSelect()}
								/>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={key =>
										core.router.select({ tab: key })
									}
									items={this.tabs}
								/>
							</div>
						)}
					>
						<div className="labwork-editor">
							{core.router.selectedTab === "details" ? (
								<SectionComponent title={text("Case Details")}>
									<Row gutter={8}>
										<Col sm={12}>
											<TextField
												label={text("Case title")}
												value={
													this.selectedLabwork
														.caseTitle
												}
												onChange={(ev, val) =>
													(this.selectedLabwork!.caseTitle = val!)
												}
												disabled={!this.canEdit}
												data-testid="lw-title"
											/>
										</Col>
										<Col sm={12}>
											<TagInputComponent
												label={text("Patient")}
												className="lw-patient"
												options={modules.patients!.docs.map(
													patient => ({
														text: patient.name,
														key: patient._id
													})
												)}
												suggestionsHeaderText={text(
													"Select patient"
												)}
												noResultsFoundText={text(
													"No patients found"
												)}
												maxItems={1}
												disabled={!this.canEdit}
												value={
													this.selectedLabwork.patient
														? [
																{
																	text: this
																		.selectedLabwork
																		.patient
																		.name,
																	key: this
																		.selectedLabwork
																		.patient
																		._id
																}
														  ]
														: []
												}
												onChange={selectedKeys => {
													this.selectedLabwork!.patientID =
														selectedKeys[0] || "";
												}}
											/>
										</Col>
									</Row>
									<TagInputComponent
										label={text("Involved teeth")}
										className="lw-teeth"
										options={modules.ISOTeethArr.map(x => {
											return {
												key: x.toString(),
												text: x.toString()
											};
										})}
										suggestionsHeaderText={text(
											"Select involved teeth"
										)}
										noResultsFoundText={text(
											"No teeth found"
										)}
										disabled={!this.canEdit}
										value={this.selectedLabwork.involvedTeeth.map(
											x => ({
												key: x.toString(),
												text: x.toString()
											})
										)}
										onChange={selectedKeys => {
											this.selectedLabwork!.involvedTeeth = selectedKeys.map(
												x => num(x)
											);
										}}
									/>
									<br />
									<TextField
										label={text("Case Details")}
										data-testid="lw-case"
										value={this.selectedLabwork.caseDetails}
										onChange={(ev, val) =>
											(this.selectedLabwork!.caseDetails = val!)
										}
										disabled={!this.canEdit}
										multiline
									/>
									<TagInputComponent
										label={text("Operating staff")}
										className="lw-staff"
										options={modules
											.staff!.operatingStaff.sort(
												(a, b) =>
													a.name.localeCompare(b.name)
											)
											.map(s => {
												return {
													key: s._id,
													text: s.name
												};
											})}
										value={this.selectedLabwork!.operatingStaff.map(
											x => ({ key: x._id, text: x.name })
										)}
										onChange={newKeys => {
											this.selectedLabwork!.operatingStaffIDs = newKeys;
										}}
										disabled={!this.canEdit}
										suggestionsHeaderText={text(
											"Operating staff"
										)}
										noResultsFoundText={text(
											"No staff found"
										)}
									/>
								</SectionComponent>
							) : (
								""
							)}
							{core.router.selectedTab === "lab" ? (
								<SectionComponent title={text("Lab Details")}>
									<Row gutter={8}>
										<Col sm={12}>
											<TagInputComponent
												className="lab-name"
												label={text("Laboratory")}
												loose
												options={modules
													.labworks!.docs.map(
														x => x.labName
													)
													.filter(
														(x, i, a) =>
															a.indexOf(x) === i
													)
													.sort((a, b) =>
														a.localeCompare(b)
													)
													.map(labName => {
														return {
															key: labName,
															text: labName
														};
													})}
												value={
													this.selectedLabwork.labName
														? [
																{
																	key: this
																		.selectedLabwork
																		.labName,
																	text: this
																		.selectedLabwork
																		.labName
																}
														  ]
														: []
												}
												onChange={newKeys => {
													this.selectedLabwork!.labName =
														newKeys[0] || "";

													if (newKeys[0]) {
														const sentBefore = modules
															.labworks!.docs.sort(
																(a, b) => {
																	return (
																		b.sentDate -
																		a.sentDate
																	);
																}
															)
															.find(
																x =>
																	x.labName ===
																		this
																			.selectedLabwork!
																			.labName &&
																	x._id !==
																		this
																			.selectedLabwork!
																			._id
															);

														if (sentBefore) {
															this.selectedLabwork!.labContact =
																sentBefore.labContact;
														}
													} else {
														this.selectedLabwork!.labContact =
															"";
													}
												}}
												maxItems={1}
												disabled={!this.canEdit}
												suggestionsHeaderText={text(
													"Laboratory name"
												)}
												noResultsFoundText={text(
													"No laboratory found"
												)}
											/>
										</Col>
										<Col sm={12}>
											<TextField
												data-testid="lab-contact"
												disabled={!this.canEdit}
												label={text("Lab contact")}
												value={
													this.selectedLabwork
														.labContact
												}
												onChange={(e, newVal) => {
													this.selectedLabwork!.labContact = newVal!;
												}}
											/>
										</Col>
									</Row>
									<Row gutter={8}>
										<Col sm={8}>
											<div className="m-t-20">
												<Toggle
													checked={
														this.selectedLabwork
															.isPaid
													}
													onText={text("Paid")}
													offText={text("Not paid")}
													disabled={!this.canEdit}
													onChange={(e, newVal) => {
														this.selectedLabwork!.isPaid = newVal!;
													}}
												/>
												{this.selectedLabwork.isPaid ? (
													<TextField
														type="number"
														disabled={!this.canEdit}
														label={text("Price")}
														value={this.selectedLabwork.price.toString()}
														onChange={(
															e,
															newVal
														) => {
															this.selectedLabwork!.price = num(
																newVal!
															);
														}}
														prefix={modules.setting!.getSetting(
															"currencySymbol"
														)}
													/>
												) : (
													""
												)}
											</div>
										</Col>
										<Col sm={8}>
											<div className="m-t-20">
												<Toggle
													checked={
														this.selectedLabwork
															.isSent
													}
													onText={text("Sent")}
													offText={text("Not sent")}
													disabled={!this.canEdit}
													onChange={(e, newVal) => {
														this.selectedLabwork!.isSent = newVal!;
													}}
												/>
												{this.selectedLabwork.isSent ? (
													<DatePicker
														firstDayOfWeek={firstDayOfTheWeekDayPicker(
															modules.setting!.getSetting(
																"weekend_num"
															)
														)}
														label={text(
															"Sent date"
														)}
														disabled={!this.canEdit}
														placeholder={text(
															"Select a date"
														)}
														value={
															new Date(
																this.selectedLabwork.sentDate
															)
														}
														onSelectDate={date => {
															if (date) {
																this.selectedLabwork!.sentDate = date.getTime();
															}
														}}
														formatDate={d =>
															formatDate(
																d || 0,
																modules.setting!.getSetting(
																	"date_format"
																)
															)
														}
													/>
												) : (
													""
												)}
											</div>
										</Col>
										<Col sm={8}>
											<div className="m-t-20">
												<Toggle
													checked={
														this.selectedLabwork
															.isReceived
													}
													onText={text("Received")}
													offText={text(
														"Not received"
													)}
													disabled={!this.canEdit}
													onChange={(e, newVal) => {
														this.selectedLabwork!.isReceived = newVal!;
													}}
												/>
												{this.selectedLabwork
													.isReceived ? (
													<DatePicker
														label={text(
															"Received date"
														)}
														firstDayOfWeek={firstDayOfTheWeekDayPicker(
															modules.setting!.getSetting(
																"weekend_num"
															)
														)}
														disabled={!this.canEdit}
														placeholder={text(
															"Select a date"
														)}
														value={
															new Date(
																this.selectedLabwork.receivedDate
															)
														}
														onSelectDate={date => {
															if (date) {
																this.selectedLabwork!.receivedDate = date.getTime();
															}
														}}
														formatDate={d =>
															formatDate(
																d || 0,
																modules.setting!.getSetting(
																	"date_format"
																)
															)
														}
													/>
												) : (
													""
												)}
											</div>
										</Col>
									</Row>
								</SectionComponent>
							) : (
								""
							)}
							{core.router.selectedTab === "delete" ? (
								<div>
									<br />
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										{text(
											"Are you sure you want to delete"
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
											modules.labworks!.delete(
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
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
