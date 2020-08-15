import { GALLERIES_DIR, imagesTable, status, text } from "@core";
import * as core from "@core";
import { Patient, StaffMember } from "@modules";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	Col,
	fileTypes,
	PickAndUploadComponent,
	Row,
	SectionComponent,
} from "@common-components";
import {
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	TooltipHost,
} from "office-ui-fabric-react";

@observer
export class PatientGalleryPanel extends React.Component<{
	patient: Patient;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	@observable uploading: boolean = false;
	@observable deleting: boolean = false;
	@observable selectedImagePath: string = "";

	@computed get selectedImageURI() {
		return imagesTable.table[this.selectedImagePath];
	}

	stopObservation: () => void = function () {};

	render() {
		return (
			<SectionComponent title={text(`patient gallery`).h}>
				{status.isOnline.files ? (
					<div className="spg-p">
						<Row gutter={8}>
							<Col xs={6} sm={4} md={3}>
								<div className="thumbs">
									{this.canEdit ? (
										this.uploading ? (
											<Icon
												iconName="sync"
												className="rotate"
												style={{ padding: 10 }}
											/>
										) : (
											<PickAndUploadComponent
												allowMultiple={true}
												accept={fileTypes.image}
												onFinish={(paths) => {
													this.props.patient.gallery.push(
														...paths
													);
													paths.forEach((x) =>
														imagesTable.fetchImage(
															x
														)
													);
												}}
												onStartLoading={() => {
													this.uploading = true;
												}}
												onFinishLoading={() => {
													this.uploading = false;
												}}
												targetDir={`${GALLERIES_DIR}/${this.props.patient._id}`}
											>
												<TooltipHost
													content={
														text("add photo").c
													}
												>
													<IconButton
														className={`add-photo`}
														iconProps={{
															iconName:
																"Photo2Add",
														}}
													/>
												</TooltipHost>
											</PickAndUploadComponent>
										)
									) : (
										""
									)}
									{this.props.patient.gallery.map(
										(imagePath) => {
											const URI =
												imagesTable.table[imagePath];
											return URI ? (
												<span
													className={`thumb ${
														this
															.selectedImagePath ===
														imagePath
															? "selected"
															: ""
													}`}
													key={imagePath}
													style={{
														backgroundImage: `url('${
															URI ? URI : ""
														}')`,
													}}
													onClick={() => {
														this.selectedImagePath = imagePath;
													}}
												/>
											) : (
												<div
													key={
														imagePath +
														"-placeholder"
													}
													className="placeholder"
												>
													<Icon
														iconName="sync"
														className="rotate"
													/>
												</div>
											);
										}
									)}
								</div>
							</Col>
							<Col xs={18} sm={20} md={21}>
								{this.props.patient.gallery.length === 0 ? (
									<MessageBar
										messageBarType={MessageBarType.info}
									>
										{
											text(
												"this patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"
											).c
										}
									</MessageBar>
								) : this.selectedImagePath ? (
									<div className="viewport">
										<img
											key={this.selectedImagePath}
											src={this.selectedImageURI}
										/>
										{this.canEdit ? (
											this.deleting ? (
												<IconButton
													className="delete-photo rotate"
													disabled
													iconProps={{
														iconName: "sync",
													}}
													onClick={async () => {
														await this.removeImage();
														this.selectedImagePath =
															"";
													}}
												/>
											) : (
												<IconButton
													className="delete-photo"
													iconProps={{
														iconName: "trash",
													}}
													onClick={async () => {
														this.deleting = true;
														await this.removeImage();
														this.selectedImagePath =
															"";
														this.deleting = false;
													}}
												/>
											)
										) : (
											""
										)}
									</div>
								) : (
									<MessageBar
										messageBarType={MessageBarType.info}
									>
										{
											text(
												"click a thumbnail to expand it"
											).c
										}
									</MessageBar>
								)}
							</Col>
						</Row>
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
		);
	}

	componentDidMount() {
		this.props.patient.gallery.forEach(async (path) => {
			await imagesTable.fetchImage(path);
		});
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async removeImage() {
		await core.files().remove(this.selectedImagePath);
		const selectedImageIndex = this.props.patient.gallery.indexOf(
			this.selectedImagePath
		);
		this.props.patient.gallery.splice(selectedImageIndex, 1);
		return;
	}
}
