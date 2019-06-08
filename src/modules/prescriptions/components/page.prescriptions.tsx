import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import { itemFormToString, PrescriptionItem, prescriptionItemForms, StaffMember, stringToItemForm } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PrescriptionsPage extends React.Component<{
	currentUser: StaffMember;
	currentLocation: string;
	prescriptions: PrescriptionItem[];
	onDelete: (id: string) => void;
	onAdd: (item: PrescriptionItem) => void;
}> {
	@observable selectedID: string = this.props.currentLocation.split("/")[1];

	@computed
	get selectedItem() {
		return this.props.prescriptions.find(x => x._id === this.selectedID);
	}

	@computed get canEdit() {
		return this.props.currentUser.canEditPrescriptions;
	}

	render() {
		return (
			<div className="pc-pg">
				<DataTableComponent
					onDelete={
						this.canEdit
							? id => {
									this.props.onDelete(id);
							  }
							: undefined
					}
					commands={
						this.canEdit
							? [
									{
										key: "addNew",
										title: "Add new",
										name: text("Add new"),
										onClick: () => {
											const prescription = new PrescriptionItem();
											this.props.onAdd(prescription);
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
						text("Item name"),
						text("Dose"),
						text("Frequency"),
						text("Form")
					]}
					rows={this.props.prescriptions.map(prescription => {
						return {
							id: prescription._id,
							searchableString: prescription.searchableString,
							cells: [
								{
									dataValue: prescription.name,
									component: (
										<ProfileSquaredComponent
											text={prescription.name}
											subText={`${
												prescription.doseInMg
											}${text("mg")} ${
												prescription.timesPerDay
											}X${
												prescription.unitsPerTime
											} ${text(
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
											{prescription.doseInMg} {text("mg")}
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
											{text(
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
					maxItemsOnLoad={20}
				/>

				{this.selectedItem ? (
					<Panel
						isOpen={!!this.selectedItem}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedID = "";
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.selectedItem ? (
										<ProfileSquaredComponent
											text={this.selectedItem.name}
											subText={`${
												this.selectedItem.doseInMg
											}${text("mg")} ${
												this.selectedItem.timesPerDay
											}X${
												this.selectedItem.unitsPerTime
											} ${text(
												itemFormToString(
													this.selectedItem.form
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
							<SectionComponent
								title={text("Prescription Details")}
							>
								<TextField
									label={text("Item name")}
									value={this.selectedItem.name}
									onChange={(ev, val) =>
										(this.selectedItem!.name = val!)
									}
									disabled={!this.canEdit}
								/>

								<Row gutter={6}>
									<Col md={8}>
										<TextField
											label={text("Dosage in mg")}
											type="number"
											value={this.selectedItem.doseInMg.toString()}
											onChange={(ev, val) =>
												(this.selectedItem!.doseInMg = num(
													val!
												))
											}
											disabled={!this.canEdit}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label={text("Times per day")}
											type="number"
											value={this.selectedItem.timesPerDay.toString()}
											onChange={(ev, val) =>
												(this.selectedItem!.timesPerDay = num(
													val!
												))
											}
											disabled={!this.canEdit}
										/>
									</Col>
									<Col md={8}>
										<TextField
											label={text("Units per time")}
											type="number"
											value={this.selectedItem.unitsPerTime.toString()}
											onChange={(ev, val) =>
												(this.selectedItem!.unitsPerTime = num(
													val!
												))
											}
											disabled={!this.canEdit}
										/>
									</Col>
								</Row>
								<Dropdown
									disabled={!this.canEdit}
									label={text("Item form")}
									className="form-picker"
									selectedKey={itemFormToString(
										this.selectedItem.form
									)}
									options={prescriptionItemForms.map(form => {
										return {
											key: form,
											text: text(form)
										};
									})}
									onChange={(ev, newValue) => {
										this.selectedItem!.form = stringToItemForm(
											newValue!.text
										);
									}}
								/>
							</SectionComponent>
						</div>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
