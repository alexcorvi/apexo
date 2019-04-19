import {
	Col,
	fileTypes,
	PickAndUploadComponent,
	ProfileComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { CEPHALOMETRIC_DIR, text } from "@core";
import { CephalometricItemInterface, OrthoCase, PatientGalleryPanel, StaffMember } from "@modules";
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
	currentUser: StaffMember;
	isOnline: boolean;
	isDropboxActive: boolean;
	dateFormat: string;
	saveFile: (obj: {
		blob: Blob;
		ext: string;
		dir: string;
	}) => Promise<string>;
	getFile: (path: string) => Promise<string>;
	removeFile: (path: string) => Promise<any>;
	cephLoader: (obj: CephalometricItemInterface) => Promise<string>;
}> {
	@observable openCephalometricItem:
		| CephalometricItemInterface
		| undefined = undefined;

	@observable
	cephalometricToViewIndex: number = -1;
	@computed get canEdit() {
		return this.props.currentUser.canEditOrtho;
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
						currentUser={this.props.currentUser}
						isOnline={this.props.isOnline}
						isDropboxActive={this.props.isDropboxActive}
						saveFile={obj => this.props.saveFile(obj)}
						getFile={path => this.props.getFile(path)}
						removeFile={path => this.props.removeFile(path)}
					/>
				) : (
					""
				)}

				{this.openCephalometricItem ? (
					<CephalometricEditorPanel
						onDismiss={() => {
							this.openCephalometricItem = undefined;
							this.props.orthoCase.triggerUpdate++;
						}}
						item={this.openCephalometricItem}
						dateFormat={this.props.dateFormat}
						cephLoader={obj => this.props.cephLoader(obj)}
						onSave={coordinates =>
							(this.openCephalometricItem!.pointCoordinates = coordinates)
						}
					/>
				) : (
					""
				)}

				<SectionComponent title={text(`Cephalometric Analysis`)}>
					{this.props.isOnline ? (
						this.props.isDropboxActive ? (
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
																	this.props
																		.dateFormat
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
									saveFile={obj => this.props.saveFile(obj)}
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
