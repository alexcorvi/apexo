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
	PrimaryButton,
	TextField,
	TooltipHost,
} from "office-ui-fabric-react";

@observer
export class PatientGalleryPanel extends React.Component<{
	patient: Patient;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}
	@observable gphotosGrabbing: boolean = false;
	@observable uploading: boolean = false;
	@observable deleting: boolean = false;
	@observable selectedImage: string = "";

	@computed get selectedImageURI() {
		return this.props.patient.isGooglePhotos(this.selectedImage)
			? this.selectedImage
			: imagesTable.table[this.selectedImage];
	}

	stopObservation: () => void = function () {};

	async grabGPhotos(link: string) {
		if (link.length === 0) {
			this.gphotosGrabbing = false;
			return;
		}
		this.gphotosGrabbing = true;
		await imagesTable.grabGPhotos(link);
		this.gphotosGrabbing = false;
	}
	render() {
		return (
			<SectionComponent title={text(`patient gallery`).h}>
				<div className="spg-p">
					<Row gutter={8}>
						<Col xs={18}>
							<TextField
								disabled={!this.canEdit}
								placeholder="load shared google album"
								value={this.props.patient.galbum}
								onChange={(ev, v) =>
									(this.props.patient.galbum = v || "")
								}
							></TextField>
						</Col>
						<Col xs={6}>
							<PrimaryButton
								disabled={!this.canEdit}
								text={text("download").c}
								iconProps={{
									iconName: this.gphotosGrabbing
										? "sync"
										: "Photo2Add",
									className: this.gphotosGrabbing
										? "rotate"
										: "",
								}}
								onClick={() => {
									this.grabGPhotos(this.props.patient.galbum);
								}}
							></PrimaryButton>
						</Col>
					</Row>

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
													imagesTable.fetchImage(x)
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
												content={text("add photo").c}
											>
												<IconButton
													className={`add-photo`}
													iconProps={{
														iconName: "Photo2Add",
													}}
												/>
											</TooltipHost>
										</PickAndUploadComponent>
									)
								) : (
									""
								)}
								{this.props.patient.totalImages.map(
									(imagePath) => {
										const URI =
											imagesTable.table[imagePath];
										return URI ||
											this.props.patient.isGooglePhotos(
												imagePath
											) ? (
											<span
												className={`thumb ${
													this.selectedImage ===
													imagePath
														? "selected"
														: ""
												}`}
												key={imagePath}
												style={{
													backgroundImage: `url('${
														URI
															? URI
															: this.props.patient.isGooglePhotos(
																	imagePath
															  )
															? imagePath
															: ""
													}')`,
												}}
												onClick={() => {
													this.selectedImage =
														imagePath;
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
									}
								)}
							</div>
						</Col>
						<Col xs={18} sm={20} md={21}>
							{this.props.patient.totalImages.length === 0 ? (
								<MessageBar
									messageBarType={MessageBarType.info}
								>
									{
										text(
											"this patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"
										).c
									}
								</MessageBar>
							) : this.selectedImage.length > 0 ? (
								<div className="viewport">
									<img
										key={this.selectedImage}
										src={this.selectedImageURI}
									/>
									{this.canEdit &&
									!this.props.patient.isGooglePhotos(
										this.selectedImage
									) ? (
										this.deleting ? (
											<IconButton
												className="delete-photo rotate"
												disabled
												iconProps={{
													iconName: "sync",
												}}
												onClick={async () => {
													await this.removeImage();
													this.selectedImage = "";
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
													this.selectedImage = "";
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
									{text("click a thumbnail to expand it").c}
								</MessageBar>
							)}
						</Col>
					</Row>
				</div>
			</SectionComponent>
		);
	}

	componentDidMount() {
		this.props.patient.gallery.forEach(async (path) => {
			await imagesTable.fetchImage(path);
		});

		this.grabGPhotos(this.props.patient.galbum);
	}

	componentWillUnmount() {
		this.stopObservation();
	}

	async removeImage() {
		await core.files().remove(this.selectedImage);
		const selectedImageIndex = this.props.patient.gallery.indexOf(
			this.selectedImage
		);
		this.props.patient.gallery.splice(selectedImageIndex, 1);
		return;
	}
}
