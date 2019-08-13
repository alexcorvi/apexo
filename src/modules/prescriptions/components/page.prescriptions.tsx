import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { text, user } from "@core";
import { prescriptionItemForm, prescriptions } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PrescriptionsPage extends React.Component {
	@computed get canEdit() {
		return user.currentUser && user.currentUser.canEditPrescriptions;
	}

	render() {
		return (
			<div className="pc-pg">
				<DataTableComponent
					onDelete={
						this.canEdit
							? id => {
									prescriptions!.deleteModal(id);
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
											const newDoc = prescriptions!.new();
											prescriptions!
												.add(newDoc)
												.then(() => {
													prescriptions!.selectedID =
														newDoc._id;
												});
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
					rows={prescriptions!.docs.map(prescription => {
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
											} ${text(prescription.form)}`}
										/>
									),
									onClick: () => {
										prescriptions!.selectedID =
											prescription._id;
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
										<span>{text(prescription.form)}</span>
									),
									className: "hidden-xs"
								}
							]
						};
					})}
					maxItemsOnLoad={20}
				/>

				{prescriptions!.selectedDoc ? (
					<Panel
						isOpen={!!prescriptions!.selectedDoc}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							prescriptions!.selectedID = "";
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{prescriptions!.selectedDoc ? (
										<ProfileSquaredComponent
											text={
												prescriptions!.selectedDoc.name
											}
											subText={`${
												prescriptions!.selectedDoc
													.doseInMg
											}${text("mg")} ${
												prescriptions!.selectedDoc
													.timesPerDay
											}X${
												prescriptions!.selectedDoc
													.unitsPerTime
											} ${text(
												prescriptions!.selectedDoc.form
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
											prescriptions!.selectedID = "";
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
									value={prescriptions!.selectedDoc.name}
									onChange={(ev, val) =>
										(prescriptions!.selectedDoc!.name = val!)
									}
									disabled={!this.canEdit}
								/>

								<Row gutter={8}>
									<Col md={8}>
										<TextField
											label={text("Dosage in mg")}
											type="number"
											value={prescriptions!.selectedDoc.doseInMg.toString()}
											onChange={(ev, val) =>
												(prescriptions!.selectedDoc!.doseInMg = num(
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
											value={prescriptions!.selectedDoc.timesPerDay.toString()}
											onChange={(ev, val) =>
												(prescriptions!.selectedDoc!.timesPerDay = num(
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
											value={prescriptions!.selectedDoc.unitsPerTime.toString()}
											onChange={(ev, val) =>
												(prescriptions!.selectedDoc!.unitsPerTime = num(
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
									selectedKey={
										prescriptions!.selectedDoc.form
									}
									options={Object.keys(
										prescriptionItemForm
									).map(form => {
										return {
											key: form,
											text: text(form)
										};
									})}
									onChange={(ev, newValue) => {
										prescriptions!.selectedDoc!.form = (newValue as any).text;
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
