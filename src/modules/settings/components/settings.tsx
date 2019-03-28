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
import { unifiedDateFormat, second } from "../../../assets/utils/date";
import { Section } from "../../../assets/components/section/section";

@observer
export class SettingsComponent extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	@observable inputEl: HTMLInputElement | null = null;

	@computed get canEdit() {
		return API.user.currentUser.canEditSettings;
	}

	@observable loading: boolean = false;

	componentWillMount() {
		setTimeout(() => settings.updateDropboxBackups(), second);
	}

	render() {
		return (
			<div className="settings-component p-15 p-l-10 p-r-10">
				<Section title="General Setting">
					<Input
						element={
							<Dropdown
								label={lang("Language")}
								options={[
									{ key: "en", text: "English" },
									{ key: "ar", text: "العربية" }
								]}
								defaultSelectedKey={settings.getSetting("lang")}
								onChanged={v => {
									settings.setSetting(
										"lang",
										v.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info="Choose the main language of display menus and items"
					/>

					<Input
						element={
							<TextField
								value={settings.getSetting(
									"dropbox_accessToken"
								)}
								label={lang("Dropbox access token")}
								onChanged={val => {
									settings.setSetting(
										"dropbox_accessToken",
										val
									);

									setTimeout(
										() => API.login.validateDropBoxToken(),
										second / 2
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info="This access token is used to store files across the application, like backups and images"
					/>
				</Section>

				<Section title="Financial Settings">
					<Input
						element={
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
						}
						// tslint:disable-next-line:max-line-length
						info="When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses So here you can put the electricity, rent, and other time dependent expenses"
					/>

					<Input
						element={
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
						}
						info="This symbol you enter here will be used across your application"
					/>
				</Section>

				<Section title="Optional Modules and Features">
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
				</Section>

				<Section title="Backup and Restore">
					{API.login.online ? (
						<div>
							<PrimaryButton
								onClick={() => {
									compact.compact();
								}}
								iconProps={{ iconName: "ZipFolder" }}
							>
								{lang("Run compaction")}
							</PrimaryButton>

							<PrimaryButton
								onClick={() => {
									downloadCurrent();
								}}
								style={{ marginLeft: 10 }}
								iconProps={{ iconName: "Database" }}
							>
								{lang("Download a backup")}
							</PrimaryButton>

							<PrimaryButton
								onClick={() =>
									this.inputEl ? this.inputEl.click() : ""
								}
								style={{ marginLeft: 10 }}
								iconProps={{ iconName: "DatabaseSync" }}
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
						</div>
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{lang(
								"Backup and restore functionality are not available while you're offline."
							)}
						</MessageBar>
					)}
				</Section>

				<Section title="Automated Backup and Restore">
					{API.login.online ? (
						API.login.dropboxActive ? (
							<div>
								<Dropdown
									label={lang("Backup frequency")}
									options={[
										{ key: "d", text: lang("Daily") },
										{ key: "w", text: lang("Weekly") },
										{ key: "m", text: lang("Monthly") },
										{ key: "n", text: lang("Never") }
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
																					settings.updateDropboxBackups();
																				}
																			)
																			.catch(
																				() => {
																					this.loading = false;
																					settings.updateDropboxBackups();
																				}
																			);
																	}}
																/>
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
							{lang(
								"Backup and restore functionality are not available while you're offline."
							)}
						</MessageBar>
					)}
				</Section>
			</div>
		);
	}
}
@observer
export class Input extends React.Component<{
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
