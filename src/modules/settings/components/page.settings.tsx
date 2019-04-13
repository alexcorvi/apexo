import { Col, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import {
	backup,
	compact,
	downloadCurrent,
	restore,
	status,
	text,
	user
	} from "@core";
import { setting } from "@modules";
import { dateNames, formatDate, second } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
	Dropdown,
	IconButton,
	MessageBar,
	MessageBarType,
	TextField,
	Toggle,
	TooltipHost
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class SettingsPage extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	@observable inputEl: HTMLInputElement | null = null;

	@computed get canEdit() {
		return user.currentUser.canEditSettings;
	}

	@observable loading: boolean = false;

	componentWillMount() {
		setTimeout(() => setting.updateDropboxBackups(), second);
	}

	render() {
		return (
			<div className="settings-component p-15 p-l-10 p-r-10">
				<SectionComponent title={text(`General Setting`)}>
					<SettingInputComponent
						element={
							<Dropdown
								label={text("Language")}
								options={[
									{ key: "en", text: "English" },
									{ key: "ar", text: "العربية" }
								]}
								defaultSelectedKey={setting.getSetting("lang")}
								onChange={(ev, v) => {
									setting.setSetting(
										"lang",
										v!.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={text(
							`Choose the main language of display menus and items`
						)}
					/>

					<SettingInputComponent
						element={
							<Dropdown
								label={text("Date format")}
								options={[
									{ key: "dd/mm/yyyy", text: "dd/mm/yyyy" },
									{ key: "mm/dd/yyyy", text: "mm/dd/yyyy" },
									{ key: "dd MM 'YY", text: "dd MM 'YY" }
								]}
								defaultSelectedKey={setting.getSetting(
									"date_format"
								)}
								onChange={(ev, v) => {
									setting.setSetting(
										"date_format",
										v!.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={text(
							`Set the date format to be used across this application`
						)}
					/>

					<SettingInputComponent
						element={
							<Dropdown
								label={text("Week ends on")}
								options={dateNames
									.days(true)
									.map((dayName, index) => ({
										key: index.toString(),
										text: text(dayName)
									}))}
								defaultSelectedKey={setting.getSetting(
									"weekend_num"
								)}
								onChange={(ev, v) => {
									setting.setSetting(
										"weekend_num",
										v!.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={text(`On which day the week ends`)}
					/>

					<SettingInputComponent
						element={
							<TextField
								value={setting.getSetting(
									"dropbox_accessToken"
								)}
								label={text("Dropbox access token")}
								onChange={(ev, val) => {
									setting.setSetting(
										"dropbox_accessToken",
										val!
									);

									setTimeout(
										() => status.validateDropBoxToken(),
										second / 2
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={text(
							`This access token is used to store files across the application, like backups and images`
						)}
					/>
				</SectionComponent>

				<SectionComponent title={text(`Financial Settings`)}>
					{setting.getSetting("time_tracking") ? (
						<SettingInputComponent
							element={
								<TextField
									label={text("Time expenses (per hour)")}
									type="number"
									value={setting.getSetting("hourlyRate")}
									onChange={(ev, newVal) => {
										setting.setSetting(
											"hourlyRate",
											newVal!.toString()
										);
									}}
									disabled={!this.canEdit}
								/>
							}
							info={text(
								// tslint:disable-next-line:max-line-length
								`When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses So here you can put the electricity, rent, and other time dependent expenses`
							)}
						/>
					) : (
						""
					)}

					<SettingInputComponent
						element={
							<TextField
								label={text("Currency symbol")}
								value={setting.getSetting("currencySymbol")}
								onChange={(ev, newVal) => {
									setting.setSetting(
										"currencySymbol",
										newVal!.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={text(
							`This symbol you enter here will be used across your application`
						)}
					/>
				</SectionComponent>

				<SectionComponent title={text(`Optional Modules and Features`)}>
					<Toggle
						onText={text("Prescriptions module enabled")}
						offText={text("Prescriptions module disabled")}
						defaultChecked={
							!!setting.getSetting("module_prescriptions")
						}
						onChange={(ev, val) => {
							setting.setSetting(
								"module_prescriptions",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={text("Orthodontic module enabled")}
						offText={text("Orthodontic module disabled")}
						defaultChecked={
							!!setting.getSetting("module_orthodontics")
						}
						onChange={(ev, val) => {
							setting.setSetting(
								"module_orthodontics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={text("Statistics module enabled")}
						offText={text("Statistics module disabled")}
						defaultChecked={
							!!setting.getSetting("module_statistics")
						}
						onChange={(ev, val) => {
							setting.setSetting(
								"module_statistics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={text("Time tracking enabled")}
						offText={text("Time tracking disabled")}
						defaultChecked={!!setting.getSetting("time_tracking")}
						onChange={(ev, val) => {
							setting.setSetting(
								"time_tracking",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
				</SectionComponent>

				<SectionComponent title={text(`Backup and Restore`)}>
					{status.online ? (
						<div>
							<DefaultButton
								onClick={() => {
									compact.compact();
								}}
								iconProps={{ iconName: "ZipFolder" }}
								className="m-l-5 m-t-5"
								text={text("Run compaction")}
							/>

							<DefaultButton
								onClick={() => {
									downloadCurrent();
								}}
								className="m-l-5 m-t-5"
								iconProps={{ iconName: "Database" }}
								text={text("Download a backup")}
							/>

							<DefaultButton
								onClick={() =>
									this.inputEl ? this.inputEl.click() : ""
								}
								className="m-l-5 m-t-5"
								iconProps={{ iconName: "DatabaseSync" }}
								text={text("Restore from file")}
							/>
							<input
								ref={el => (this.inputEl = el)}
								hidden
								type="file"
								multiple={false}
								onChange={async e => {
									if (
										e.target.files &&
										e.target.files.length > 0
									) {
										await restore.fromFile(
											e.target.files[0]
										);
									}
								}}
							/>
						</div>
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"Backup and restore functionality are not available while you're offline"
							)}
						</MessageBar>
					)}
				</SectionComponent>

				<SectionComponent title={text(`Automated Backup and Restore`)}>
					{status.online ? (
						status.dropboxActive ? (
							<div>
								<Dropdown
									label={text("Backup frequency")}
									options={[
										{ key: "d", text: text("Daily") },
										{ key: "w", text: text("Weekly") },
										{ key: "m", text: text("Monthly") },
										{ key: "n", text: text("Never") }
									]}
									defaultSelectedKey={setting.getSetting(
										"backup_freq"
									)}
									onChange={(ev, v) => {
										setting.setSetting(
											"backup_freq",
											v!.key.toString()
										);
									}}
									disabled={!this.canEdit}
								/>

								<TextField
									value={setting.getSetting("backup_retain")}
									label={text("How many backups to retain")}
									onChange={(ev, val) => {
										setting.setSetting(
											"backup_retain",
											val!
										);
									}}
									disabled={!this.canEdit}
									type="number"
								/>

								{setting.dropboxBackups.length ? (
									<table className="ms-table">
										<thead>
											<tr>
												<th>{text("Backup")}</th>
												<th>{text("Actions")}</th>
											</tr>
										</thead>
										<tbody>
											{setting.dropboxBackups.map(
												file => {
													const date = new Date(
														file.client_modified
													);

													return (
														<tr key={file.id}>
															<td>
																<ProfileSquaredComponent
																	onRenderInitials={() => (
																		<div
																			style={{
																				textAlign:
																					"center",
																				fontSize: 10
																			}}
																		>
																			{`${date.getDate()}/${date.getMonth() +
																				1}`}
																		</div>
																	)}
																	text={formatDate(
																		date,
																		setting.getSetting(
																			"date_format"
																		)
																	)}
																	subText={`${Math.round(
																		file.size /
																			1000
																	)} KB`}
																/>
															</td>
															<td>
																<TooltipHost
																	content={text(
																		"Delete"
																	)}
																>
																	<IconButton
																		style={{
																			marginRight: 6
																		}}
																		iconProps={{
																			iconName: this
																				.loading
																				? "sync"
																				: "delete"
																		}}
																		className={
																			this
																				.loading
																				? "rotate"
																				: ""
																		}
																		disabled={
																			!this
																				.canEdit
																		}
																		onClick={() => {
																			this.loading = true;
																			backup
																				.deleteOld(
																					file.path_lower
																				)
																				.then(
																					() => {
																						this.loading = false;
																						setting.updateDropboxBackups();
																					}
																				)
																				.catch(
																					() => {
																						this.loading = false;
																						setting.updateDropboxBackups();
																					}
																				);
																		}}
																	/>
																</TooltipHost>

																<TooltipHost
																	content={text(
																		"Restore"
																	)}
																>
																	<IconButton
																		style={{
																			marginRight: 6
																		}}
																		iconProps={{
																			iconName: this
																				.loading
																				? "sync"
																				: "DatabaseSync"
																		}}
																		className={
																			this
																				.loading
																				? "rotate"
																				: ""
																		}
																		disabled={
																			!this
																				.canEdit
																		}
																		onClick={() => {
																			this.loading = true;
																			restore
																				.fromDropbox(
																					file.path_lower
																				)
																				.then(
																					() =>
																						(this.loading = false)
																				)
																				.catch(
																					() =>
																						(this.loading = false)
																				);
																		}}
																	/>
																</TooltipHost>
															</td>
														</tr>
													);
												}
											)}
										</tbody>
									</table>
								) : (
									""
								)}
							</div>
						) : (
							<MessageBar messageBarType={MessageBarType.warning}>
								A valid DropBox access token is required for
								this section
							</MessageBar>
						)
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"Backup and restore functionality are not available while you're offline"
							)}
						</MessageBar>
					)}
				</SectionComponent>
			</div>
		);
	}
}
@observer
export class SettingInputComponent extends React.Component<{
	element: React.ReactElement<any>;
	info: string;
}> {
	render() {
		return (
			<Row gutter={12} style={{ marginBottom: 20 }}>
				<Col style={{ marginBottom: -15 }} md={12}>
					{this.props.element}
				</Col>
				<Col md={12}>
					<MessageBar
						style={{ marginTop: 22 }}
						messageBarType={MessageBarType.info}
					>
						{this.props.info}
					</MessageBar>
				</Col>
			</Row>
		);
	}
}
