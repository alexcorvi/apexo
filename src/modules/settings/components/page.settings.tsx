import * as core from "@core";
import { text } from "@core";
import * as modules from "@modules";
import { dateNames, day, formatDate, generateID, second } from "@utils";
import { saveAs } from "file-saver";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	Col,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
} from "@common-components";
import {
	DefaultButton,
	Dropdown,
	Icon,
	MessageBar,
	MessageBarType,
	TextField,
	Toggle,
	Link,
} from "office-ui-fabric-react";

@observer
export class SettingsPage extends React.Component {
	unlockCombinations = [
		[5, 4, 9],
		[3, 2, 5],
		[6, 1, 7],
		[2, 6, 8],
		[5, 1, 6],
		[4, 1, 5],
	];

	chosenCombination = this.unlockCombinations[Math.floor(Math.random() * 6)];

	@observable inputEl: HTMLInputElement | null = null;

	@computed get canEdit() {
		return core.user.currentUser!.canEditSettings;
	}

	@observable inProgress: boolean = false;

	@observable locked: boolean = true;

	@observable key: string = Math.random().toString();

	componentDidMount() {
		setTimeout(() => modules.setting!.updateAutoBackups(), second);
	}

	render() {
		return (
			<div className="settings-component container-fluid">
				{this.locked ? (
					<div className="lock-msg">
						<div className="lock-icon">
							<Icon iconName="lock"></Icon>
						</div>

						<div className="lock-header">
							<h2>{text("settings are locked").c}</h2>
							<p>
								{
									text(
										"to prevent unintentional changes, solve the mathematical equation to unlock"
									).c
								}
							</p>
						</div>

						<hr />
						<div className="math-question">
							{<span id="cc-1">{this.chosenCombination[0]}</span>}{" "}
							+{" "}
							{<span id="cc-2">{this.chosenCombination[1]}</span>}{" "}
							={" "}
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
						<Row gutter={8}>
							<Col md={15}>
								<SectionComponent
									title={text(`general setting`).h}
								>
									<SettingInputComponent
										element={
											<Dropdown
												label={text("language").c}
												options={core.translate.languages.map(
													(x) => ({
														key: x.code,
														text: x.localName,
													})
												)}
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
										info={
											text(
												`choose the main language of display menus and items`
											).c
										}
									/>

									<SettingInputComponent
										element={
											<Dropdown
												label={text("date format").c}
												options={[
													{
														key: "dd/mm/yyyy",
														text: "dd/mm/yyyy",
													},
													{
														key: "mm/dd/yyyy",
														text: "mm/dd/yyyy",
													},
													{
														key: "dd MM 'YY",
														text: "dd MM 'YY",
													},
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
										info={
											text(
												`set the date format to be used across this application`
											).c
										}
									/>

									<SettingInputComponent
										element={
											<Dropdown
												label={text("week ends on").c}
												options={dateNames
													.days()
													.map((dayName, index) => ({
														key: index.toString(),
														text: text(
															dayName.toLowerCase() as any
														).c,
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
										info={
											text(`on which day the week ends`).c
										}
									/>

									{core.status.version === "community" ? (
										<SettingInputComponent
											element={
												<TextField
													value={modules.setting!.getSetting(
														"dropbox_accessToken"
													)}
													label={
														text(
															"dropbox access token"
														).c
													}
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
											info={
												text(
													`this access token is used to store files across the application, like backups and images`
												).c
											}
										/>
									) : (
										""
									)}
								</SectionComponent>
								<SectionComponent
									title={text(`financial settings`).h}
								>
									{modules.setting!.getSetting(
										"time_tracking"
									) ? (
										<SettingInputComponent
											element={
												<TextField
													label={
														text(
															"time expenses (per hour)"
														).c
													}
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
											info={
												text(
													// tslint:disable-next-line:max-line-length
													`when time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses so here you can put the electricity, rent, and other time dependent expenses`
												).c
											}
										/>
									) : (
										""
									)}

									<SettingInputComponent
										element={
											<TextField
												label={
													text("currency symbol").c
												}
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
										info={
											text(
												`this symbol you enter here will be used across your application`
											).c
										}
									/>
								</SectionComponent>
								<SectionComponent
									title={
										text(`optional modules and features`).h
									}
								>
									<Toggle
										data-testid="prescriptions-toggle"
										onText={
											text("prescriptions module enabled")
												.c
										}
										offText={
											text(
												"prescriptions module disabled"
											).c
										}
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
										onText={
											text("orthodontic module enabled").c
										}
										offText={
											text("orthodontic module disabled")
												.c
										}
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
										onText={
											text("labwork module enabled").c
										}
										offText={
											text("labwork module disabled").c
										}
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
										onText={
											text("statistics module enabled").c
										}
										offText={
											text("statistics module disabled").c
										}
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
										onText={text("time tracking enabled").c}
										offText={
											text("time tracking disabled").c
										}
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
							</Col>
							<Col md={9} className="backups">
								<SectionComponent
									title={text("restore from file").h}
								>
									{core.status.isOnline.files &&
									core.status.version !== "offline" ? (
										<div>
											<DefaultButton
												onClick={() =>
													this.inputEl
														? this.inputEl.click()
														: ""
												}
												disabled={
													this.inProgress ||
													!this.canEdit
												}
												className="m-l-5 m-t-5"
												iconProps={{
													iconName: "DatabaseSync",
												}}
												text={
													text("restore from file").c
												}
											/>

											<input
												ref={(el) =>
													(this.inputEl = el)
												}
												hidden
												type="file"
												multiple={false}
												key={this.key}
												onChange={async (e) => {
													if (
														e.target.files &&
														e.target.files.length >
															0
													) {
														core.restore.fromFile(
															e.target.files[0]
														);
														this.key = Math.random().toString();
													}
												}}
											/>

											<MessageBar
												style={{ marginTop: 22 }}
												messageBarType={
													MessageBarType.info
												}
											>
												{
													text(
														"you can download a backup from below and use this button to restore it"
													).c
												}
											</MessageBar>
										</div>
									) : (
										<MessageBar
											messageBarType={
												MessageBarType.warning
											}
										>
											{
												text(
													"backup and restore functionality are not available while you're offline"
												).c
											}
										</MessageBar>
									)}
								</SectionComponent>
								<SectionComponent
									title={text("automated backups").h}
								>
									{core.status.isOnline.files &&
									core.status.version !== "offline" ? (
										modules.setting!.autoBackups.length ? (
											modules
												.setting!.autoBackups.slice()
												.reverse()
												.map((backup) => {
													const now = new Date().getTime();
													const then = new Date(
														(
															backup || {
																date: 0,
															}
														).date
													).getTime();
													const diffInDays = Math.floor(
														(now - then) / day
													);
													return (
														<div key={backup.path}>
															<ProfileSquaredComponent
																size={4}
																onRenderInitials={() => (
																	<div>
																		{
																			diffInDays
																		}
																	</div>
																)}
																onRenderSecondaryText={() => (
																	<div>
																		<div>
																			{formatDate(
																				backup.date,
																				modules.setting!.getSetting(
																					"date_format"
																				)
																			)}
																		</div>
																		<span>
																			<Link
																				disabled={
																					this
																						.inProgress ||
																					!this
																						.canEdit
																				}
																				onClick={async () => {
																					const file = await core
																						.files()
																						.get(
																							backup.path
																						);
																					saveAs(
																						file.startsWith(
																							"http"
																						)
																							? file
																							: new Blob(
																									[
																										file,
																									],
																									{
																										type:
																											"text/plain;charset=utf-8",
																									}
																							  ),
																						`apexo-backup-${formatDate(
																							backup.date,
																							modules.setting!.getSetting(
																								"date_format"
																							)
																						).replace(
																							/\W/g,
																							"-"
																						)}.${
																							core.backupsExtension
																						}`
																					);
																				}}
																			>
																				<Icon iconName="download"></Icon>
																				{
																					text(
																						"download"
																					)
																						.c
																				}
																			</Link>
																			{diffInDays ? (
																				<Link
																					disabled={
																						this
																							.inProgress ||
																						!this
																							.canEdit
																					}
																					onClick={async () => {
																						this.inProgress = true;
																						try {
																							await core.backup.deleteFromFilesServer(
																								backup.path
																							);
																							await modules.setting!.updateAutoBackups();
																						} catch (e) {}
																						this.inProgress = false;
																					}}
																				>
																					<Icon iconName="trash"></Icon>
																					{
																						text(
																							"delete"
																						)
																							.c
																					}
																				</Link>
																			) : (
																				<Link
																					disabled={
																						this
																							.inProgress ||
																						!this
																							.canEdit
																					}
																					onClick={async () => {
																						this.inProgress = true;
																						try {
																							await core.backup.deleteFromFilesServer(
																								backup.path
																							);
																							await modules.setting!.updateAutoBackups();
																							await core.backup.toFilesServer();
																							await modules.setting!.updateAutoBackups();
																						} catch (e) {}
																						this.inProgress = false;
																					}}
																				>
																					<Icon iconName="sync"></Icon>
																					{
																						text(
																							"renew"
																						)
																							.c
																					}
																				</Link>
																			)}
																		</span>
																	</div>
																)}
																text={
																	diffInDays
																		? diffInDays +
																		  " " +
																		  text(
																				"days ago"
																		  ).c
																		: text(
																				"today"
																		  ).c
																}
															/>
														</div>
													);
												})
										) : (
											<div>
												<DefaultButton
													onClick={async () => {
														this.inProgress = true;
														modules.setting!.automatedBackups();
														this.inProgress = false;
													}}
													disabled={
														this.inProgress ||
														!this.canEdit
													}
													className="m-l-5 m-t-5"
													iconProps={{
														iconName: "Database",
													}}
													text={text("backup").c}
												/>
											</div>
										)
									) : (
										<MessageBar
											messageBarType={
												MessageBarType.warning
											}
										>
											{
												text(
													"backup and restore functionality are not available while you're offline"
												).c
											}
										</MessageBar>
									)}
								</SectionComponent>
							</Col>
						</Row>
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
