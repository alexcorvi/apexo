import { fileTypes, PickAndUploadComponent, SectionComponent } from "@common-components";
import { GALLERIES_DIR, imagesTable, status, text } from "@core";
import * as core from "@core";
import { Patient, StaffMember } from "@modules";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import { Icon, IconButton, MessageBar, MessageBarType, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientGalleryPanel extends React.Component<{
	patient: Patient;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	@observable uploading: boolean = false;

	@observable selectedImagePath: string = "";

	@computed get selectedImageURI() {
		return imagesTable.table[this.selectedImagePath];
	}

	stopObservation: () => void = function() {};

	render() {
		return (
			<SectionComponent title={text(`Patient Gallery`)}>
				{status.isOnline.client ? (
					status.isOnline.dropbox ? (
						<div className="spg-p">
							{this.props.patient.gallery.length === 0 ? (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{text(
										"This patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"
									)}
								</MessageBar>
							) : (
								""
							)}
							<br />
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
											onFinish={paths => {
												this.props.patient.gallery.push(
													...paths
												);
												paths.forEach(x =>
													imagesTable.fetchImage(x)
												);
											}}
											onStartLoading={() => {
												this.uploading = true;
											}}
											onFinishLoading={() => {
												this.uploading = false;
											}}
											targetDir={`${GALLERIES_DIR}/${
												this.props.patient._id
											}`}
										>
											<TooltipHost
												content={text("Add photo")}
											>
												<IconButton
													className={`add-photo`}
													iconProps={{
														iconName: "Photo2Add"
													}}
												/>
											</TooltipHost>
										</PickAndUploadComponent>
									)
								) : (
									""
								)}
								{this.props.patient.gallery.map(imagePath => {
									const URI = imagesTable.table[imagePath];
									return URI ? (
										<span
											className={`thumb ${
												this.selectedImagePath ===
												imagePath
													? "selected"
													: ""
											}`}
											key={imagePath}
											style={{
												backgroundImage: `url('${
													URI ? URI : ""
												}')`
											}}
											onClick={() => {
												this.selectedImagePath = imagePath;
											}}
										/>
									) : (
										<div
											key={imagePath + "-placeholder"}
											className="placeholder"
										>
											<Icon
												iconName="sync"
												className="rotate"
											/>
										</div>
									);
								})}
							</div>
							{this.selectedImagePath ? (
								<div className="viewport">
									<img
										key={this.selectedImagePath}
										src={this.selectedImageURI}
									/>
									{this.canEdit ? (
										<IconButton
											className="delete-photo"
											iconProps={{ iconName: "trash" }}
											onClick={async () => {
												await this.removeImage();
												this.selectedImagePath = "";
											}}
										/>
									) : (
										""
									)}
								</div>
							) : (
								""
							)}
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
							"You can not access patient gallery while offline"
						)}
					</MessageBar>
				)}
				<div style={{ clear: "both" }} />
			</SectionComponent>
		);
	}

	componentDidMount() {
		this.props.patient.gallery.forEach(async path => {
			await imagesTable.fetchImage(path);
		});
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async removeImage() {
		await core.files.remove(this.selectedImagePath);
		const selectedImageIndex = this.props.patient.gallery.indexOf(
			this.selectedImagePath
		);
		this.props.patient.gallery.splice(selectedImageIndex, 1);
		return;
	}
}
