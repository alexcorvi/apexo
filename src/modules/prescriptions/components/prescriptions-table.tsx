import './prescription-table.scss';

import * as React from 'react';

import {
	PrescriptionItem,
	namespace,
	prescriptions,
	itemFormToString,
	prescriptionItemForms,
	stringToItemForm
} from '../data';
import { Icon, Nav, PrimaryButton, TextField, Panel, PanelType, IconButton, Dropdown } from 'office-ui-fabric-react';
import { computed, observable } from 'mobx';
import { API } from '../../../core';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { escapeRegExp } from '../../../assets/utils/escape-regex';
import { observer } from 'mobx-react';
import { round } from '../../../assets/utils/round';
import { settingsData } from '../../settings';
import { Row, Col } from '../../../assets/components/grid/index';
import { sortArrByProp } from '../../../assets/utils/sort-arr';
import { PrescriptionLink } from './prescription-link';
import { appointmentsData } from '../../appointments';
import { DataTable } from '../../../assets/components/data-table/data-table.component';
import { Profile } from '../../../assets/components/profile/profile';
import { Section } from '../../../assets/components/section/section';

@observer
export class PrescriptionsTable extends React.Component<{}, {}> {
	@observable showMenu: boolean = true;

	@observable selectedID: string = API.router.currentLocation.split('/')[1];

	@computed
	get selectedIndex() {
		return prescriptions.list.findIndex((x) => x._id === this.selectedID);
	}

	@computed
	get selectedPrescription() {
		return prescriptions.list[this.selectedIndex];
	}

	render() {
		return (
			<div className="prescriptions-component p-15 p-l-10 p-r-10">
				<DataTable
					onDelete={(id) => {
						prescriptions.deleteModal(id);
					}}
					commands={[
						{
							key: 'addNew',
							title: 'Add new',
							name: 'Add New',
							onClick: () => {
								const prescription = new PrescriptionItem();
								prescriptions.list.push(prescription);
								this.selectedID = prescription._id;
							},
							iconProps: {
								iconName: 'Add'
							}
						}
					]}
					heads={[ 'Item name', 'Dose', 'Frequency', 'Form' ]}
					rows={prescriptions.list.map((prescription) => {
						return {
							id: prescription._id,
							cells: [
								{
									dataValue: prescription.name,
									component: <PrescriptionLink id={prescription._id} />,
									onClick: () => {
										this.selectedID = prescription._id;
									},
									className: 'no-label'
								},
								{
									dataValue: prescription.doseInMg,
									component: <span>{prescription.doseInMg} mg</span>,
									className: 'hidden-xs'
								},
								{
									dataValue: prescription.timesPerDay,
									component: (
										<span>
											{prescription.timesPerDay} X {prescription.unitsPerTime}
										</span>
									),
									className: 'hidden-xs'
								},
								{
									dataValue: prescription.form,
									component: <span>{itemFormToString(prescription.form)}</span>,
									className: 'hidden-xs'
								}
							]
						};
					})}
				/>

				{this.selectedPrescription ? (
					<Panel
						isOpen={!!this.selectedPrescription}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedID = '';
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.selectedPrescription ? <PrescriptionLink id={this.selectedID} /> : <p />}
								</Col>
								<Col span={4} className="close">
									<IconButton
										iconProps={{ iconName: 'cancel' }}
										onClick={() => {
											this.selectedID = '';
										}}
									/>
								</Col>
							</Row>
						)}
					>
						<div className="prescription-editor">
							<Section title="Prescription details" showByDefault>
								<TextField
									label="Item name"
									value={this.selectedPrescription.name}
									onChanged={(val) => (prescriptions.list[this.selectedIndex].name = val)}
								/>

								<Row gutter={6}>
									<Col md={8}>
										<TextField
											label="Dosage in mg"
											type="number"
											value={this.selectedPrescription.doseInMg.toString()}
											onChanged={(val) =>
												(prescriptions.list[this.selectedIndex].doseInMg = Number(val))}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label="Times per day"
											type="number"
											value={this.selectedPrescription.timesPerDay.toString()}
											onChanged={(val) =>
												(prescriptions.list[this.selectedIndex].timesPerDay = Number(val))}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label="Units per time"
											type="number"
											value={this.selectedPrescription.unitsPerTime.toString()}
											onChanged={(val) =>
												(prescriptions.list[this.selectedIndex].unitsPerTime = Number(val))}
										/>
									</Col>
								</Row>
								<Dropdown
									label="Item form"
									className="form-picker"
									selectedKey={itemFormToString(this.selectedPrescription.form)}
									options={prescriptionItemForms.map((form) => {
										return {
											key: form,
											text: form
										};
									})}
									onChanged={(newValue) => {
										prescriptions.list[this.selectedIndex].form = stringToItemForm(newValue.text);
									}}
								/>
							</Section>
						</div>
					</Panel>
				) : (
					''
				)}
			</div>
		);
	}
}
