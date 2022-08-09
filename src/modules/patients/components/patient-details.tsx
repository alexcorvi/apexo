import * as core from "@core";
import { imagesTable, status, text } from "@core";
import * as modules from "@modules";
import { gender, Patient, StaffMember } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	Col,
	getRandomTagType,
	Row,
	SectionComponent,
	TagInputComponent,
} from "@common-components";
import {
	Dropdown,
	Label,
	Link,
	Shimmer,
	TextField,
} from "office-ui-fabric-react";

const EditableListComponent = loadable({
	loading: () => <Shimmer />,
	loader: async () =>
		(await import("common-components/editable-list")).EditableListComponent,
});

@observer
export class PatientDetailsPanel extends React.Component<{
	patient: Patient;
	onChangeViewWhich: (key: string) => void;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	render() {
		return (
			<div className="spd-pn">
				<SectionComponent title={text(`basic info`).h}>
					<Row gutter={8}>
						<Col sm={12}>
							<div className="name">
								<TextField
									label={text(`name`).c}
									value={this.props.patient.name}
									onChange={(ev, name) =>
										(this.props.patient.name = name!)
									}
									disabled={!this.canEdit}
									data-testid="patient-name"
								/>
							</div>
						</Col>
						<Col sm={6}>
							<div className="gender">
								<Dropdown
									label={text("gender").c}
									selectedKey={this.props.patient.gender}
									options={[
										{ key: "male", text: text("male").c },
										{
											key: "female",
											text: text("female").c,
										},
									]}
									onChange={(ev, val) => {
										if (val!.key === "male") {
											this.props.patient.gender = "male";
										} else {
											this.props.patient.gender =
												"female";
										}
									}}
									disabled={!this.canEdit}
								/>
							</div>
						</Col>
						<Col sm={6}>
							<div className="birth">
								<TextField
									label={text("age").c}
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
					</Row>
					<Row gutter={8}>
						<Col sm={8}>
							<TextField
								label={text("phone").c}
								value={this.props.patient.phone}
								onChange={(ev, phone) =>
									(this.props.patient.phone = phone!)
								}
								type="number"
								disabled={!this.canEdit}
							/>
						</Col>
						<Col sm={8}>
							<TextField
								label={text("email").c}
								value={this.props.patient.email}
								onChange={(ev, email) =>
									(this.props.patient.email = email!)
								}
								disabled={!this.canEdit}
							/>
						</Col>
						<Col sm={8}>
							<TextField
								label={text("address").c}
								value={this.props.patient.address}
								onChange={(ev, address) =>
									(this.props.patient.address = address!)
								}
								disabled={!this.canEdit}
							/>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col sm={12}>
							<TagInputComponent
								className="patient-labels"
								disabled={!this.canEdit}
								label={text("labels").c}
								loose
								options={modules
									.patients!.docs.map((x) => x.labels)
									.reduce(
										(a: string[], b) =>
											a.concat(b.map((x) => x.text)),
										[]
									)
									.map((x) => ({
										key: x,
										text: x,
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
													(x) => x.key === item.key
												) === -1
											) {
												arr.push(item);
											}
											return arr;
										},
										[]
									)}
								onChange={(newVal) => {
									this.props.patient.labels = newVal.map(
										(item) => {
											return {
												text: item,
												type: getRandomTagType(item),
											};
										}
									);
								}}
								value={this.props.patient.labels.map(
									(label) => ({
										key: label.text,
										text: label.text,
									})
								)}
							/>
						</Col>
						<Col sm={12}>
							<TagInputComponent
								className="patient-labels"
								disabled={!this.canEdit}
								label={text("notes").c}
								loose
								options={modules
									.patients!.docs.map((x) => x.labels)
									.reduce(
										(a: string[], b) =>
											a.concat(b.map((x) => x.text)),
										[]
									)
									.map((x) => ({
										key: x,
										text: x,
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
													(x) => x.key === item.key
												) === -1
											) {
												arr.push(item);
											}
											return arr;
										},
										[]
									)}
								onChange={(newVal) => {
									this.props.patient.medicalHistory = newVal;
								}}
								value={this.props.patient.medicalHistory.map(
									(label) => ({
										key: label,
										text: label,
									})
								)}
							/>
						</Col>
					</Row>
				</SectionComponent>

				<modules.PatientGalleryPanel
					patient={this.props.patient}
				></modules.PatientGalleryPanel>
			</div>
		);
	}
}
