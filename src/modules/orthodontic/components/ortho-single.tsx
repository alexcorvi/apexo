import './ortho-single.scss';

import * as React from 'react';
import {
	DatePicker,
	Dropdown,
	Icon,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	Toggle,
	IconButton,
	TooltipHost
} from 'office-ui-fabric-react';
import * as OrthoData from '../data';
import { computed, observable } from 'mobx';
import { DentalHistory, PatientAppointments, PatientDetails } from '../../patients/components';
import { API } from '../../../core';
import { observer } from 'mobx-react';
import { Row, Col } from '../../../assets/components/grid/index';
import { orthoData } from '../index';
import { FacialProfile, Lips, OralHygiene, OrthoCase } from '../data/class.ortho';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { patientsData } from '../../patients';
import { convert } from '../../../assets/utils/teeth-numbering-systems';
import { EditableList } from '../../../assets/components/editable-list/editable-list';
import { Gallery } from '../../../assets/components/gallery/gallery';
import { Profile } from '../../../assets/components/profile/profile';
import { Section } from '../../../assets/components/section/section';
import * as dateUtils from '../../../assets/utils/date';

@observer
export class OrthoSingle extends React.Component<{ id: string; onDismiss: () => void }, {}> {
	/**
	 * case index
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get caseIndex() {
		return orthoData.cases.getIndexByID(this.props.id);
	}

	/**
	 * Selected case
	 * 
	 * @readonly
	 * @memberof SinglePatient
	 */
	@computed
	get orthoCase() {
		return orthoData.cases.list[this.caseIndex] || new OrthoCase();
	}

	render() {
		return (
			<div className="single-patient-component">
				<Panel
					isOpen={this.caseIndex !== -1}
					type={PanelType.medium}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={this.props.onDismiss}
					onRenderNavigation={() => {
						if (!this.orthoCase.patient) {
							return <span />;
						}
						return (
							<Row className="panel-heading">
								<Col span={22}>
									<Profile
										name={this.orthoCase.patient.name}
										secondaryElement={
											<span>Started: {dateUtils.relativeFormat(this.orthoCase.started)}</span>
										}
										size={3}
									/>
								</Col>
								<Col span={2} className="close">
									<IconButton
										iconProps={{ iconName: 'cancel' }}
										onClick={() => {
											this.props.onDismiss();
										}}
									/>
								</Col>
							</Row>
						);
					}}
				>
					{this.orthoCase.patient ? (
						<div className="ortho-single-component">
							<Section title="Patient Details">
								<PatientDetails hideTitle patient={this.orthoCase.patient} />
							</Section>
							<Section title="Dental History">
								<DentalHistory hideTitle patient={this.orthoCase.patient} />
							</Section>
							<Section title="Extraoral Features" showByDefault>
								<Dropdown
									placeHolder="Lips competency"
									options={Object.keys(Lips).map((x) => ({
										key: x,
										text: (Lips as { [key: string]: string })[x]
									}))}
									defaultSelectedKey={this.orthoCase.lips}
									errorMessage={
										this.orthoCase.lips !== 'competent' ? (
											'Problem: Incompetent or partially competent lips are a major esthetic/functional problem for the patient'
										) : (
											''
										)
									}
									onChanged={(has: any) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.lips = has.key;
									}}
								/>
								<Dropdown
									placeHolder="Facial profile"
									options={Object.keys(FacialProfile).map((x) => ({
										key: x,
										text: x
									}))}
									defaultSelectedKey={this.orthoCase.facialProfile}
									errorMessage={
										this.orthoCase.facialProfile !== 'mesocephalic' ? (
											'Problem: Brachycephalic/Dolichocephalic facial profile are not normal'
										) : (
											''
										)
									}
									onChanged={(has: any) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.facialProfile = has.key;
									}}
								/>
								<Dropdown
									placeHolder="Oral hygiene"
									options={Object.keys(OralHygiene).map((x) => ({
										key: x,
										text: x
									}))}
									defaultSelectedKey={this.orthoCase.oralHygiene}
									errorMessage={
										this.orthoCase.oralHygiene === 'bad' ? (
											'Problem: Measures to correct the oral hygiene of the patient must be taken before applying any orthodontic treatment'
										) : (
											''
										)
									}
									onChanged={(has: any) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.oralHygiene = has.key;
									}}
								/>
								<TextField
									min={0}
									max={180}
									value={this.orthoCase.nasioLabialAngle.toString()}
									onChanged={(v) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.nasioLabialAngle = Number(v);
									}}
									type="number"
									prefix="Nasolabial angle"
									errorMessage={
										this.orthoCase.nasioLabialAngle < 90 || this.orthoCase.nasioLabialAngle > 93 ? (
											'Problem: Nasolabial angle must be between 90 and 93 degrees'
										) : (
											''
										)
									}
								/>
							</Section>

