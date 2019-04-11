import "./patient-details.scss";
import {
	Col,
	EditableListComponent,
	getRandomTagType,
	Row,
	SectionComponent,
	TagInputComponent
	} from "@common-components";
import { lang, user } from "@core";
import { Gender, Patient, patients } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientDetailsPanel extends React.Component<{
	patient: Patient;
}> {
	@computed get canEdit() {
		return user.currentUser.canEditPatients;
	}

	render() {
		return (
			<div className="single-patient-details">
				<SectionComponent title={lang(`Basic Info`)}>
					<div className="name">
						<TextField
							label={lang(`Name`)}
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
									label={lang("Birth year / age")}
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
									label={lang("Gender")}
									selectedKey={
										this.props.patient.gender ===
										Gender.male
											? "male"
											: "female"
									}
									options={[
										{ key: "male", text: lang("Male") },
										{ key: "female", text: lang("Female") }
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
				</SectionComponent>

				<SectionComponent title={lang(`Contact Info`)}>
					<TextField
						label={lang("Phone")}
						value={this.props.patient.phone}
						onChange={(ev, phone) =>
							(this.props.patient.phone = phone!)
						}
						type="number"
						disabled={!this.canEdit}
					/>

					<TextField
						label={lang("Email")}
						value={this.props.patient.email}
						onChange={(ev, email) =>
							(this.props.patient.email = email!)
						}
						disabled={!this.canEdit}
					/>

					<TextField
						label={lang("Address")}
						value={this.props.patient.address}
						onChange={(ev, address) =>
							(this.props.patient.address = address!)
						}
						disabled={!this.canEdit}
					/>
				</SectionComponent>

				<SectionComponent title={lang(`Other Notes`)}>
					<Row gutter={6}>
						<Col md={12}>
							{" "}
							<TagInputComponent
								disabled={!this.canEdit}
								className="patient-tags"
								placeholder={lang("Labels")}
								options={[""]
									.concat(
										...patients.list.map(patient =>
											patient.labels.map(
												label => label.text
											)
										)
									)
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
									label={lang("Notes")}
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
