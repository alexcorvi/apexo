import {
	backup,
	restore,
	downloadCurrent,
	DropboxFile
} from "../../../assets/utils/backup";
import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import {
	PrimaryButton,
	TextField,
	Toggle,
	Dropdown,
	IconButton,
	MessageBar,
	MessageBarType
} from "office-ui-fabric-react";
import { settings } from "../data";
import "./settings.scss";
import { API } from "../../../core/index";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { compact } from "../../../core/db/index";
import { lang } from "../../../core/i18/i18";
import { unifiedDateFormat } from "../../../assets/utils/date";

@observer
export class SettingsComponent extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	@observable inputEl: HTMLInputElement | null = null;

	@computed get canEdit() {
		return API.user.currentUser.canEditSettings;
	}

	componentWillMount() {
		setTimeout(() => settings.updateDropboxFilesList(), 1000);
	}

	render() {
		return (
			<div className="settings-component p-15 p-l-10 p-r-10">
				<h3>{lang("Language")}</h3>
				<hr />
				<Dropdown
					label={lang("Language")}
					options={[
						{ key: "en", text: "English" },
						{ key: "ar", text: "العربية" }
					]}
					defaultSelectedKey={settings.getSetting("lang")}
					onChanged={v => {
						settings.setSetting("lang", v.key.toString());
					}}
					disabled={!this.canEdit}
				/>

				<br />
				<br />

				<h3>{lang("Financial Settings")}</h3>
				<hr />
				{!!settings.getSetting("time_tracking") ? (
					<Row gutter={12}>
						<Col md={12}>
							<div className="form">
								<TextField
									label={lang("Time expenses (per hour)")}
									type="number"
									value={settings.getSetting("hourlyRate")}
									onChanged={newVal => {
										settings.setSetting(
											"hourlyRate",
											newVal.toString()
										);
									}}
									disabled={!this.canEdit}
								/>
							</div>
						</Col>
						<Col md={12}>
							<p className="hint">
								{lang(
									// tslint:disable-next-line:max-line-length
									`When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses. So here you can put the electricity, rent, and other time dependent expenses.`
								)}
							</p>
						</Col>
					</Row>
				) : (
					""
				)}

				<Row gutter={12}>
					<Col md={12}>
						<div className="form">
							<TextField
								label={lang("Currency Symbol")}
								value={settings.getSetting("currencySymbol")}
								onChanged={newVal => {
									settings.setSetting(
										"currencySymbol",
										newVal.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						</div>
					</Col>
					<Col md={12}>
						<p className="hint">
							{lang(
								`This symbol you enter here will be used across your application.`
							)}
						</p>
					</Col>
				</Row>

				<br />
				<br />
				<h3>{lang("Optional Modules and features")}</h3>
				<hr />

				<div className="form">
					<Toggle
						onText={lang("Prescriptions Module Enabled")}
						offText={lang("Prescriptions Module Disabled")}
						defaultChecked={
							!!settings.getSetting("module_prescriptions")
						}
						onChanged={val => {
							settings.setSetting(
								"module_prescriptions",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Orthodontic Module Enabled")}
						offText={lang("Orthodontic Module Disabled")}
						defaultChecked={
							!!settings.getSetting("module_orthodontics")
						}
						onChanged={val => {
							settings.setSetting(
								"module_orthodontics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Statistics Module Enabled")}
						offText={lang("Statistics Module Disabled")}
						defaultChecked={
							!!settings.getSetting("module_statistics")
						}
						onChanged={val => {
							settings.setSetting(
								"module_statistics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Time Tracking Enabled")}
						offText={lang("Time Tracking Disabled")}
						defaultChecked={!!settings.getSetting("time_tracking")}
						onChanged={val => {
							settings.setSetting(
								"time_tracking",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
				</div>

				<br />
				<br />
				{this.canEdit ? (
					API.login.online ? (
						<div>
							<h3>{lang("Backup and restore")}</h3>
							<hr />

							<p className="hint" style={{ maxWidth: 500 }}>
								{// tslint:disable-next-line:max-line-length
								lang(
									`Using this section you can download a file representing all of your clinic data, use this file - later, to restore the same data.`
								)}
							</p>

							<PrimaryButton
								onClick={() => {
									compact.compact();
								}}
							>
								{lang("Run compaction")}
							</PrimaryButton>

							<PrimaryButton
								onClick={() => {
									downloadCurrent();
								}}
								style={{ marginLeft: 10 }}
							>
								{lang("Download a backup")}
							</PrimaryButton>

							<PrimaryButton
								onClick={() =>
									this.inputEl ? this.inputEl.click() : ""
								}
								style={{ marginLeft: 10 }}
							>
								{lang("Restore from file")}
							</PrimaryButton>
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

							<br />
							<br />
							<h3>{lang("Automated backup")}</h3>
							<hr />
							<div style={{ maxWidth: 500 }}>
								<p className="hint" style={{ maxWidth: 500 }}>
									{lang(
										// tslint:disable-next-line:max-line-length
										`Using automated backups you can set your application to automatically backup your data and store it in Dropbox. To turn on automated backups, enter your app access token.`
									)}{" "}
									<br />
									<a href="https://docs.apexo.app/docs/automated-backups">
										{lang("Learn more")}
									</a>
								</p>
								<Dropdown
									label={lang("Backup frequency")}
									options={[
										{ key: "d", text: lang("Daily") },
										{ key: "w", text: lang("Weekly") },
										{ key: "m", text: lang("Monthly") }
									]}
									defaultSelectedKey={settings.getSetting(
										"backup_freq"
									)}
									onChanged={v => {
										settings.setSetting(
											"backup_freq",
											v.key.toString()
										);
									}}
									disabled={!this.canEdit}
								/>

								<TextField
									value={settings.getSetting("backup_retain")}
									label={lang("How many backups to retain")}
									onChanged={val => {
										settings.setSetting(
											"backup_retain",
											val
										);
									}}
									disabled={!this.canEdit}
									type="number"
								/>

								<TextField
									value={settings.getSetting(
										"backup_accessToken"
									)}
									label={lang("Dropbox access token")}
									onChanged={val => {
										settings.setSetting(
											"backup_accessToken",
											val
										);
									}}
									disabled={!this.canEdit}
								/>

								{settings.dropboxBackups.length ? (
									<table className="ms-table">
										<thead>
											<tr>
												<th>{lang("Backup")}</th>
												<th>{lang("Actions")}</th>
											</tr>
										</thead>
										<tbody>
											{settings.dropboxBackups.map(
												file => {
													const date = new Date(
														file.client_modified
													);
													const fileName = file.path_lower.replace(
														/[^0-9]/gim,
														""
													);
													return (
														<tr key={file.id}>
															<td>
																<ProfileSquared
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
																	text={unifiedDateFormat(
																		date
																	)}
																	subText={`${Math.round(
																		file.size /
																			1000
																	)} KB`}
																/>
															</td>
															<td>
																<IconButton
																	style={{
																		background:
																			"#f3f3f3",
																		marginRight: 6
																	}}
																	iconProps={{
																		iconName:
																			"delete"
																	}}
																	disabled={
																		!this
																			.canEdit
																	}
																	onClick={() => {
																		backup
																			.deleteOld(
																				settings.getSetting(
																					"backup_accessToken"
																				),
																				fileName
																			)
																			.then(
																				() => {
																					const arr: string[] = JSON.parse(
																						settings.getSetting(
																							"backup_arr"
																						) ||
																							"[]"
																					);
																					const i = arr.findIndex(
																						x =>
																							x ===
																							fileName
																					);
																					arr.splice(
																						i,
																						1
																					);
																					settings.setSetting(
																						"backup_arr",
																						JSON.stringify(
																							arr
																						)
																					);
																					settings.updateDropboxFilesList();
																				}
																			);
																	}}
																/>
																<IconButton
																	style={{
																		background:
																			"#f3f3f3",
																		marginRight: 6
																	}}
																	iconProps={{
																		iconName:
																			"ReleaseGateError"
																	}}
																	disabled={
																		!this
																			.canEdit
																	}
																	onClick={() =>
																		restore.fromDropbox(
																			settings.getSetting(
																				"backup_accessToken"
																			),
																			file.path_lower
																		)
																	}
																/>
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

								<br />
							</div>
						</div>
					) : (
						<div>
							<br />
							<MessageBar messageBarType={MessageBarType.warning}>
								{lang(
									"Backup and restore functionality are not available while you're offline."
								)}
							</MessageBar>
						</div>
					)
				) : (
					""
				)}
			</div>
		);
	}
}
