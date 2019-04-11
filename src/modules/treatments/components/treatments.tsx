import "./treatments.scss";
import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { lang, router, user } from "@core";
import { appointments, setting, Treatment, treatments } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class Treatments extends React.Component<{}, {}> {
	@observable selectedID: string = router.currentLocation.split("/")[1];

	@computed
	get canEdit() {
		return user.currentUser.canEditTreatments;
	}

	@computed
	get selectedIndex() {
		return treatments.list.findIndex(x => x._id === this.selectedID);
	}

	@computed
	get selectedTreatment() {
		return treatments.list[this.selectedIndex];
	}

	render() {
		return (
			<div className="treatments-component p-15 p-l-10 p-r-10">
				<DataTableComponent
					onDelete={
						this.canEdit
							? id => {
									treatments.deleteModal(id);
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
											const treatment = new Treatment();
											treatments.list.push(treatment);
											this.selectedID = treatment._id;
										},
										iconProps: {
											iconName: "Add"
										}
									}
							  ]
							: []
					}
					heads={[
						lang("Treatment"),
						lang("Expenses/unit"),
						lang("Done appointments"),
						lang("Upcoming appointments")
					]}
					rows={treatments.list.map(treatment => {
						const now = new Date().getTime();
						let done = 0;
						let upcoming = 0;

						const appointmentsArr = appointments.list;

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
											subText={`${lang(
												"Expenses"
											)}: ${setting.getSetting(
												"currencySymbol"
											)}${treatment.expenses} ${lang(
												"per unit"
											)}`}
										/>
									),
									onClick: () => {
										this.selectedID = treatment._id;
									},
									className: "no-label"
								},
								{
									dataValue: treatment.expenses,
									component: (
										<span>
											{setting.getSetting(
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
											{done} {lang("done")}
										</span>
									),
									className: "hidden-xs"
								},
								{
									dataValue: upcoming,
									component: (
										<span>
											{upcoming} {lang("upcoming")}
										</span>
									),
									className: "hidden-xs"
								}
							]
						};
					})}
					maxItemsOnLoad={30}
				/>

				{this.selectedTreatment ? (
					<Panel
						isOpen={!!this.selectedTreatment}
						type={PanelType.medium}
						closeButtonAriaLabel="Close"
						isLightDismiss={true}
						onDismiss={() => {
							this.selectedID = "";
						}}
						onRenderNavigation={() => (
							<Row className="panel-heading">
								<Col span={20}>
									{this.selectedTreatment ? (
										<ProfileSquaredComponent
											text={this.selectedTreatment.type}
											subText={`${lang(
												"Expenses"
											)}: ${setting.getSetting(
												"currencySymbol"
											)}${
												this.selectedTreatment.expenses
											} ${lang("per unit")}`}
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
						<div className="treatment-editor">
							<SectionComponent title={lang("Treatment Details")}>
								<div className="treatment-input">
									<TextField
										label={lang("Treatment title")}
										value={this.selectedTreatment.type}
										onChange={(ev, val) =>
											(treatments.list[
												this.selectedIndex
											].type = val!)
										}
										disabled={!this.canEdit}
									/>
									<TextField
										label={lang(
											"Treatment expenses (per unit)"
										)}
										type="number"
										value={this.selectedTreatment.expenses.toString()}
										onChange={(ev, val) =>
											(treatments.list[
												this.selectedIndex
											].expenses = num(val!))
										}
										prefix={setting.getSetting(
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
