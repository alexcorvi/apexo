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
	MessageBarType,
	DefaultButton
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
				<Section title={lang(`General Setting`)}>
					<Input
						element={
							<Dropdown
								label={lang("Language")}
								options={[
									{ key: "en", text: "English" },
									{ key: "ar", text: "العربية" }
								]}
								defaultSelectedKey={settings.getSetting("lang")}
								onChange={(ev, v) => {
									settings.setSetting(
										"lang",
										v!.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={lang(
							`Choose the main language of display menus and items`
						)}
					/>

					<Input
						element={
							<Dropdown
								label={lang("Date format")}
								options={[
									{ key: "dd/mm/yyyy", text: "dd/mm/yyyy" },
									{ key: "mm/dd/yyyy", text: "mm/dd/yyyy" },
									{ key: "dd MM 'YY", text: "dd MM 'YY" }
								]}
								defaultSelectedKey={settings.getSetting(
									"date_format"
								)}
								onChange={(ev, v) => {
									settings.setSetting(
										"date_format",
										v!.key.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={lang(
							`Set the date format to be used across this application`
						)}
					/>

					<Input
						element={
							<TextField
								value={settings.getSetting(
									"dropbox_accessToken"
								)}
								label={lang("Dropbox access token")}
								onChange={(ev, val) => {
									settings.setSetting(
										"dropbox_accessToken",
										val!
									);

									setTimeout(
										() => API.login.validateDropBoxToken(),
										second / 2
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={lang(
							`This access token is used to store files across the application, like backups and images`
						)}
					/>
				</Section>

				<Section title={lang(`Financial Settings`)}>
					<Input
						element={
							<TextField
								label={lang("Time expenses (per hour)")}
								type="number"
								value={settings.getSetting("hourlyRate")}
								onChange={(ev, newVal) => {
									settings.setSetting(
										"hourlyRate",
										newVal!.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={lang(
							// tslint:disable-next-line:max-line-length
							`When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses So here you can put the electricity, rent, and other time dependent expenses`
						)}
					/>

					<Input
						element={
							<TextField
								label={lang("Currency symbol")}
								value={settings.getSetting("currencySymbol")}
								onChange={(ev, newVal) => {
									settings.setSetting(
										"currencySymbol",
										newVal!.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						}
						info={lang(
							`This symbol you enter here will be used across your application`
						)}
					/>
				</Section>

				<Section title={lang(`Optional Modules and Features`)}>
					<Toggle
						onText={lang("Prescriptions module enabled")}
						offText={lang("Prescriptions module disabled")}
						defaultChecked={
							!!settings.getSetting("module_prescriptions")
						}
						onChange={(ev, val) => {
							settings.setSetting(
								"module_prescriptions",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Orthodontic module enabled")}
						offText={lang("Orthodontic module disabled")}
						defaultChecked={
							!!settings.getSetting("module_orthodontics")
						}
						onChange={(ev, val) => {
							settings.setSetting(
								"module_orthodontics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Statistics module enabled")}
						offText={lang("Statistics module disabled")}
						defaultChecked={
							!!settings.getSetting("module_statistics")
						}
						onChange={(ev, val) => {
							settings.setSetting(
								"module_statistics",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText={lang("Time tracking enabled")}
						offText={lang("Time tracking disabled")}
						defaultChecked={!!settings.getSetting("time_tracking")}
						onChange={(ev, val) => {
							settings.setSetting(
								"time_tracking",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
				</Section>

				<Section title={lang(`Backup and Restore`)}>
					{API.login.online ? (
						<div>
							<DefaultButton
								onClick={() => {
									compact.compact();
								}}
								iconProps={{ iconName: "ZipFolder" }}
								className="m-l-5 m-t-5"
								text={lang("Run compaction")}
							/>

							<DefaultButton
								onClick={() => {
									downloadCurrent();
								}}
								className="m-l-5 m-t-5"
								iconProps={{ iconName: "Database" }}
								text={lang("Download a backup")}
							/>

							<DefaultButton
								onClick={() =>
									this.inputEl ? this.inputEl.click() : ""
								}
								className="m-l-5 m-t-5"
								iconProps={{ iconName: "DatabaseSync" }}
								text={lang("Restore from file")}
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
							{lang(
								"Backup and restore functionality are not available while you're offline"
							)}
						</MessageBar>
					)}
				</Section>

				<Section title={lang(`Automated Backup and Restore`)}>
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
									onChange={(ev, v) => {
										settings.setSetting(
											"backup_freq",
											v!.key.toString()
										);
									}}
									disabled={!this.canEdit}
								/>

								<TextField
									value={settings.getSetting("backup_retain")}
									label={lang("How many backups to retain")}
									onChange={(ev, val) => {
										settings.setSetting(
											"backup_retain",
											val!
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
								"Backup and restore functionality are not available while you're offline"
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
