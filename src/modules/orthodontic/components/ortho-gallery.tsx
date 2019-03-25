import * as React from "react";
import { computed, observable } from "mobx";
import {
	Dropdown,
	TextField,
	DetailsList,
	ConstrainMode,
	SelectionMode,
	IconButton,
	PrimaryButton
} from "office-ui-fabric-react";

import { EditableList } from "../../../assets/components/editable-list/editable-list";
import {
	FacialProfile,
	Lips,
	OralHygiene,
	OrthoCase
} from "../data/class.ortho";
import { observer } from "mobx-react";
import { patientsData } from "../../patients";
import { Section } from "../../../assets/components/section/section";
import { TagInput } from "../../../assets/components/tag-input/tag-input";
import { API } from "../../../core/index";
import { lang } from "../../../core/i18/i18";
import { SinglePatientGallery } from "../../patients/components/single/gallery/gallery";
import { Row, Col } from "../../../assets/components/grid";
import { Profile } from "../../../assets/components/profile/profile";
import { unifiedDateFormat } from "../../../assets/utils/date";

@observer
export class OrthoGallery extends React.Component<{
	orthoCase: OrthoCase;
}> {
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

				<Section showByDefault title="Cephalometric Analysis">
					{this.props.orthoCase.cephalometricHistory.map((c, i) => (
						<Row
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
					<PrimaryButton
						iconProps={{ iconName: "Add" }}
						onClick={() => {
							this.props.orthoCase.cephalometricHistory.push({
								data: "new",
								date: new Date().getTime()
							});
							this.cephalometricToViewIndex =
								this.props.orthoCase.cephalometricHistory
									.length - 1;
						}}
					>
						New Analysis
					</PrimaryButton>
				</Section>
			</div>
		);
	}
}
