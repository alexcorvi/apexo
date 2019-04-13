import {
	AsyncComponent,
	Col,
	fileTypes,
	PickAndUploadComponent,
	ProfileComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { CEPHALOMETRIC_DIR, status, text, user } from "@core";
import { CephalometricItem, OrthoCase, PatientGalleryPanel, setting } from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, IconButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class OrthoGalleryPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@observable openCephalometricItem:
		| CephalometricItem
		| undefined = undefined;

	@observable
	cephalometricToViewIndex: number = -1;
	@computed get canEdit() {
		return user.currentUser.canEditOrtho;
	}

	@computed
	get cephalometricToView() {
		return this.props.orthoCase.cephalometricHistory[
			this.cephalometricToViewIndex
		];
	}

	render() {
		return (
			<div>
				{this.props.orthoCase.patient ? (
					<PatientGalleryPanel
						patient={this.props.orthoCase.patient}
					/>
				) : (
					""
				)}

				{this.openCephalometricItem ? (
					<AsyncComponent
						key="ortho-records"
						loader={async () => {
							const Component = (await import("./cephalometric"))
								.CephalometricEditorPanel;
							return this.openCephalometricItem ? (
								<Component
									onDismiss={() => {
										this.openCephalometricItem = undefined;
										this.props.orthoCase.triggerUpdate++;
									}}
									item={this.openCephalometricItem}
								/>
							) : (
								<div />
							);
						}}
					/>
				) : (
					""
				)}

				<SectionComponent title={text(`Cephalometric Analysis`)}>
					{status.online ? (
						status.dropboxActive ? (
							<div>
								{this.props.orthoCase.cephalometricHistory.map(
									(c, i) => (
										<Row
											key={c.imgPath}
											style={{
												borderBottom:
													"1px solid #e3e3e3",
												marginBottom: "25px"
											}}
										>
											<Col xs={20}>
												<div
													style={{
														marginBottom: 10,
														cursor: "pointer"
													}}
													onClick={() => {
														this.cephalometricToViewIndex = i;
													}}
													key={i}
												>
													<ProfileComponent
														name={`${i + 1}: ${text(
															"Analysis"
														)} #${i + 1}`}
														secondaryElement={
															<span>
																{formatDate(
																	c.date,
																	setting.getSetting(
																		"date_format"
																	)
																)}
															</span>
														}
														size={3}
														onClick={() => {
															this.openCephalometricItem = this.props.orthoCase.cephalometricHistory[
																i
															];
														}}
													/>
												</div>
											</Col>
											<Col
												xs={4}
												style={{
													textAlign: "right"
												}}
											>
												<IconButton
													iconProps={{
														iconName: "trash"
													}}
													onClick={() =>
														this.props.orthoCase.cephalometricHistory.splice(
															i,
															1
														)
													}
												/>
											</Col>
										</Row>
									)
								)}
								<PickAndUploadComponent
									allowMultiple={false}
									accept={fileTypes.image}
									onFinish={async res => {
										this.props.orthoCase.cephalometricHistory.push(
											{
												date: new Date().getTime(),
												imgPath: res[0],
												pointCoordinates: "{}"
											}
										);

										this.openCephalometricItem = this.props.orthoCase.cephalometricHistory[
											this.props.orthoCase
												.cephalometricHistory.length - 1
										];
									}}
									targetDir={`${CEPHALOMETRIC_DIR}/${
										this.props.orthoCase._id
									}`}
								>
									<DefaultButton
										iconProps={{ iconName: "Add" }}
										text={text("New analysis")}
									/>
								</PickAndUploadComponent>
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
								"You can not access cephalometric data while offline"
							)}
						</MessageBar>
					)}
				</SectionComponent>
			</div>
		);
	}
}
