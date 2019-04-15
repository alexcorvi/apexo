import {
	Col,
	fileTypes,
	GridTableComponent,
	PickAndUploadComponent,
	Row,
	SectionComponent
	} from "@common-components";
import {
	files,
	modals,
	ORTHO_RECORDS_DIR,
	status,
	text,
	user
	} from "@core";
import { OrthoCase, Photo, setting, Visit } from "@modules";
import { day, formatDate, num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { diff } from "fast-array-diff";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import {
	CommandBar,
	DefaultButton,
	DetailsList,
	Dialog,
	Dropdown,
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	SelectionMode,
	TextField,
	Toggle,
	TooltipHost
	} from "office-ui-fabric-react";
import * as React from "react";

const viewsTerms = [
	"Frontal",
	"Right Buccal",
	"Left Buccal",
	"Palatal",
	"Lingual"
];

@observer
export class OrthoRecordsPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@observable selectedPhotoId: string = "";
	@observable zoomedColumn: number = -1;

	@observable expandedField: string = "";

	@observable uploadingPhotoID: string = "";

	@observable imagesTable: { [key: string]: string } = {};

	@observable showGrid: boolean = false;

	@observable overlayWithPrev: boolean = false;
	@observable overlayWithNext: boolean = false;

	@observable openCallouts: string[] = [];

	@computed get canEdit() {
		return user.currentUser.canEditOrtho;
	}

	@computed get dates() {
		if (!this.props.orthoCase.patient) {
			return [];
		}
		return this.props.orthoCase.patient.appointments
			.map(appointment => ({
				date: appointment.date,
				treatmentType: (appointment.treatment || { type: "" }).type
			}))
			.sort((a, b) => b.date - a.date);
	}

	@computed get allImages() {
		return this.props.orthoCase.visits.reduce((all: string[], visit) => {
			visit.photos
				.map(x => x.photoID)
				.forEach(path => {
					if (path) {
						all.push(path);
					}
				});
			return all;
		}, []);
	}

	stopObservation: () => void = function() {};

	componentDidMount() {
		this.allImages.forEach(async path => {
			await this.addImage(path);
		});
		this.stopObservation = this.observe();
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async addImage(path: string) {
		this.imagesTable[path] = "";
		const uri = await files.get(path);
		this.imagesTable[path] = uri;
		return;
	}

	async removeImage(path: string) {
		await files.remove(path);
		delete this.imagesTable[path];
		return;
	}

	observe() {
		return observe(this.props.orthoCase, change => {
			if (change.name === "visits") {
				const diffResult = diff(
					Object.keys(this.imagesTable).sort(),
					this.allImages.sort()
				);
				diffResult.added.forEach(path => {
					this.addImage(path);
				});
				diffResult.removed.forEach(path => {
					this.removeImage(path);
				});
			}
		});
	}

	render() {
		return (
			<div className="ortho-records">
				<SectionComponent title={text(`Problems`)}>
					{this.props.orthoCase.computedProblems.length === 0 &&
					this.props.orthoCase.problemsList.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"This patient does not seem to have any problems or concerns, have you filled the case sheet?"
							)}
						</MessageBar>
					) : (
						<DetailsList
							compact
							items={[
								...[
									...this.props.orthoCase.computedProblems,
									...this.props.orthoCase.problemsList.map(
										x => text("Patient concern") + ": " + x
									)
								].map((x, i) => [`${i + 1}. ${x}`])
							]}
							isHeaderVisible={false}
							selectionMode={SelectionMode.none}
						/>
					)}
				</SectionComponent>
				<SectionComponent title={text(`Treatment Plan`)}>
					{this.props.orthoCase.treatmentPlan_appliance.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"A treatment plan must be before starting the treatment"
							)}
						</MessageBar>
					)}
					<EditableListComponent
						label={text(`Add Plan`)}
						value={this.props.orthoCase.treatmentPlan_appliance}
						onChange={val => {
							this.props.orthoCase.treatmentPlan_appliance = val;
							this.tu();
						}}
						disabled={!this.canEdit}
					/>
				</SectionComponent>
				<SectionComponent title={text(`Started/Finished`)}>
					<Row gutter={12}>
						<Col span={12}>
							<Toggle
								onText={text("Started")}
								offText={text("Not started yet")}
								checked={this.props.orthoCase.isStarted}
								onChange={(ev, val) =>
									(this.props.orthoCase.isStarted = val!)
								}
								disabled={!this.canEdit}
							/>
							{this.props.orthoCase.isStarted ? (
								<Dropdown
									selectedKey={this.props.orthoCase.startedDate.toString()}
									options={this.dates.map(date => {
										return {
											key: date.date.toString(),
											text: `${formatDate(
												date.date,
												setting.getSetting(
													"date_format"
												)
											)} ${
												date.treatmentType
													? `, ${date.treatmentType}`
													: ""
											}`
										};
									})}
									disabled={!this.canEdit}
									onChange={(ev, newValue) => {
										this.props.orthoCase.startedDate = num(
											newValue!.key
										);
									}}
								/>
							) : (
								""
							)}
						</Col>{" "}
						<Col span={12}>
							<Toggle
								onText={text("Finished")}
								offText={text("Not finished yet")}
								checked={this.props.orthoCase.isFinished}
								onChange={(ev, val) =>
									(this.props.orthoCase.isFinished = val!)
								}
								disabled={!this.canEdit}
							/>
							{this.props.orthoCase.isFinished ? (
								<Dropdown
									selectedKey={this.props.orthoCase.finishedDate.toString()}
									options={this.dates.map(date => {
										return {
											key: date.date.toString(),
											text: `${formatDate(
												date.date,
												setting.getSetting(
													"date_format"
												)
											)} ${
												date.treatmentType
													? `, ${date.treatmentType}`
													: ""
											}`
										};
									})}
									disabled={!this.canEdit}
									onChange={(ev, newValue) => {
										this.props.orthoCase.finishedDate = num(
											newValue!.key
										);
									}}
								/>
							) : (
								""
							)}
						</Col>
					</Row>
				</SectionComponent>
				<SectionComponent title={text(`Records`)}>
					{status.online ? (
						status.dropboxActive ? (
							<div className="album">
								{this.props.orthoCase.visits.length ? (
									<table>
										<tbody>
											<tr>
												<td />
												{viewsTerms.map(
													(term, index) => {
														if (
															this
																.zoomedColumn !==
																-1 &&
															this
																.zoomedColumn !==
																index
														) {
															return undefined;
														} else {
															return (
																<td key={term}>
																	{this
																		.zoomedColumn ===
																	index ? (
																		<p className="column-header">
																			{
																				viewsTerms[
																					index
																				]
																			}
																		</p>
																	) : (
																		<p className="term-initials">
																			{viewsTerms[
																				index
																			]
																				.split(
																					" "
																				)
																				.map(
																					x =>
																						x.charAt(
																							0
																						)
																				)
																				.join(
																					""
																				)}
																		</p>
																	)}
																	<br />

																	<TooltipHost
																		content={text(
																			"Zoom"
																		)}
																	>
																		<IconButton
																			iconProps={{
																				iconName:
																					this
																						.zoomedColumn ===
																					index
																						? "ZoomOut"
																						: "ZoomIn"
																			}}
																			className="clickable-icon"
																			onClick={() => {
																				if (
																					this
																						.zoomedColumn ===
																					index
																				) {
																					this.zoomedColumn = -1;
																					return;
																				}
																				this.zoomedColumn = index;
																			}}
																		/>
																	</TooltipHost>
																	{this
																		.zoomedColumn ===
																	index ? (
																		<TooltipHost
																			content={text(
																				"View grid"
																			)}
																		>
																			<IconButton
																				iconProps={{
																					iconName:
																						"gridViewSmall"
																				}}
																				className="clickable-icon"
																				onClick={() => {
																					this.showGrid = !this
																						.showGrid;
																				}}
																			/>
																		</TooltipHost>
																	) : (
																		""
																	)}
																</td>
															);
														}
													}
												)}
												<td />
											</tr>
											{this.props.orthoCase.visits
												.slice()
												.sort(
													(a, b) =>
														a.visitNumber -
														b.visitNumber
												)
												.map(
													(
														visit,
														visitIndex,
														sortedVisits
													) => {
														const prevVisit =
															sortedVisits[
																visitIndex - 1
															] || new Visit();
														const nextVisit =
															sortedVisits[
																visitIndex + 1
															] || new Visit();
														return [
															<tr key={visit.id}>
																<td>
																	<TooltipHost
																		content={`#${
																			visit.visitNumber
																		}, ${formatDate(
																			visit.date,
																			setting.getSetting(
																				"date_format"
																			)
																		)}`}
																	>
																		<IconButton
																			id={visit.id.replace(
																				/[0-9]/g,
																				""
																			)}
																			iconProps={{
																				iconName:
																					"info"
																			}}
																			onClick={() => {
																				this.openCallouts.push(
																					visit.id
																				);
																			}}
																		/>
																	</TooltipHost>
																	<Dialog
																		onDismiss={() => {
																			this.openCallouts = this.openCallouts.filter(
																				x =>
																					x !==
																					visit.id
																			);
																		}}
																		hidden={
																			this.openCallouts.indexOf(
																				visit.id
																			) ===
																			-1
																		}
																		className="visit-dialog"
																	>
																		<DetailsList
																			compact
																			items={[
																				[
																					<div id="gf-visit">
																						{this
																							.expandedField ===
																						"gf-visit" ? (
																							<TextField
																								autoFocus
																								type="number"
																								label={text(
																									`Visit number`
																								)}
																								value={visit.visitNumber.toString()}
																								onBlur={() => {
																									this.expandedField =
																										"";
																								}}
																								disabled={
																									!this
																										.canEdit
																								}
																								onChange={(
																									ev,
																									val
																								) => {
																									this.props.orthoCase.visits[
																										visitIndex
																									].visitNumber = num(
																										val!
																									);
																									this.tu();
																								}}
																							/>
																						) : (
																							`${text(
																								"Visit"
																							)} #${
																								visit.visitNumber
																							}`
																						)}
																					</div>
																				],
																				[
																					<div id="gf-date">
																						{this
																							.expandedField ===
																						"gf-date" ? (
																							<Dropdown
																								label={text(
																									`Visit date`
																								)}
																								selectedKey={visit.date.toString()}
																								disabled={
																									!this
																										.canEdit
																								}
																								options={this.dates.map(
																									date => {
																										return {
																											key: date.date.toString(),
																											text: `${formatDate(
																												date.date,
																												setting.getSetting(
																													"date_format"
																												)
																											)} ${
																												date.treatmentType
																													? `, ${
																															date.treatmentType
																													  }`
																													: ""
																											}`
																										};
																									}
																								)}
																								onChange={(
																									ev,
																									newValue
																								) => {
																									this.props.orthoCase.visits[
																										visitIndex
																									].date = num(
																										newValue!
																											.key
																									);
																									this.tu();
																								}}
																							/>
																						) : (
																							`${text(
																								"Date"
																							)}: ${formatDate(
																								visit.date,
																								setting.getSetting(
																									"date_format"
																								)
																							)}`
																						)}
																					</div>
																				],
																				[
																					<div id="gf-appliance">
																						{this
																							.expandedField ===
																						"gf-appliance" ? (
																							<TextField
																								autoFocus
																								label={text(
																									`Appliance`
																								)}
																								disabled={
																									!this
																										.canEdit
																								}
																								value={
																									visit.appliance
																								}
																								onBlur={() => {
																									this.expandedField =
																										"";
																								}}
																								multiline
																								onChange={(
																									ev,
																									val
																								) => {
																									this.props.orthoCase.visits[
																										visitIndex
																									].appliance = val!;
																									this.tu();
																								}}
																							/>
																						) : (
																							`${text(
																								"Appliance"
																							)}: ${
																								visit.appliance
																									? visit.appliance
																									: text(
																											"No appliance info"
																									  )
																							}`
																						)}
																					</div>
																				]
																			]}
																			isHeaderVisible={
																				false
																			}
																			selectionMode={
																				SelectionMode.none
																			}
																			onActiveItemChanged={row => {
																				this.expandedField =
																					row[0].props.id;
																			}}
																		/>
																	</Dialog>
																</td>
																{viewsTerms.map(
																	(
																		term,
																		photoIndex
																	) => {
																		const photo =
																			visit
																				.photos[
																				photoIndex
																			];
																		if (
																			this
																				.zoomedColumn !==
																				-1 &&
																			this
																				.zoomedColumn !==
																				photoIndex
																		) {
																			return undefined;
																		}
																		return (
																			<td
																				key={
																					term
																				}
																			>
																				{this
																					.showGrid &&
																				this
																					.zoomedColumn ===
																					photoIndex &&
																				this
																					.imagesTable[
																					photo
																						.photoID
																				] ? (
																					<GridTableComponent />
																				) : (
																					""
																				)}
																				{photo.photoID ? (
																					this
																						.imagesTable[
																						photo
																							.photoID
																					] ? (
																						<div
																							key={
																								visit.id
																							}
																							className="photo"
																							onClick={() => {
																								this.selectedPhotoId =
																									photo.id;
																							}}
																						>
																							<Icon
																								iconName="MiniExpandMirrored"
																								className="hover-effect"
																							/>
																							<img
																								style={{
																									width:
																										"100%"
																								}}
																								src={
																									this
																										.imagesTable[
																										photo
																											.photoID
																									]
																								}
																								className="ortho-img-el"
																							/>
																							{this
																								.selectedPhotoId ===
																							photo.id ? (
																								<Dialog
																									modalProps={{
																										className:
																											"photo-dialog"
																									}}
																									hidden={
																										false
																									}
																									onDismiss={() =>
																										(this.selectedPhotoId =
																											"")
																									}
																								>
																									<div
																										style={{
																											position:
																												"relative"
																										}}
																									>
																										<img
																											style={{
																												width:
																													"100%"
																											}}
																											src={
																												this
																													.imagesTable[
																													photo
																														.photoID
																												]
																											}
																										/>
																										{this
																											.overlayWithNext ? (
																											<img
																												className="overlay-img"
																												src={
																													this
																														.imagesTable[
																														nextVisit
																															.photos[
																															photoIndex
																														]
																															.photoID
																													]
																												}
																											/>
																										) : (
																											""
																										)}
																										{this
																											.overlayWithPrev ? (
																											<img
																												className="overlay-img"
																												src={
																													this
																														.imagesTable[
																														prevVisit
																															.photos[
																															photoIndex
																														]
																															.photoID
																													]
																												}
																											/>
																										) : (
																											""
																										)}
																									</div>

																									<DetailsList
																										compact
																										items={[
																											[
																												<div id="gf-visit">
																													{this
																														.expandedField ===
																													"gf-visit" ? (
																														<TextField
																															autoFocus
																															disabled={
																																!this
																																	.canEdit
																															}
																															type="number"
																															label={text(
																																`Visit number`
																															)}
																															value={visit.visitNumber.toString()}
																															onBlur={() => {
																																this.expandedField =
																																	"";
																															}}
																															onChange={(
																																ev,
																																val
																															) => {
																																this.props.orthoCase.visits[
																																	visitIndex
																																].visitNumber = num(
																																	val!
																																);
																																this.tu();
																															}}
																														/>
																													) : (
																														`${text(
																															"Visit"
																														)} #${
																															visit.visitNumber
																														}`
																													)}
																												</div>
																											],
																											[
																												<div id="gf-date">
																													{this
																														.expandedField ===
																													"gf-date" ? (
																														<Dropdown
																															label={text(
																																`Visit date`
																															)}
																															disabled={
																																!this
																																	.canEdit
																															}
																															selectedKey={visit.date.toString()}
																															options={this.dates.map(
																																date => {
																																	return {
																																		key: date.date.toString(),
																																		text: `${formatDate(
																																			date.date,
																																			setting.getSetting(
																																				"date_format"
																																			)
																																		)} ${
																																			date.treatmentType
																																				? `, ${
																																						date.treatmentType
																																				  }`
																																				: ""
																																		}`
																																	};
																																}
																															)}
																															onChange={(
																																ev,
																																newValue
																															) => {
																																this.props.orthoCase.visits[
																																	visitIndex
																																].date = num(
																																	newValue!
																																		.key
																																);
																																this.tu();
																															}}
																														/>
																													) : (
																														`${text(
																															"Date"
																														)}: ${formatDate(
																															visit.date,
																															setting.getSetting(
																																"date_format"
																															)
																														)}`
																													)}
																												</div>
																											],
																											[
																												<div id="gf-appliance">
																													{this
																														.expandedField ===
																													"gf-appliance" ? (
																														<TextField
																															autoFocus
																															label={text(
																																`Appliance`
																															)}
																															value={
																																visit.appliance
																															}
																															disabled={
																																!this
																																	.canEdit
																															}
																															onBlur={() => {
																																this.expandedField =
																																	"";
																															}}
																															multiline
																															onChange={(
																																ev,
																																val
																															) => {
																																this.props.orthoCase.visits[
																																	visitIndex
																																].appliance = val!;
																																this.tu();
																															}}
																														/>
																													) : (
																														`${text(
																															"Appliance"
																														)}: ${
																															visit.appliance
																																? visit.appliance
																																: text(
																																		"No appliance info"
																																  )
																														}`
																													)}
																												</div>
																											],
																											[
																												<div id="gf-comment">
																													{this
																														.expandedField ===
																													"gf-comment" ? (
																														<TextField
																															autoFocus
																															label={text(
																																`Comment`
																															)}
																															disabled={
																																!this
																																	.canEdit
																															}
																															value={
																																photo.comment
																															}
																															onBlur={() => {
																																this.expandedField =
																																	"";
																															}}
																															multiline
																															onChange={(
																																ev,
																																val
																															) => {
																																this.props.orthoCase.visits[
																																	visitIndex
																																].photos[
																																	photoIndex
																																].comment = val!;
																																this.tu();
																															}}
																														/>
																													) : (
																														`${text(
																															"Comment"
																														)}: ${
																															photo.comment
																																? photo.comment
																																: text(
																																		"no comment on this photo"
																																  )
																														}`
																													)}
																												</div>
																											]
																										]}
																										isHeaderVisible={
																											false
																										}
																										selectionMode={
																											SelectionMode.none
																										}
																										onActiveItemChanged={row => {
																											this.expandedField =
																												row[0].props.id;
																										}}
																									/>
																									<CommandBar
																										items={[
																											{
																												key:
																													"overlay prev",
																												text: text(
																													"Overlay prev"
																												),
																												iconProps: {
																													iconName:
																														"MapLayers"
																												},
																												className: this
																													.overlayWithPrev
																													? "active-button"
																													: undefined,
																												onClick: () => {
																													this.overlayWithPrev = !this
																														.overlayWithPrev;
																												},
																												hidden: !this
																													.imagesTable[
																													prevVisit
																														.photos[
																														photoIndex
																													]
																														.photoID
																												]
																											},
																											{
																												key:
																													"overlay next",
																												text: text(
																													"Overlay next"
																												),
																												iconProps: {
																													iconName:
																														"MapLayers"
																												},
																												className: this
																													.overlayWithNext
																													? "active-button"
																													: undefined,
																												onClick: () => {
																													this.overlayWithNext = !this
																														.overlayWithNext;
																												},
																												hidden: !this
																													.imagesTable[
																													nextVisit
																														.photos[
																														photoIndex
																													]
																														.photoID
																												]
																											}
																										]}
																										farItems={[
																											{
																												key:
																													"delete photo",
																												text: text(
																													"Delete"
																												),
																												iconProps: {
																													iconName:
																														"trash"
																												},
																												disabled: !this
																													.canEdit,
																												onClick: () => {
																													this.props.orthoCase.visits[
																														visitIndex
																													].photos[
																														photoIndex
																													] = new Photo();
																													this.selectedPhotoId =
																														"";
																													this.tu();
																												}
																											}
																										]}
																									/>
																								</Dialog>
																							) : (
																								""
																							)}
																						</div>
																					) : (
																						<Icon
																							iconName="sync"
																							className="rotate"
																						/>
																					)
																				) : (
																					<PickAndUploadComponent
																						{...{
																							crop: true,
																							allowMultiple: false,
																							accept:
																								fileTypes.image,
																							prevSrc: this
																								.imagesTable[
																								prevVisit
																									.photos[
																									photoIndex
																								]
																									.photoID
																							],
																							disabled: !this
																								.canEdit,
																							onFinish: e => {
																								if (
																									e[0]
																								) {
																									this.props.orthoCase.visits[
																										visitIndex
																									].photos[
																										photoIndex
																									].photoID =
																										e[0];
																									this.tu();
																								}
																							},
																							onStartLoading: () => {
																								this.uploadingPhotoID =
																									photo.id;
																							},
																							onFinishLoading: () => {
																								this.uploadingPhotoID =
																									"";
																							},
																							targetDir: `${ORTHO_RECORDS_DIR}/${
																								this
																									.props
																									.orthoCase
																									._id
																							}`
																						}}
																					>
																						<TooltipHost
																							content={text(
																								"Add photo"
																							)}
																						>
																							<IconButton
																								iconProps={{
																									iconName:
																										"Photo2Add"
																								}}
																								className="clickable-icon add-photo"
																								disabled={
																									!this
																										.canEdit
																								}
																							/>
																						</TooltipHost>
																					</PickAndUploadComponent>
																				)}
																			</td>
																		);
																	}
																)}
																<td>
																	<TooltipHost
																		content={text(
																			"Delete visit"
																		)}
																	>
																		<IconButton
																			className="clickable-icon delete-visit"
																			key={
																				visit.id
																			}
																			disabled={
																				!this
																					.canEdit
																			}
																			iconProps={{
																				iconName:
																					"DeleteRows"
																			}}
																			onClick={() => {
																				modals.newModal(
																					{
																						message: text(
																							"This visit data will be deleted along with all photos and notes"
																						),
																						onConfirm: () => {
																							this.props.orthoCase.visits.splice(
																								visitIndex,
																								1
																							);
																							this.tu();
																						},
																						showCancelButton: true,
																						showConfirmButton: true,
																						id: Math.random()
																					}
																				);
																			}}
																		/>
																	</TooltipHost>
																</td>
															</tr>,
															<tr
																key={
																	visit.id +
																	"days"
																}
															>
																<td colSpan={7}>
																	{sortedVisits[
																		visitIndex +
																			1
																	] ? (
																		<i className="days-num">
																			{Math.round(
																				(nextVisit.date -
																					visit.date) /
																					day
																			)}{" "}
																			{text(
																				"days"
																			)}
																		</i>
																	) : (
																		""
																	)}
																</td>
															</tr>
														];
													}
												)}
										</tbody>
									</table>
								) : (
									<MessageBar
										messageBarType={MessageBarType.info}
									>
										{text(
											"No visits recorded yet! add a new visit using the button below"
										)}
									</MessageBar>
								)}
								<br />
								<DefaultButton
									disabled={!this.canEdit}
									iconProps={{ iconName: "ExploreContent" }}
									text={text("Add visit")}
									onClick={() => {
										const visitNumber = this.props.orthoCase
											.visits.length
											? this.props.orthoCase.visits
													.slice()
													.sort(
														(a, b) =>
															b.visitNumber -
															a.visitNumber
													)[0].visitNumber + 1
											: 1;
										this.props.orthoCase.visits.push(
											new Visit(undefined, visitNumber)
										);
										this.tu();
									}}
								/>
							</div>
						) : (
							<MessageBar messageBarType={MessageBarType.warning}>
								{text(
									"A valid DropBox access token is required for this section"
								)}
							</MessageBar>
						)
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"You can not access orthodontic records while offline"
							)}
						</MessageBar>
					)}
				</SectionComponent>
				<SectionComponent title={text(`Notes for the next visit`)}>
					<EditableListComponent
						label={text(`Add note`)}
						value={this.props.orthoCase.nextVisitNotes}
						onChange={val => {
							this.props.orthoCase.nextVisitNotes = val;
							this.tu();
						}}
						disabled={!this.canEdit}
					/>
				</SectionComponent>
			</div>
		);
	}
	tu() {
		this.props.orthoCase.triggerUpdate++;
	}
}
