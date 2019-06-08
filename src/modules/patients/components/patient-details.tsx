import { Col, getRandomTagType, Row, SectionComponent, TagInputComponent } from "@common-components";
import { imagesTable, status, text } from "@core";
import { Gender, Patient, StaffMember } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, Label, Link, Shimmer, TextField } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const EditableListComponent = loadable({
	loading: () => <Shimmer />,
	loader: async () =>
		(await import("common-components/editable-list/editable-list"))
			.EditableListComponent
});

@observer
export class PatientDetailsPanel extends React.Component<{
	patient: Patient;
	currentUser: StaffMember;
	usedLabels: string[];
	onChangeViewWhich: (key: string) => void;
}> {
	@computed get canEdit() {
		return this.props.currentUser.canEditPatients;
	}

	render() {
		return (
			<div className="spd-pn">
				<SectionComponent title={text(`Basic Info`)}>
					<div className="name">
						<TextField
							label={text(`Name`)}
							value={this.props.patient.name}
							onChange={(ev, name) =>
								(this.props.patient.name = name!)
							}
							disabled={!this.canEdit}
						/>
					</div>
					<Row gutter={6}>
						<Col sm={12}>
							<div className="birth">
								<TextField
									label={text("Birth year / age")}
									value={this.props.patient.birthYear.toString()}
									onChange={(ev, year) =>
										(this.props.patient.birthYear = num(
											year!
										))
									}
									type="number"
									disabled={!this.canEdit}
								/>
							</div>
						</Col>
						<Col sm={12}>
							<div className="gender">
								<Dropdown
									label={text("Gender")}
									selectedKey={
										this.props.patient.gender ===
										Gender.male
											? "male"
											: "female"
									}
									options={[
										{ key: "male", text: text("Male") },
										{ key: "female", text: text("Female") }
									]}
									onChange={(ev, val) => {
										if (val!.key === "male") {
											this.props.patient.gender =
												Gender.male;
										} else {
											this.props.patient.gender =
												Gender.female;
										}
									}}
									disabled={!this.canEdit}
								/>
							</div>
						</Col>
					</Row>
					{status.isOnline && status.isDropboxActive ? (
						<div>
							<Label>Avatar photo</Label>
							<div className="thumbs">
								{this.props.patient.gallery.map(image => {
									if (imagesTable.table[image]) {
										return (
											<a
												className={`thumb ${
													this.props.patient
														.avatar === image
														? "selected"
														: ""
												}`}
												key={image}
												style={{
													backgroundImage: `url('${
														imagesTable.table[image]
															? imagesTable.table[
																	image
															  ]
															: ""
													}')`
												}}
												onClick={() => {
													this.props.patient.avatar = image;
												}}
											/>
										);
									} else {
										imagesTable.fetchImage(image);
									}
								})}
							</div>
							<br />
							{this.props.patient.avatar ? (
								<span>
									<Link
										onClick={() =>
											(this.props.patient.avatar = "")
										}
									>
										{text("Unset")}
									</Link>{" "}
									/{" "}
								</span>
							) : (
								""
							)}
							<Link
								onClick={() =>
									this.props.onChangeViewWhich("gallery")
								}
							>
								{text("Upload")}
							</Link>
						</div>
					) : (
						""
					)}
				</SectionComponent>

				<SectionComponent title={text(`Contact Info`)}>
					<Row gutter={6}>
						<Col sm={12}>
							<TextField
								label={text("Phone")}
								value={this.props.patient.phone}
								onChange={(ev, phone) =>
									(this.props.patient.phone = phone!)
								}
								type="number"
								disabled={!this.canEdit}
							/>
						</Col>
						<Col sm={12}>
							<TextField
								label={text("Email")}
								value={this.props.patient.email}
								onChange={(ev, email) =>
									(this.props.patient.email = email!)
								}
								disabled={!this.canEdit}
							/>
						</Col>
					</Row>

					<TextField
						label={text("Address")}
						value={this.props.patient.address}
						onChange={(ev, address) =>
							(this.props.patient.address = address!)
						}
						disabled={!this.canEdit}
						multiline
					/>
				</SectionComponent>

				<SectionComponent title={text(`Other Notes`)}>
					<Row gutter={6}>
						<Col md={12}>
							{" "}
							<TagInputComponent
								disabled={!this.canEdit}
								className="patient-tags"
								placeholder={text("Labels")}
								options={[""]
									.concat(this.props.usedLabels)
									.map(x => ({
										key: x,
										text: x
									}))
									.reduce(
										(
											arr: {
												key: string;
												text: string;
											}[],
											item
										) => {
											if (
												arr.findIndex(
													x => x.key === item.key
												) === -1
											) {
												arr.push(item);
											}
											return arr;
										},
										[]
									)}
								onChange={newVal => {
									this.props.patient.labels = newVal.map(
										item => {
											return {
												text: item.text,
												type: getRandomTagType(
													item.text
												)
											};
										}
									);
								}}
								value={this.props.patient.labels.map(label => ({
									key: label.text,
									text: label.text
								}))}
							/>
						</Col>
						<Col md={12}>
							<div className="medical-history">
								<EditableListComponent
									label={text("Notes")}
									value={this.props.patient.medicalHistory}
									onChange={newVal => {
										this.props.patient.medicalHistory = newVal;
									}}
									style={{ marginTop: "0" }}
									disabled={!this.canEdit}
								/>
							</div>
						</Col>
					</Row>
				</SectionComponent>
			</div>
		);
	}
}
