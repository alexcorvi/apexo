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
	IconButton
} from "office-ui-fabric-react";
import { settings } from "../data";
import "./settings.scss";
import { API } from "../../../core/index";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { compact } from "../../../core/db/index";

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
				<h3>Financial Settings</h3>
				<hr />
				{!!settings.getSetting("time_tracking") ? (
					<Row gutter={12}>
						<Col md={12}>
							<div className="form">
								<TextField
									label="Time expenses (per hour)"
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
								When time tracking enabled, this is used to
								calculate profits and expenses, as time is also
								added to the expenses. So here you can put the
								electricity, rent, and other time dependent
								expenses.
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
								label="Currency Symbol"
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
							This symbol you enter here will be used across your
							application.
						</p>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col md={12}>
						<div className="form">
							<TextField
								label="Orthograph Dropbox Access Token"
								value={settings.getSetting(
									"dropbox_accessToken"
								)}
								onChanged={newVal => {
									settings.setSetting(
										"dropbox_accessToken",
										newVal.toString()
									);
								}}
								disabled={!this.canEdit}
							/>
						</div>
					</Col>
					<Col md={12}>
						<p className="hint">
							The access token used to save and retrieve
							Orthograph data.
							<br />
							<a href="https://github.com/alexcorvi/orthograph#instructions">
								Learn more
							</a>
						</p>
					</Col>
				</Row>

				<br />
				<br />
				<h3>Optional Modules and features</h3>
				<hr />

				<div className="form">
					<Toggle
						onText="Prescriptions Module Enabled"
						offText="Prescriptions Module Disabled"
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
						onText="Orthodontic Module Enabled"
						offText="Orthodontic Module Disabled"
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
						onText="Statistics Module Enabled"
						offText="Statistics Module Disabled"
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
						onText="Time Tracking Enabled"
						offText="Time Tracking Disabled"
						defaultChecked={!!settings.getSetting("time_tracking")}
						onChanged={val => {
							settings.setSetting(
								"time_tracking",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText="Have staff contact details"
						offText="Don't have staff contact details"
						defaultChecked={
							!!settings.getSetting("ask_for_user_contact")
						}
						onChanged={val => {
							settings.setSetting(
								"ask_for_user_contact",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText="Optional input: patient email"
						offText="Optional input: patient email"
						defaultChecked={!!settings.getSetting("OI_email")}
						onChanged={val => {
							settings.setSetting(
								"OI_email",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>
					<Toggle
						onText="Optional input: patient address"
						offText="Optional input: patient address"
						defaultChecked={!!settings.getSetting("OI_address")}
						onChanged={val => {
							settings.setSetting(
								"OI_address",
								val ? "enable" : ""
							);
						}}
						disabled={!this.canEdit}
					/>

					{settings.getSetting("module_orthodontics") ? (
						<div>
							<Toggle
								onText="Optional input: orthodontic case sheet"
								offText="Optional input: orthodontic case sheet"
								defaultChecked={
									!!settings.getSetting("OI_ortho_sheet")
								}
								onChanged={val => {
									settings.setSetting(
										"OI_ortho_sheet",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>

							<Toggle
								onText="Optional input: orthodontic treatment plan"
								offText="Optional input: orthodontic treatment plan"
								defaultChecked={
									!!settings.getSetting("OI_ortho_Plan")
								}
								onChanged={val => {
									settings.setSetting(
										"OI_ortho_Plan",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>

							<Toggle
								onText="Embedded app: cephalometric analysis"
								offText="Embedded app: cephalometric analysis"
								defaultChecked={
									!!settings.getSetting("OI_cephalometric")
								}
								onChanged={val => {
									settings.setSetting(
										"OI_cephalometric",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>

							<Toggle
								onText="Embedded app: Orthograph"
								offText="Embedded app: Orthograph"
								defaultChecked={
									!!settings.getSetting("OI_orthograph")
								}
								onChanged={val => {
									settings.setSetting(
										"OI_orthograph",
										val ? "enable" : ""
									);
								}}
								disabled={!this.canEdit}
							/>
						</div>
					) : (
						""
					)}
				</div>

				<br />
				<br />
				{this.canEdit ? (
					<div>
						<h3>Backup and restore</h3>
						<hr />

						<p className="hint" style={{ maxWidth: 500 }}>
							Using this section you can download a file
							representing all of your clinic data, use this file
							- later, to restore the same data.
						</p>

						<PrimaryButton
							onClick={() => {
								compact.compact();
							}}
						>
							Run compaction
						</PrimaryButton>

						<PrimaryButton
							onClick={() => {
								downloadCurrent();
							}}
							style={{ marginLeft: 10 }}
						>
							Download a backup
						</PrimaryButton>

						<PrimaryButton
							onClick={() =>
								this.inputEl ? this.inputEl.click() : ""
							}
							style={{ marginLeft: 10 }}
						>
							Restore from file
						</PrimaryButton>
						<input
							ref={el => (this.inputEl = el)}
							hidden
							type="file"
							multiple={false}
							onChange={e => {
								if (
									e.target.files &&
									e.target.files.length > 0
								) {
									restore.fromFile(e.target.files[0]);
								}
							}}
						/>

						<br />
						<br />
						<h3>Automated backup</h3>
						<hr />
						<div style={{ maxWidth: 500 }}>
							<p className="hint" style={{ maxWidth: 500 }}>
								Using automated backups you can set your
								application to automatically backup your data
								and store it in Dropbox. To turn on automated
								backups, enter your app access token. <br />
								<a href="https://docs.apexo.app/docs/automated-backups">
									Learn more
								</a>
							</p>
							<Dropdown
								label="Backup frequency"
								options={[
									{ key: "d", text: "Daily" },
									{ key: "w", text: "Weekly" },
									{ key: "m", text: "Monthly" }
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
							/>

							<TextField
								value={settings.getSetting("backup_retain")}
								label="How many backups to retain"
								onChanged={val => {
									settings.setSetting("backup_retain", val);
								}}
								type="number"
							/>

							<TextField
								value={settings.getSetting(
									"backup_accessToken"
								)}
								label="Dropbox access token"
								onChanged={val => {
									settings.setSetting(
										"backup_accessToken",
										val
									);
								}}
							/>

							{settings.dropboxBackups.length ? (
								<table className="ms-table">
									<thead>
										<tr>
											<th>Backup</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{settings.dropboxBackups.map(file => {
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
															text={date.toDateString()}
															subText={`${Math.round(
																file.size / 1000
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
										})}
									</tbody>
								</table>
							) : (
								""
							)}

							<br />
						</div>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
