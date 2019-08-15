import {
	Col,
	DataTableComponent,
	PanelTabs,
	ProfileSquaredComponent,
	Row,
	SectionComponent
	} from "@common-components";
import { text, user } from "@core";
import * as core from "@core";
import { prescriptionItemForm, prescriptions } from "@modules";
import * as modules from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
	Dropdown,
	IconButton,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PrimaryButton,
	TextField
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PrescriptionsPage extends React.Component {
	@computed get selectedPrescription() {
		return modules.prescriptions!.docs.find(
			p => p._id === core.router.selectedID
		);
	}

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
													core.router.selectID(
														newDoc._id,
														"details"
													);
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
										core.router.selectID(
											prescription._id,
											"details"
										);
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

				{this.selectedPrescription ? (
					<Panel
						isOpen={!!this.selectedPrescription}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => (
							<div className="panel-heading">
								<Row>
									<Col span={20}>
										{this.selectedPrescription ? (
											<ProfileSquaredComponent
												text={
													this.selectedPrescription
														.name
												}
												subText={`${
													this.selectedPrescription
														.doseInMg
												}${text("mg")} ${
													this.selectedPrescription
														.timesPerDay
												}X${
													this.selectedPrescription
														.unitsPerTime
												} ${text(
													this.selectedPrescription
														.form
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
												core.router.unSelect();
											}}
										/>
									</Col>
								</Row>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={key => core.router.selectTab(key)}
									items={[
										{
											key: "details",
											icon: "pill",
											title: "Prescription Details"
										},
										{
											key: "delete",
											icon: "trash",
											title: "Delete"
										}
									]}
								/>
							</div>
						)}
					>
						<div className="prescription-editor">
							{core.router.selectedTab === "details" ? (
								<SectionComponent
									title={text("Prescription Details")}
								>
									<TextField
										label={text("Item name")}
										value={this.selectedPrescription.name}
										onChange={(ev, val) =>
											(this.selectedPrescription!.name = val!)
										}
										disabled={!this.canEdit}
									/>

									<Row gutter={8}>
										<Col md={8}>
											<TextField
												label={text("Dosage in mg")}
												type="number"
												value={this.selectedPrescription.doseInMg.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.doseInMg = num(
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
												value={this.selectedPrescription.timesPerDay.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.timesPerDay = num(
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
												value={this.selectedPrescription.unitsPerTime.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.unitsPerTime = num(
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
											this.selectedPrescription.form
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
											this.selectedPrescription!.form = (newValue as any).text;
										}}
									/>
								</SectionComponent>
							) : (
								""
							)}
							{core.router.selectedTab === "delete" ? (
								<div>
									<br />
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										{text(
											"Are you sure you want to delete"
										)}
									</MessageBar>
									<br />
									<PrimaryButton
										className="delete"
										iconProps={{
											iconName: "delete"
										}}
										text={text("Delete")}
										onClick={() => {
											modules.prescriptions!.delete(
												core.router.selectedID
											);
											core.router.unSelect();
										}}
									/>
								</div>
							) : (
								""
							)}
						</div>
					</Panel>
				) : (
					""
				)}
			</div>
		);
	}
}
