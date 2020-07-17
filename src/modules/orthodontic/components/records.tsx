import * as core from "@core";
import { imagesTable, ORTHO_RECORDS_DIR, status, text } from "@core";
import { OrthoCase, Photo, StaffMember, Visit } from "@modules";
import * as modules from "@modules";
import { day, formatDate, num } from "@utils";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	Col,
	fileTypes,
	GridTableComponent,
	PickAndUploadComponent,
	Row,
	SectionComponent,
} from "@common-components";
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
	Shimmer,
	TextField,
	Toggle,
	TooltipHost,
} from "office-ui-fabric-react";

const EditableListComponent = loadable({
	loading: () => <Shimmer />,
	loader: async () =>
		(await import("common-components/editable-list")).EditableListComponent,
});

const viewsTerms = [
	"Frontal",
	"Right Buccal",
	"Left Buccal",
	"Palatal",
	"Lingual",
];

@observer
export class OrthoRecordsPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@observable selectedPhotoId: string = "";
	@observable zoomedColumn: number = -1;

	@observable expandedField: string = "";

	@observable uploadingPhotoID: string = "";

	@observable showGrid: boolean = false;

	@observable overlayWithPrev: boolean = false;
	@observable overlayWithNext: boolean = false;

	@observable openCallouts: string[] = [];

	@computed get canEdit() {
		return core.user.currentUser!.canEditOrtho;
	}

	@computed get patientAppointments() {
		if (!this.props.orthoCase.patient) {
			return [];
		}
		return this.props.orthoCase.patient.appointments
			.map((appointment) => ({
				date: appointment.date,
				treatmentType: (appointment.treatment || { type: "" }).type,
				appointment,
			}))
			.sort((a, b) => b.date - a.date);
	}

	@computed get patientDoneAppointments() {
		return this.patientAppointments.filter((x) => x.appointment.isDone);
	}

	@computed get allImages() {
		return this.props.orthoCase.visits.reduce((all: string[], visit) => {
			visit.photos
				.map((x) => x.photoID)
				.forEach((path) => {
					if (path) {
						all.push(path);
					}
				});
			return all;
		}, []);
	}

	stopObservation: () => void = function () {};

	componentDidMount() {
		this.allImages.forEach(async (path) => {
			await imagesTable.fetchImage(path);
		});
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async removeImage(path: string) {
		await core.files().remove(path);
		return;
	}

	render() {
		return (
			<div className="ortho-records">
				<SectionComponent title={text(`problems`).h}>
					{this.props.orthoCase.computedProblems.length === 0 &&
					this.props.orthoCase.problemsList.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.warning}>
							{text(
								"this patient does not seem to have any problems or concerns, have you filled the case sheet?"
							)}
						</MessageBar>
					) : (
						<DetailsList
							compact
							items={[
								...[
									...this.props.orthoCase.computedProblems,
									...this.props.orthoCase.problemsList.map(
										(x) =>
											text("patient concern").c + ": " + x
									),
								].map((x, i) => [`${i + 1}. ${x}`]),
							]}
							isHeaderVisible={false}
							selectionMode={SelectionMode.none}
						/>
					)}
				</SectionComponent>
				<SectionComponent title={text(`treatment plan`).h}>
					{this.props.orthoCase.treatmentPlan_appliance.length ? (
						""
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{
								text(
									"a treatment plan must be before starting the treatment"
								).c
							}
						</MessageBar>
					)}
					<EditableListComponent
						label={""}
						value={this.props.orthoCase.treatmentPlan_appliance}
						onChange={(val) => {
							this.props.orthoCase.treatmentPlan_appliance = val;
						}}
						disabled={!this.canEdit}
					/>
				</SectionComponent>
				<SectionComponent
					title={`${text("started").h}/${text("finished").c}`}
				>
					<Row gutter={8}>
						<Col span={12}>
							<Toggle
								onText={text("started").c}
								offText={text("not started yet").c}
								checked={this.props.orthoCase.isStarted}
								onChange={(ev, val) =>
									(this.props.orthoCase.isStarted = val!)
								}
								disabled={!this.canEdit}
							/>
							{this.props.orthoCase.isStarted ? (
								<Dropdown
									selectedKey={this.props.orthoCase.startedDate.toString()}
									options={this.patientDoneAppointments.map(
										(date) => {
											return {
												key: date.date.toString(),
												text: `${formatDate(
													date.date,
													modules.setting!.getSetting(
														"date_format"
													)
												)} ${
													date.treatmentType
														? `, ${date.treatmentType}`
														: ""
												}`,
											};
										}
									)}
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
								onText={text("finished").c}
								offText={text("not finished yet").c}
								checked={this.props.orthoCase.isFinished}
								onChange={(ev, val) =>
									(this.props.orthoCase.isFinished = val!)
								}
								disabled={!this.canEdit}
							/>
							{this.props.orthoCase.isFinished ? (
								<Dropdown
									selectedKey={this.props.orthoCase.finishedDate.toString()}
									options={this.patientDoneAppointments.map(
										(date) => {
											return {
												key: date.date.toString(),
												text: `${formatDate(
													date.date,
													modules.setting!.getSetting(
														"date_format"
													)
												)} ${
													date.treatmentType
														? `, ${date.treatmentType}`
														: ""
												}`,
											};
										}
									)}
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
				<SectionComponent title={text(`records`).h}>
					{status.isOnline.files ? (
						<div className="album">
							{this.props.orthoCase.visits.length ? (
								<table>
									<tbody>
										<tr>
											<td />
											{viewsTerms.map((term, index) => {
												if (
													this.zoomedColumn !== -1 &&
													this.zoomedColumn !== index
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
																			(
																				x
																			) =>
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
																content={
																	text("zoom")
																		.c
																}
															>
																<IconButton
																	iconProps={{
																		iconName:
																			this
																				.zoomedColumn ===
																			index
																				? "ZoomOut"
																				: "ZoomIn",
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
																	content={
																		text(
																			"view grid"
																		).c
																	}
																>
																	<IconButton
																		iconProps={{
																			iconName:
																				"gridViewSmall",
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
											})}
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
																		modules.setting!.getSetting(
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
																				"info",
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
																			(
																				x
																			) =>
																				x !==
																				visit.id
																		);
																	}}
																	hidden={
																		this.openCallouts.indexOf(
																			visit.id
																		) === -1
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
																							label={
																								text(
																									`visit number`
																								)
																									.c
																							}
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
																							}}
																						/>
																					) : (
																						`${
																							text(
																								"visit"
																							)
																								.c
																						} #${
																							visit.visitNumber
																						}`
																					)}
																				</div>,
																			],
																			[
																				<div id="gf-date">
																					{this
																						.expandedField ===
																					"gf-date" ? (
																						<Dropdown
																							label={
																								text(
																									`visit date`
																								)
																									.c
																							}
																							selectedKey={visit.date.toString()}
																							disabled={
																								!this
																									.canEdit
																							}
																							options={this.patientDoneAppointments.map(
																								(
																									date
																								) => {
																									return {
																										key: date.date.toString(),
																										text: `${formatDate(
																											date.date,
																											modules.setting!.getSetting(
																												"date_format"
																											)
																										)} ${
																											date.treatmentType
																												? `, ${date.treatmentType}`
																												: ""
																										}`,
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
																							}}
																						/>
																					) : (
																						`${
																							text(
																								"date"
																							)
																								.c
																						}: ${formatDate(
																							visit.date,
																							modules.setting!.getSetting(
																								"date_format"
																							)
																						)}`
																					)}
																				</div>,
																			],
																			[
																				<div id="gf-appliance">
																					{this
																						.expandedField ===
																					"gf-appliance" ? (
																						<TextField
																							autoFocus
																							label={
																								text(
																									`appliance`
																								)
																									.c
																							}
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
																							}}
																						/>
																					) : (
																						`${
																							text(
																								"appliance"
																							)
																								.c
																						}: ${
																							visit.appliance
																								? visit.appliance
																								: text(
																										"no appliance info"
																								  )
																										.c
																						}`
																					)}
																				</div>,
																			],
																			[
																				<div id="gf-target">
																					{this
																						.expandedField ===
																					"gf-target" ? (
																						<TextField
																							autoFocus
																							label={
																								text(
																									`target & expectations`
																								)
																									.c
																							}
																							disabled={
																								!this
																									.canEdit
																							}
																							value={
																								visit.target
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
																								].target = val!;
																							}}
																						/>
																					) : (
																						`${
																							text(
																								"target & expectations"
																							)
																								.c
																						}: ${
																							visit.target
																								? visit.target
																								: text(
																										"no target info"
																								  )
																										.c
																						}`
																					)}
																				</div>,
																			],
																		]}
																		isHeaderVisible={
																			false
																		}
																		selectionMode={
																			SelectionMode.none
																		}
																		onActiveItemChanged={(
																			row
																		) => {
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
																			imagesTable
																				.table[
																				photo
																					.photoID
																			] ? (
																				<GridTableComponent />
																			) : (
																				""
																			)}
																			{photo.photoID ? (
																				imagesTable
																					.table[
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
																									"100%",
																							}}
																							src={
																								imagesTable
																									.table[
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
																										"photo-dialog",
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
																											"relative",
																									}}
																								>
																									<img
																										style={{
																											width:
																												"100%",
																										}}
																										src={
																											imagesTable
																												.table[
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
																												imagesTable
																													.table[
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
																												imagesTable
																													.table[
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
																														label={
																															text(
																																`visit number`
																															)
																																.c
																														}
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
																														}}
																													/>
																												) : (
																													`${
																														text(
																															"visit"
																														)
																															.c
																													} #${
																														visit.visitNumber
																													}`
																												)}
																											</div>,
																										],
																										[
																											<div id="gf-date">
																												{this
																													.expandedField ===
																												"gf-date" ? (
																													<Dropdown
																														label={
																															text(
																																`visit date`
																															)
																																.c
																														}
																														disabled={
																															!this
																																.canEdit
																														}
																														selectedKey={visit.date.toString()}
																														options={this.patientDoneAppointments.map(
																															(
																																date
																															) => {
																																return {
																																	key: date.date.toString(),
																																	text: `${formatDate(
																																		date.date,
																																		modules.setting!.getSetting(
																																			"date_format"
																																		)
																																	)} ${
																																		date.treatmentType
																																			? `, ${date.treatmentType}`
																																			: ""
																																	}`,
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
																														}}
																													/>
																												) : (
																													`${
																														text(
																															"date"
																														)
																															.c
																													}: ${formatDate(
																														visit.date,
																														modules.setting!.getSetting(
																															"date_format"
																														)
																													)}`
																												)}
																											</div>,
																										],
																										[
																											<div id="gf-appliance">
																												{this
																													.expandedField ===
																												"gf-appliance" ? (
																													<TextField
																														autoFocus
																														label={
																															text(
																																`appliance`
																															)
																																.c
																														}
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
																														}}
																													/>
																												) : (
																													`${
																														text(
																															"appliance"
																														)
																															.c
																													}: ${
																														visit.appliance
																															? visit.appliance
																															: text(
																																	"no appliance info"
																															  )
																																	.c
																													}`
																												)}
																											</div>,
																										],
																										[
																											<div id="gf-comment">
																												{this
																													.expandedField ===
																												"gf-comment" ? (
																													<TextField
																														autoFocus
																														label={
																															text(
																																`comment`
																															)
																																.c
																														}
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
																														}}
																													/>
																												) : (
																													`${
																														text(
																															"comment"
																														)
																															.c
																													}: ${
																														photo.comment
																															? photo.comment
																															: text(
																																	"no comment on this photo"
																															  )
																																	.c
																													}`
																												)}
																											</div>,
																										],
																									]}
																									isHeaderVisible={
																										false
																									}
																									selectionMode={
																										SelectionMode.none
																									}
																									onActiveItemChanged={(
																										row
																									) => {
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
																												"overlay prev"
																											)
																												.c,
																											iconProps: {
																												iconName:
																													"MapLayers",
																											},
																											className: this
																												.overlayWithPrev
																												? "active-button"
																												: undefined,
																											onClick: () => {
																												this.overlayWithPrev = !this
																													.overlayWithPrev;
																											},
																											hidden: !imagesTable
																												.table[
																												prevVisit
																													.photos[
																													photoIndex
																												]
																													.photoID
																											],
																										},
																										{
																											key:
																												"overlay next",
																											text: text(
																												"overlay next"
																											)
																												.c,
																											iconProps: {
																												iconName:
																													"MapLayers",
																											},
																											className: this
																												.overlayWithNext
																												? "active-button"
																												: undefined,
																											onClick: () => {
																												this.overlayWithNext = !this
																													.overlayWithNext;
																											},
																											hidden: !imagesTable
																												.table[
																												nextVisit
																													.photos[
																													photoIndex
																												]
																													.photoID
																											],
																										},
																									]}
																									farItems={[
																										{
																											key:
																												"delete photo",
																											text: text(
																												"delete"
																											)
																												.c,
																											iconProps: {
																												iconName:
																													"trash",
																											},
																											disabled: !this
																												.canEdit,
																											onClick: () => {
																												this.removeImage(
																													this
																														.props
																														.orthoCase
																														.visits[
																														visitIndex
																													]
																														.photos[
																														photoIndex
																													]
																														.photoID
																												);
																												this.props.orthoCase.visits[
																													visitIndex
																												].photos[
																													photoIndex
																												] = new Photo();
																												this.selectedPhotoId =
																													"";
																											},
																										},
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
																						prevSrc:
																							imagesTable
																								.table[
																								prevVisit
																									.photos[
																									photoIndex
																								]
																									.photoID
																							],
																						disabled: !this
																							.canEdit,
																						onFinish: (
																							e
																						) => {
																							if (
																								e[0]
																							) {
																								this.props.orthoCase.visits[
																									visitIndex
																								].photos[
																									photoIndex
																								].photoID =
																									e[0];
																								imagesTable.fetchImage(
																									e[0]
																								);
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
																						targetDir: `${ORTHO_RECORDS_DIR}/${this.props.orthoCase._id}`,
																					}}
																				>
																					<TooltipHost
																						content={
																							text(
																								"add photo"
																							)
																								.c
																						}
																					>
																						<IconButton
																							iconProps={{
																								iconName:
																									"Photo2Add",
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
																	content={
																		text(
																			"delete visit"
																		).c
																	}
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
																				"DeleteRows",
																		}}
																		onClick={() => {
																			core.modals.newModal(
																				{
																					text: text(
																						"this visit data will be deleted along with all photos and notes"
																					)
																						.c,
																					onConfirm: () => {
																						const deletedVisit = this.props.orthoCase.visits.splice(
																							visitIndex,
																							1
																						);
																						deletedVisit[0].photos.forEach(
																							(
																								photo
																							) =>
																								this.removeImage(
																									photo.photoID
																								)
																						);
																					},
																					showCancelButton: true,
																					showConfirmButton: true,
																					id: Math.random(),
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
														</tr>,
													];
												}
											)}
									</tbody>
								</table>
							) : (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{
										text(
											"no visits recorded yet! add a new visit using the button below"
										).c
									}
								</MessageBar>
							)}
							<br />
							<DefaultButton
								disabled={!this.canEdit}
								iconProps={{ iconName: "ExploreContent" }}
								text={text("add visit").c}
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
										new Visit().withVisitNumber(visitNumber)
									);
								}}
							/>
						</div>
					) : (
						<MessageBar messageBarType={MessageBarType.warning}>
							{
								text(
									"files server is offline, make sure you're online and connected"
								).c
							}
						</MessageBar>
					)}
				</SectionComponent>
				<SectionComponent title={text(`notes for the next visit`).h}>
					<EditableListComponent
						label={text(`add note`).c}
						value={this.props.orthoCase.nextVisitNotes}
						onChange={(val) => {
							this.props.orthoCase.nextVisitNotes = val;
						}}
						disabled={!this.canEdit}
					/>
				</SectionComponent>
			</div>
		);
	}
}
