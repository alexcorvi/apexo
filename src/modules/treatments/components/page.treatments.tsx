import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class Treatments extends React.Component {
	@computed
	get canEdit() {
		return core.user.currentUser!.canEditTreatments;
	}

	@computed
	get selectedTreatment() {
		return modules.treatments!.docs.find(
			x => x._id === core.router.selectedID
		);
	}

	render() {
		return (
			<div className="tc-pg">
				<DataTableComponent
					onDelete={
						this.canEdit
							? id => {
									modules.treatments!.deleteModal(id);
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
											const treatment = modules.treatments!.new();
											modules.treatments!.add(treatment);
											core.router.selectID(treatment._id);
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
					heads={[
						text("Treatment"),
						text("Expenses/unit"),
						text("Done appointments"),
						text("Upcoming appointments")
					]}
					rows={modules.treatments!.docs.map(treatment => {
						const now = new Date().getTime();
						let done = 0;
						let upcoming = 0;

						const appointmentsArr = modules.appointments!.docs;

						for (
							let index = 0;
							index < appointmentsArr.length;
							index++
						) {
							const appointment = appointmentsArr[index];
							if (appointment.treatmentID !== treatment._id) {
								continue;
							}
							if (appointment.date > now) {
								upcoming++;
							}
							if (appointment.isDone) {
								done++;
							}
						}

						return {
							id: treatment._id,
							searchableString: treatment.searchableString,
							cells: [
								{
									dataValue: treatment.type,
									component: (
										<ProfileSquaredComponent
											text={treatment.type}
											subText={`${text(
												"Expenses"
											)}: ${modules.setting!.getSetting(
												"currencySymbol"
											)}${treatment.expenses} ${text(
												"per unit"
											)}`}
										/>
									),
									onClick: () => {
										core.router.selectID(treatment._id);
									},
									className: "no-label"
								},
								{
									dataValue: treatment.expenses,
									component: (
										<span>
											{modules.setting!.getSetting(
												"currencySymbol"
											)}
											{treatment.expenses}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: done,
									component: (
										<span>
											{done} {text("done")}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: upcoming,
									component: (
										<span>
											{upcoming} {text("upcoming")}
										</span>
									),
									className: "hidden-xs"
								}
							]
						};
					})}
					maxItemsOnLoad={20}
				/>

				{this.selectedTreatment ? (
					<Panel
						isOpen={!!this.selectedTreatment}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							core.router.unSelect();
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.selectedTreatment ? (
										<ProfileSquaredComponent
											text={this.selectedTreatment.type}
											subText={`${text(
												"Expenses"
											)}: ${modules.setting!.getSetting(
												"currencySymbol"
											)}${
												this.selectedTreatment.expenses
											} ${text("per unit")}`}
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
						)}
					>
						<div className="treatment-editor">
							<SectionComponent title={text("Treatment Details")}>
								<div className="treatment-input">
									<TextField
										label={text("Treatment title")}
										value={this.selectedTreatment.type}
										onChange={(ev, val) =>
											(this.selectedTreatment!.type = val!)
										}
										disabled={!this.canEdit}
										data-testid="treatment-title"
									/>
									<TextField
										label={text(
											"Treatment expenses (per unit)"
										)}
										type="number"
										value={this.selectedTreatment.expenses.toString()}
										onChange={(ev, val) =>
											(this.selectedTreatment!.expenses = num(
												val!
											))
										}
										prefix={modules.setting!.getSetting(
											"currencySymbol"
										)}
										disabled={!this.canEdit}
									/>
								</div>
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
