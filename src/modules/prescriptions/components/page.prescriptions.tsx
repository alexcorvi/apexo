import { text, user } from "@core";
import * as core from "@core";
import { prescriptionItemForm, prescriptions } from "@modules";
import * as modules from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	Col,
	DataTableComponent,
	PanelTabs,
	PanelTop,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
} from "@common-components";
import {
	Dropdown,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
} from "office-ui-fabric-react";

@observer
export class PrescriptionsPage extends React.Component {
	tabs = [
		{
			key: "details",
			icon: "pill",
			title: text("prescription details").c,
		},
		{
			key: "delete",
			icon: "trash",
			title: text("delete").c,
			hidden: !this.canEdit,
		},
	];
	@computed get selectedPrescription() {
		return modules.prescriptions!.docs.find(
			(p) => p._id === core.router.selectedID
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
							? (id) => {
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
										name: text("add new").c,
										onClick: () => {
											const newDoc = prescriptions!.new();
											prescriptions!
												.add(newDoc)
												.then(() => {
													core.router.select({
														id: newDoc._id,
														tab: "details",
													});
												});
										},
										iconProps: {
											iconName: "Add",
										},
									},
							  ]
							: []
					}
					heads={[
						text("item name").c,
						text("dose").c,
						text("frequency").c,
						text("form").c,
					]}
					rows={prescriptions!.docs.map((prescription) => {
						return {
							id: prescription._id,
							searchableString: prescription.searchableString,
							actions: this.tabs
								.filter((x) => !x.hidden)
								.map((x) => ({
									key: x.key,
									title: x.title,
									icon: x.icon,
									onClick: () => {
										if (x.key === "delete") {
											modules.prescriptions!.deleteModal(
												prescription._id
											);
										} else {
											core.router.select({
												id: prescription._id,
												tab: x.key,
											});
										}
									},
								})),
							cells: [
								{
									dataValue: prescription.name,
									component: (
										<ProfileSquaredComponent
											text={prescription.name}
											onRenderSecondaryText={() => (
												<span className="itl">
													{`${prescription.doseInMg}${
														text("mg").r
													} ${
														prescription.timesPerDay
													}X${
														prescription.unitsPerTime
													} ${
														text(
															prescription.form as any
														).c
													}`}
												</span>
											)}
										/>
									),
									onClick: () => {
										core.router.select({
											id: prescription._id,
											tab: "details",
										});
									},
									className: "no-label",
								},
								{
									dataValue: prescription.doseInMg,
									component: (
										<span>
											{prescription.doseInMg}{" "}
											{text("mg").r}
										</span>
									),
									className: "hidden-xs",
								},
								{
									dataValue: prescription.timesPerDay,
									component: (
										<span>
											{prescription.timesPerDay} *{" "}
											{prescription.unitsPerTime}
										</span>
									),
									className: "hidden-xs",
								},
								{
									dataValue: prescription.form,
									component: (
										<span>
											{text(prescription.form as any).c}
										</span>
									),
									className: "hidden-xs",
								},
							],
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
								<PanelTop
									title={this.selectedPrescription!.name}
									type={text("prescription").c}
									subTitle={`${
										this.selectedPrescription!.doseInMg
									}${text("mg")} - ${
										this.selectedPrescription!.timesPerDay
									}*${
										this.selectedPrescription!.unitsPerTime
									} ${
										text(
											this.selectedPrescription!
												.form as any
										).c
									}`}
									onDismiss={() => core.router.unSelect()}
									square
								/>
								<PanelTabs
									currentSelectedKey={core.router.selectedTab}
									onSelect={(key) =>
										core.router.select({ tab: key })
									}
									items={this.tabs}
								/>
							</div>
						)}
					>
						<div className="prescription-editor">
							{core.router.selectedTab === "details" ? (
								<SectionComponent
									title={text("prescription details").h}
								>
									<TextField
										label={text("item name").c}
										value={this.selectedPrescription.name}
										onChange={(ev, val) =>
											(this.selectedPrescription!.name =
												val!)
										}
										disabled={!this.canEdit}
										data-testid="rx-name"
									/>

									<Row gutter={8}>
										<Col md={8}>
											<TextField
												label={text("dosage in mg").c}
												type="number"
												value={this.selectedPrescription.doseInMg.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.doseInMg =
														num(val!))
												}
												disabled={!this.canEdit}
												data-testid="rx-dose"
											/>
										</Col>
										<Col md={8}>
											<TextField
												label={text("times per day").c}
												type="number"
												value={this.selectedPrescription.timesPerDay.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.timesPerDay =
														num(val!))
												}
												disabled={!this.canEdit}
												data-testid="rx-times"
											/>
										</Col>
										<Col md={8}>
											<TextField
												label={text("units per time").c}
												type="number"
												value={this.selectedPrescription.unitsPerTime.toString()}
												onChange={(ev, val) =>
													(this.selectedPrescription!.unitsPerTime =
														num(val!))
												}
												disabled={!this.canEdit}
												data-testid="rx-units"
											/>
										</Col>
									</Row>
									<Dropdown
										disabled={!this.canEdit}
										label={text("item form").c}
										className="form-picker"
										selectedKey={
											this.selectedPrescription.form
										}
										options={Object.keys(
											prescriptionItemForm
										).map((form) => {
											return {
												key: form,
												text: text(form as any).c,
											};
										})}
										onChange={(ev, newValue) => {
											this.selectedPrescription!.form = (
												newValue as any
											).key;
										}}
										data-testid="rx-form"
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
										{
											text(
												"are you sure you want to delete"
											).c
										}
									</MessageBar>
									<br />
									<PrimaryButton
										className="delete"
										iconProps={{
											iconName: "delete",
										}}
										text={text("delete").c}
										onClick={() => {
											modules.prescriptions!.delete(
												core.router.selectedID
											);
											core.router.unSelect();
										}}
										disabled={!this.canEdit}
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
