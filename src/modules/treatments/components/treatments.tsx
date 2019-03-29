import * as React from "react";
import { API } from "../../../core";
import { appointmentsData } from "../../appointments";
import { Col, Row } from "../../../assets/components/grid/index";
import { computed, observable } from "mobx";
import { DataTable } from "../../../assets/components/data-table/data-table.component";
import {
	IconButton,
	Panel,
	PanelType,
	TextField
} from "office-ui-fabric-react";
import { Treatment, treatments } from "../data";
import { observer } from "mobx-react";
import { ProfileSquared } from "../../../assets/components/profile/profile-squared";
import { Section } from "../../../assets/components/section/section";
import { settingsData } from "../../settings";
import "./treatments.scss";
import { lang } from "../../../core/i18/i18";

@observer
export class Treatments extends React.Component<{}, {}> {
	@observable selectedID: string = API.router.currentLocation.split("/")[1];

	@computed
	get canEdit() {
		return API.user.currentUser.canEditTreatments;
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
				<DataTable
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

						const appointments = appointmentsData.appointments.list;

						for (
							let index = 0;
							index < appointments.length;
							index++
						) {
							const appointment = appointments[index];
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
										<ProfileSquared
											text={treatment.type}
											subText={`${lang(
												"Expenses"
											)}: ${settingsData.settings.getSetting(
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
											{settingsData.settings.getSetting(
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
										<ProfileSquared
											text={this.selectedTreatment.type}
											subText={`${lang(
												"Expenses"
											)}: ${settingsData.settings.getSetting(
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
							<Section title={lang("Treatment Details")}>
								<div className="treatment-input">
									<TextField
										label={lang("Treatment title")}
										value={this.selectedTreatment.type}
										onChanged={val =>
											(treatments.list[
												this.selectedIndex
											].type = val)
										}
										disabled={!this.canEdit}
									/>
									<TextField
										label={lang(
											"Treatment expenses (per unit)"
										)}
										type="number"
										value={this.selectedTreatment.expenses.toString()}
										onChanged={val =>
											(treatments.list[
												this.selectedIndex
											].expenses = Number(val))
										}
										prefix={settingsData.settings.getSetting(
											"currencySymbol"
										)}
										disabled={!this.canEdit}
									/>
								</div>
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
