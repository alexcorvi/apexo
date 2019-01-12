import "./single.scss";

import * as React from "react";

import { Panel, PanelType, IconButton } from "office-ui-fabric-react";
import { Patient, patients, genderToString } from "../../data";
import { computed } from "mobx";

import { observer } from "mobx-react";
import { Row, Col } from "../../../../assets/components/grid/index";
import { DentalHistory } from "../dental-history/dental-history";
import { PatientDetails } from "../patient-details/patient-details";
import { PatientAppointments } from "../patient-appointments/patient-appointments";
import { Profile } from "../../../../assets/components/profile/profile";
import { Section } from "../../../../assets/components/section/section";
import { API } from "../../../../core/index";

@observer
export class SinglePatient extends React.Component<
	{ id: string; onDismiss: () => void },
	{}
> {
	@computed
	get patientIndex() {
		return patients.findIndexByID(this.props.id);
	}

	@computed
	get patient() {
		return patients.list[this.patientIndex] || new Patient();
	}

	render() {
		return (
			<div className="single-patient-component">
				<Panel
					isOpen={this.patientIndex !== -1}
					type={PanelType.medium}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={this.props.onDismiss}
					onRenderNavigation={() => {
						return (
							<Row className="panel-heading">
								<Col span={22}>
									<Profile
										name={this.patient.name}
										secondaryElement={
											<span>
												Patient,{" "}
												{genderToString(
													this.patient.gender
												)}{" "}
												- {this.patient.age} years old
											</span>
										}
										size={3}
									/>
								</Col>
								<Col span={2} className="close">
									<IconButton
										iconProps={{ iconName: "cancel" }}
										onClick={() => {
											this.props.onDismiss();
										}}
									/>
								</Col>
							</Row>
						);
					}}
				>
					<Section title="Patient Details" showByDefault>
						<PatientDetails hideTitle patient={this.patient} />
					</Section>
					<Section title="Dental History" showByDefault>
						<DentalHistory hideTitle patient={this.patient} />
					</Section>

					{API.user.currentUser.canViewAppointments ? (
						<Section title="Appointments" showByDefault>
							<PatientAppointments
								hideTitle
								patient={this.patient}
							/>
						</Section>
					) : (
						""
					)}
				</Panel>
			</div>
		);
	}
}
