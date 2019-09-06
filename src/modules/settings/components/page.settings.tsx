import { Col, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import * as core from "@core";
import { status, text } from "@core";
import * as modules from "@modules";
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
export class SettingsPage extends React.Component {
	unlockCombinations = [
		[5, 4, 9],
		[3, 2, 5],
		[6, 1, 7],
		[2, 6, 8],
		[5, 1, 6],
		[4, 1, 5]
	];

	chosenCombination = this.unlockCombinations[Math.floor(Math.random() * 6)];

	@observable compactionInProgress = false;
	@observable downloadInProgress = false;

	@observable inputEl: HTMLInputElement | null = null;

	@computed get canEdit() {
		return core.user.currentUser!.canEditSettings;
	}

	@observable remoteBackupInProgress: boolean = false;

	@observable locked: boolean = true;

	componentDidMount() {
		setTimeout(() => modules.setting!.updateDropboxBackups(), second);
	}

	render() {
		return (
			<div className="settings-component container-fluid">
				{this.locked ? (
					<div>
						<h2>{text("Settings are locked")}</h2>
						<h3>
							{text(
								"To prevent unintentional changes, solve the mathematical equation to unlock"
							)}
						</h3>
						<hr />
						<div className="math-question">
							{this.chosenCombination[0]} +{" "}
							{this.chosenCombination[1]} ={" "}
							<TextField
								type="number"
								onChange={(e, v) =>
									Number(v) === this.chosenCombination[2]
										? (this.locked = false)
										: ""
								}
							/>
						</div>
					</div>
				) : (
					<div className="unlocked">
						{" "}
						<SectionComponent title={text(`General Setting`)}>
							<SettingInputComponent
								element={
									<Dropdown
										label={text("Language")}
										options={[
											{ key: "en", text: "English" },
											{ key: "ar", text: "العربية" }
										]}
										defaultSelectedKey={modules.setting!.getSetting(
											"lang"
										)}
										onChange={(ev, v) => {
											modules.setting!.setSetting(
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
											{
												key: "dd/mm/yyyy",
												text: "dd/mm/yyyy"
											},
											{
												key: "mm/dd/yyyy",
												text: "mm/dd/yyyy"
											},
											{
												key: "dd MM 'YY",
												text: "dd MM 'YY"
											}
										]}
										defaultSelectedKey={modules.setting!.getSetting(
											"date_format"
										)}
										onChange={(ev, v) => {
											modules.setting!.setSetting(
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
											.days()
											.map((dayName, index) => ({
												key: index.toString(),
												text: text(dayName)
											}))}
										defaultSelectedKey={modules.setting!.getSetting(
											"weekend_num"
										)}
										onChange={(ev, v) => {
											modules.setting!.setSetting(
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
										value={modules.setting!.getSetting(
											"dropbox_accessToken"
										)}
										label={text("Dropbox access token")}
										onChange={(ev, val) => {
											modules.setting!.setSetting(
												"dropbox_accessToken",
												val!
											);

											setTimeout(
												() =>
													core.status.validateOnlineStatus(),
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
							{modules.setting!.getSetting("time_tracking") ? (
								<SettingInputComponent
									element={
										<TextField
											label={text(
												"Time expenses (per hour)"
											)}
											type="number"
											value={modules.setting!.getSetting(
												"hourlyRate"
											)}
											onChange={(ev, newVal) => {
												modules.setting!.setSetting(
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
										value={modules.setting!.getSetting(
											"currencySymbol"
										)}
										onChange={(ev, newVal) => {
											modules.setting!.setSetting(
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
						<SectionComponent
							title={text(`Optional Modules and Features`)}
						>
							<Toggle
								data-testid="prescriptions-toggle"
								onText={text("Prescriptions module enabled")}
								offText={text("Prescriptions module disabled")}
								checked={
									!!modules.setting!.getSetting(
										"module_prescriptions"
									)
								}
								onChange={(ev, val) => {
									modules.setting!.setSetting(
										"module_prescriptions",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
							<Toggle
								data-testid="ortho-toggle"
								onText={text("Orthodontic module enabled")}
								offText={text("Orthodontic module disabled")}
								checked={
									!!modules.setting!.getSetting(
										"module_orthodontics"
									)
								}
								onChange={(ev, val) => {
									modules.setting!.setSetting(
										"module_orthodontics",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
							<Toggle
								data-testid="labwork-toggle"
								onText={text("Labwork module enabled")}
								offText={text("Labwork module disabled")}
								checked={
									!!modules.setting!.getSetting(
										"module_labwork"
									)
								}
								onChange={(ev, val) => {
									modules.setting!.setSetting(
										"module_labwork",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
							<Toggle
								data-testid="stats-toggle"
								onText={text("Statistics module enabled")}
								offText={text("Statistics module disabled")}
								checked={
									!!modules.setting!.getSetting(
										"module_statistics"
									)
								}
								onChange={(ev, val) => {
									modules.setting!.setSetting(
										"module_statistics",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
							<Toggle
								data-testid="time-tracking-toggle"
								onText={text("Time tracking enabled")}
								offText={text("Time tracking disabled")}
								checked={
									!!modules.setting!.getSetting(
										"time_tracking"
									)
								}
								onChange={(ev, val) => {
									modules.setting!.setSetting(
										"time_tracking",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
						</SectionComponent>
						<SectionComponent title={text(`Backup and Restore`)}>
							{status.isOnline.server ? (
								<div>
									<DefaultButton
										onClick={async () => {
											this.compactionInProgress = true;
											await core.dbAction("compact");
											this.compactionInProgress = false;
										}}
										iconProps={{ iconName: "ZipFolder" }}
										className="m-l-5 m-t-5"
										text={text("Run compaction")}
										disabled={this.compactionInProgress}
									/>

									<DefaultButton
										onClick={async () => {
											this.downloadInProgress = true;
											await core.downloadCurrentStateAsBackup();
											this.downloadInProgress = false;
										}}
										className="m-l-5 m-t-5"
										iconProps={{ iconName: "Database" }}
										text={text("Download a backup")}
										disabled={this.downloadInProgress}
									/>

									<DefaultButton
										onClick={() =>
											this.inputEl
												? this.inputEl.click()
												: ""
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
												core.restore.fromFile(
													e.target.files[0]
												);
											}
										}}
									/>
								</div>
							) : (
								<MessageBar
									messageBarType={MessageBarType.warning}
								>
									{text(
										"Backup and restore functionality are not available while you're offline"
									)}
								</MessageBar>
							)}
						</SectionComponent>
						<SectionComponent
							title={text(`Automated Backup and Restore`)}
						>
							{status.isOnline.client ? (
								status.isOnline.dropbox ? (
									<div>
										<Dropdown
											label={text("Backup frequency")}
											options={[
												{
													key: "d",
													text: text("Daily")
												},
												{
													key: "w",
													text: text("Weekly")
												},
												{
													key: "m",
													text: text("Monthly")
												},
												{
													key: "n",
													text: text("Never")
												}
											]}
											selectedKey={modules.setting!.getSetting(
												"backup_freq"
											)}
											onChange={(ev, v) => {
												modules.setting!.setSetting(
													"backup_freq",
													v!.key.toString()
												);
											}}
											disabled={!this.canEdit}
										/>

										<TextField
											value={modules.setting!.getSetting(
												"backup_retain"
											)}
											label={text(
												"How many backups to retain"
											)}
											onChange={(ev, val) => {
												modules.setting!.setSetting(
													"backup_retain",
													val!
												);
											}}
											disabled={!this.canEdit}
											type="number"
										/>

										{modules.setting!.dropboxBackups
											.length ? (
											<table className="ms-table">
												<thead>
													<tr>
														<th>
															{text("Backup")}
														</th>
														<th>
															{text("Actions")}
														</th>
													</tr>
												</thead>
												<tbody>
													{modules.setting!.dropboxBackups.map(
														file => {
															const date = new Date(
																file.client_modified
															);

															return (
																<tr
																	key={
																		file.id
																	}
																>
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
																				modules.setting!.getSetting(
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
																					iconName:
																						"delete"
																				}}
																				disabled={
																					!this
																						.canEdit ||
																					this
																						.remoteBackupInProgress
																				}
																				onClick={() => {
																					this.remoteBackupInProgress = true;
																					core.backup
																						.deleteFromDropbox(
																							file.path_lower
																						)
																						.then(
																							() => {
																								this.remoteBackupInProgress = false;
																								modules.setting!.updateDropboxBackups();
																							}
																						)
																						.catch(
																							() => {
																								this.remoteBackupInProgress = false;
																								modules.setting!.updateDropboxBackups();
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
																					iconName:
																						"DatabaseSync"
																				}}
																				disabled={
																					!this
																						.canEdit ||
																					this
																						.remoteBackupInProgress
																				}
																				onClick={() => {
																					this.remoteBackupInProgress = true;
																					core.restore
																						.fromDropbox(
																							file.path_lower
																						)
																						.then(
																							() =>
																								(this.remoteBackupInProgress = false)
																						)
																						.catch(
																							() =>
																								(this.remoteBackupInProgress = false)
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
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										A valid DropBox access token is required
										for this section
									</MessageBar>
								)
							) : (
								<MessageBar
									messageBarType={MessageBarType.warning}
								>
									{text(
										"Backup and restore functionality are not available while you're offline"
									)}
								</MessageBar>
							)}
						</SectionComponent>
					</div>
				)}
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
			<Row gutter={8} style={{ marginBottom: 20 }}>
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
