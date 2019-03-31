import * as React from "react";
import { API } from "../../../core";
import { Col, Row } from "../../../assets/components/grid/index";
import { computed, observable } from "mobx";
import { DataTable } from "../../../assets/components/data-table/data-table.component";
import {
	Dropdown,
	IconButton,
	Panel,
	PanelType,
	TextField
} from "office-ui-fabric-react";
import {
	itemFormToString,
	PrescriptionItem,
	prescriptionItemForms,
	prescriptions,
	stringToItemForm
} from "../data";
import { observer } from "mobx-react";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { Section } from "../../../assets/components/section/section";
import "./prescription-table.scss";
import { lang } from "../../../core/i18/i18";
import { num } from "../../../assets/utils/num";

@observer
export class PrescriptionsTable extends React.Component<{}, {}> {
	@observable showMenu: boolean = true;

	@observable selectedID: string = API.router.currentLocation.split("/")[1];

	@computed
	get selectedIndex() {
		return prescriptions.list.findIndex(x => x._id === this.selectedID);
	}

	@computed
	get selectedPrescription() {
		return prescriptions.list[this.selectedIndex];
	}

	@computed get canEdit() {
		return API.user.currentUser.canEditPrescriptions;
	}

	render() {
		return (
			<div className="prescriptions-component p-15 p-l-10 p-r-10">
				<DataTable
					onDelete={
						this.canEdit
							? id => {
									prescriptions.deleteModal(id);
							  }
							: undefined
					}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: lang("Add new"),
										onClick: () => {
											const prescription = new PrescriptionItem();
											prescriptions.list.push(
												prescription
											);
											this.selectedID = prescription._id;
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
					heads={[
						lang("Item name"),
						lang("Dose"),
						lang("Frequency"),
						lang("Form")
					]}
					rows={prescriptions.list.map(prescription => {
						return {
							id: prescription._id,
							searchableString: prescription.searchableString,
							cells: [
								{
									dataValue: prescription.name,
									component: (
										<ProfileSquared
											text={prescription.name}
											subText={`${
												prescription.doseInMg
											}${lang("mg")} ${
												prescription.timesPerDay
											}X${
												prescription.unitsPerTime
											} ${lang(
												itemFormToString(
													prescription.form
												)
											)}`}
										/>
									),
									onClick: () => {
										this.selectedID = prescription._id;
									},
									className: "no-label"
								},
								{
									dataValue: prescription.doseInMg,
									component: (
										<span>
											{prescription.doseInMg} {lang("mg")}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: prescription.timesPerDay,
									component: (
										<span>
											{prescription.timesPerDay} *{" "}
											{prescription.unitsPerTime}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: prescription.form,
									component: (
										<span>
											{lang(
												itemFormToString(
													prescription.form
												)
											)}
										</span>
									),
									className: "hidden-xs"
								}
							]
						};
					})}
					maxItemsOnLoad={15}
				/>

				{this.selectedPrescription ? (
					<Panel
						isOpen={!!this.selectedPrescription}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedID = "";
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.selectedPrescription ? (
										<ProfileSquared
											text={
												this.selectedPrescription.name
											}
											subText={`${
												this.selectedPrescription
													.doseInMg
											}${lang("mg")} ${
												this.selectedPrescription
													.timesPerDay
											}X${
												this.selectedPrescription
													.unitsPerTime
											} ${lang(
												itemFormToString(
													this.selectedPrescription
														.form
												)
											)}`}
										/>
									) : (
										<p />
									)}
								</Col>
								<Col span={4} className="close">
									<IconButton
										iconProps={{ iconName: "cancel" }}
										onClick={() => {
											this.selectedID = "";
										}}
									/>
								</Col>
							</Row>
						)}
					>
						<div className="prescription-editor">
							<Section title={lang("Prescription Details")}>
								<TextField
									label={lang("Item name")}
									value={this.selectedPrescription.name}
									onChange={(ev, val) =>
										(prescriptions.list[
											this.selectedIndex
										].name = val!)
									}
									disabled={!this.canEdit}
								/>

								<Row gutter={6}>
									<Col md={8}>
										<TextField
											label={lang("Dosage in mg")}
											type="number"
											value={this.selectedPrescription.doseInMg.toString()}
											onChange={(ev, val) =>
												(prescriptions.list[
													this.selectedIndex
												].doseInMg = num(val!))
											}
											disabled={!this.canEdit}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label={lang("Times per day")}
											type="number"
											value={this.selectedPrescription.timesPerDay.toString()}
											onChange={(ev, val) =>
												(prescriptions.list[
													this.selectedIndex
												].timesPerDay = num(val!))
											}
											disabled={!this.canEdit}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label={lang("Units per time")}
											type="number"
											value={this.selectedPrescription.unitsPerTime.toString()}
											onChange={(ev, val) =>
												(prescriptions.list[
													this.selectedIndex
												].unitsPerTime = num(val!))
											}
											disabled={!this.canEdit}
										/>
									</Col>
								</Row>
								<Dropdown
									disabled={!this.canEdit}
									label={lang("Item form")}
									className="form-picker"
									selectedKey={itemFormToString(
										this.selectedPrescription.form
									)}
									options={prescriptionItemForms.map(form => {
										return {
											key: form,
											text: lang(form)
										};
									})}
									onChange={(ev, newValue) => {
										prescriptions.list[
											this.selectedIndex
										].form = stringToItemForm(
											newValue!.text
										);
									}}
								/>
							</Section>
						</div>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
