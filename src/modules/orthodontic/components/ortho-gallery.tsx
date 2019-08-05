import {
	Col,
	fileTypes,
	PickAndUploadComponent,
	ProfileComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { CEPHALOMETRIC_DIR, status, text } from "@core";
import * as core from "@core";
import { CephalometricItemInterface, OrthoCase, PatientGalleryPanel, StaffMember } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, IconButton, MessageBar, MessageBarType, Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const CephalometricEditorPanel = loadable({
	loader: async () =>
		(await import("modules/orthodontic/components/cephalometric"))
			.CephalometricEditorPanel,
	loading: () => <Shimmer />
});
@observer
export class OrthoGalleryPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@observable openCephalometricItem:
		| CephalometricItemInterface
		| undefined = undefined;

	@observable
	cephalometricToViewIndex: number = -1;
	@computed get canEdit() {
		return core.user.currentUser!.canEditOrtho;
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
					<CephalometricEditorPanel
						onDismiss={() => {
							this.openCephalometricItem = undefined;
						}}
						item={this.openCephalometricItem}
						onSave={coordinates =>
							(this.openCephalometricItem!.pointCoordinates = coordinates)
						}
					/>
				) : (
					""
				)}

				<SectionComponent title={text(`Cephalometric Analysis`)}>
					{status.isOnline.server ? (
						status.isOnline.dropbox ? (
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
																	modules.setting!.getSetting(
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
													disabled={this.canEdit}
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