							<Section title="Jaw to Jaw Relationship" showByDefault>
								<Dropdown
									placeHolder="Skeletal relationship"
									options={[ 1, 2, 3 ].map((n) => ({
										key: n.toString(),
										text: 'Skeletal relationship: Class ' + n
									}))}
									defaultSelectedKey={this.orthoCase.skeletalRelationship.toString()}
									onChanged={(n) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.skeletalRelationship = Number(n.key);
									}}
									errorMessage={
										this.orthoCase.skeletalRelationship !== 1 ? (
											'Problem: Abnormal Skeletal relationship'
										) : (
											''
										)
									}
								/>
								<Dropdown
									placeHolder="Molars relationship"
									options={[ 1, 2, 3 ].map((n) => ({
										key: n.toString(),
										text: 'Molars relationship: Class ' + n
									}))}
									defaultSelectedKey={this.orthoCase.molarsRelationship.toString()}
									onChanged={(n) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.molarsRelationship = Number(n.key);
									}}
									errorMessage={
										this.orthoCase.molarsRelationship !== 1 ? (
											'Problem: Abnormal Molars relationship'
										) : (
											''
										)
									}
								/>
								<Dropdown
									placeHolder="Canine relationship"
									options={[ 1, 2, 3 ].map((n) => ({
										key: n.toString(),
										text: 'Canine relationship: Class ' + n
									}))}
									defaultSelectedKey={this.orthoCase.canineRelationship.toString()}
									onChanged={(n) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.canineRelationship = Number(n.key);
									}}
									errorMessage={
										this.orthoCase.canineRelationship !== 1 ? (
											'Problem: Abnormal Canine relationship'
										) : (
											''
										)
									}
								/>
							</Section>
							<Section title="Intercuspal Relationships" showByDefault zIndex={2}>
								<TextField
									type="number"
									prefix="Overjet"
									value={this.orthoCase.overJet.toString()}
									onChanged={(n) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.overJet = n;
									}}
									errorMessage={
										this.orthoCase.overJet > 3 || this.orthoCase.overJet < 1 ? (
											'Problem: Overjet must be between 1 and 3 mm'
										) : (
											''
										)
									}
								/>
								<TextField
									type="number"
									prefix="Overbite"
									value={this.orthoCase.overBite.toString()}
									onChanged={(n) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.overBite = n;
									}}
									errorMessage={
										this.orthoCase.overBite > 4 || this.orthoCase.overBite < 2 ? (
											'Problem: Overbite must be between 2 and 4 mm'
										) : (
											''
										)
									}
								/>
								<TagInput
									strict
									placeholder="Cross/Scissors Bite"
									options={patientsData.ISOTeethArr.map((x) => {
										return {
											key: x.toString(),
											text: x.toString()
										};
									})}
									value={Array.from(this.orthoCase.crossScissorBite).map((x) => ({
										key: x.toString(),
										text: x.toString()
									}))}
									onChange={(newValue) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.crossScissorBite = newValue.map((x) => Number(x.key));
									}}
								/>
							</Section>
							<Section title="Space Analysis: Upper Dentition" showByDefault>
								<TextField
									type="number"
									prefix="Space available"
									value={this.orthoCase.u_spaceAvailable.toString()}
									onChanged={(v) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.u_spaceAvailable = Number(v);
									}}
								/>
								<TextField
									type="number"
									prefix="Space required"
									value={this.orthoCase.u_spaceNeeded.toString()}
									onChanged={(v) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.u_spaceNeeded = Number(v);
									}}
								/>
								{this.orthoCase.u_crowding > 0 ? (
									<TextField
										type="number"
										disabled
										className="has-error"
										prefix="Crowding"
										value={this.orthoCase.u_crowding.toString()}
									/>
								) : (
									''
								)}

								{this.orthoCase.u_spacing > 0 ? (
									<TextField
										type="number"
										disabled
										className="has-error"
										prefix="Spacing"
										value={this.orthoCase.u_spacing.toString()}
									/>
								) : (
									''
								)}
							</Section>
							<Section title="Space Analysis: Lower Dentition" showByDefault>
								<TextField
									type="number"
									prefix="Space available"
									value={this.orthoCase.l_spaceAvailable.toString()}
									onChanged={(v) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.l_spaceAvailable = Number(v);
									}}
								/>
								<TextField
									type="number"
									prefix="Space required"
									value={this.orthoCase.l_spaceNeeded.toString()}
									onChanged={(v) => {
										if (!this.orthoCase) {
											return;
										}
										this.orthoCase.l_spaceNeeded = Number(v);
									}}
								/>
								{this.orthoCase.l_crowding > 0 ? (
									<TextField
										type="number"
										disabled
										className="has-error"
										prefix="Crowding"
										value={this.orthoCase.l_crowding.toString()}
									/>
								) : (
									''
								)}

								{this.orthoCase.l_spacing > 0 ? (
									<TextField
										type="number"
										disabled
										className="has-error"
										prefix="Spacing"
										value={this.orthoCase.l_spacing.toString()}
									/>
								) : (
									''
								)}
							</Section>
							<Section title="Problems List" showByDefault>
								<EditableList
									label="Type to add..."
									value={this.orthoCase.problemsList}
									onChange={(v) => {
										if (this.orthoCase) {
											this.orthoCase.problemsList = v;
											this.orthoCase.triggerUpdate++;
										}
									}}
								/>
							</Section>

							<Section title="Progress gallery" showByDefault>
								<Gallery
									gallery={this.orthoCase.orthoGallery}
									onChange={(list) => {
										if (this.orthoCase) {
											this.orthoCase.orthoGallery = list;
										}
									}}
								/>
							</Section>
							<Section title="Treatment plan" zIndex={1} showByDefault>
								<Row gutter={6}>
									<Col span={12}>
										{' '}
										<TagInput
											strict
											placeholder="Extraction teeth"
											options={patientsData.ISOTeethArr.map((x) => {
												return {
													key: x.toString(),
													text: x.toString()
												};
											})}
											value={Array.from(this.orthoCase.treatmentPlan_extraction).map((x) => ({
												key: x.toString(),
												text: x.toString()
											}))}
											onChange={(newValue) => {
												if (!this.orthoCase) {
													return;
												}
												this.orthoCase.treatmentPlan_extraction = newValue.map((x) =>
													Number(x.key)
												);
											}}
										/>
									</Col>
									<Col span={12}>
										{' '}
										<TagInput
											strict
											placeholder="Filling teeth"
											options={patientsData.ISOTeethArr.map((x) => {
												return {
													key: x.toString(),
													text: x.toString()
												};
											})}
											value={Array.from(this.orthoCase.treatmentPlan_fill).map((x) => ({
												key: x.toString(),
												text: x.toString()
											}))}
											onChange={(newValue) => {
												if (!this.orthoCase) {
													return;
												}
												this.orthoCase.treatmentPlan_fill = newValue.map((x) => Number(x.key));
											}}
										/>
									</Col>
								</Row>

								<br />
								<br />
								<h3>Appliances</h3>
								{this.orthoCase.treatmentPlan_appliance.map((appliance, index) => (
									<div key={index}>
										<Row gutter={4}>
											<Col span={22}>
												{' '}
												<TextField
													multiline
													placeholder="Description"
													value={appliance}
													onChanged={(v) => {
														if (this.orthoCase) {
															this.orthoCase.treatmentPlan_appliance[index] = v;
															this.orthoCase.triggerUpdate++;
														}
													}}
												/>
											</Col>
											<Col span={2}>
												{' '}
												<IconButton
													iconProps={{ iconName: 'delete' }}
													onClick={() => {
														if (this.orthoCase) {
															this.orthoCase.treatmentPlan_appliance.splice(index, 1);
															this.orthoCase.triggerUpdate++;
														}
													}}
												/>
											</Col>
										</Row>
									</div>
								))}
								<PrimaryButton
									iconProps={{ iconName: 'add' }}
									onClick={() => {
										if (this.orthoCase) {
											this.orthoCase.treatmentPlan_appliance.push('');
											this.orthoCase.triggerUpdate++;
										}
									}}
								>
									Plan New Appliance
								</PrimaryButton>
							</Section>
							<Section title="Appointments" showByDefault>
								<PatientAppointments hideTitle patient={this.orthoCase.patient} />
							</Section>
						</div>
					) : (
						''
					)}
				</Panel>
			</div>
		);
	}
}
