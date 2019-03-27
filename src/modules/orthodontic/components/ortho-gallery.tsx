import * as React from "react";
import { computed, observable } from "mobx";
import { IconButton, PrimaryButton } from "office-ui-fabric-react";

import { OrthoCase } from "../data/class.ortho";
import { observer } from "mobx-react";
import { Section } from "../../../assets/components/section/section";
import { API } from "../../../core/index";
import { SinglePatientGallery } from "../../patients/components/single/gallery/gallery";
import { Row, Col } from "../../../assets/components/grid";
import { Profile } from "../../../assets/components/profile/profile";
import { unifiedDateFormat } from "../../../assets/utils/date";
import {
	PickAndUpload,
	fileTypes
} from "../../../assets/components/pick-files/pick-files";
import dataOrtho from "../data/data.ortho";
import { files } from "../../../core/files/files";
import { orthoData } from "..";
import { CephalometricItem } from "../data/interface.ortho-json";
import { CephalometricEditor } from "./cephalometric";

@observer
export class OrthoGallery extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@observable openCephalometricItem:
		| CephalometricItem
		| undefined = undefined;

	@observable
	cephalometricToViewIndex: number = -1;
	@computed get canEdit() {
		return API.user.currentUser.canEditOrtho;
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
					<SinglePatientGallery
						patient={this.props.orthoCase.patient}
					/>
				) : (
					""
				)}

				{this.openCephalometricItem ? (
					<CephalometricEditor
						onDismiss={() => {
							this.openCephalometricItem = undefined;
							this.props.orthoCase.triggerUpdate++;
						}}
						item={this.openCephalometricItem}
					/>
				) : (
					""
				)}

				<Section showByDefault title="Cephalometric Analysis">
					{this.props.orthoCase.cephalometricHistory.map((c, i) => (
						<Row
							key={c.imgPath}
							style={{
								borderBottom: "1px solid #e3e3e3",
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
									<Profile
										name={`${i + 1}: Analysis #${i + 1}`}
										secondaryElement={
											<span>
												{unifiedDateFormat(c.date)}
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
					))}
					<PickAndUpload
						allowMultiple={false}
						accept={fileTypes.image}
						onFinish={async res => {
							this.props.orthoCase.cephalometricHistory.push({
								date: new Date().getTime(),
								imgPath: res[0],
								pointCoordinates: "{}"
							});

							this.openCephalometricItem = this.props.orthoCase.cephalometricHistory[
								this.props.orthoCase.cephalometricHistory
									.length - 1
							];
						}}
						targetDir={`cephalometric/${this.props.orthoCase._id}`}
					>
						<PrimaryButton iconProps={{ iconName: "Add" }}>
							New Analysis
						</PrimaryButton>
					</PickAndUpload>
				</Section>
			</div>
		);
	}
}
