import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	DataTableComponent,
	PanelTabs,
	PanelTop,
	ProfileSquaredComponent,
	SectionComponent,
} from "@common-components";
import {
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
} from "office-ui-fabric-react";

@observer
export class Treatments extends React.Component {
	tabs = [
		{
			key: "details",
			icon: "cricket",
			title: text("treatment details").h,
		},
		{
			key: "delete",
			icon: "trash",
			title: text("delete").h,
			hidden: !this.canEdit,
		},
	];
	@computed
	get canEdit() {
		return core.user.currentUser!.canEditTreatments;
	}

	@computed
	get selectedTreatment() {
		return modules.treatments!.docs.find(
			(x) => x._id === core.router.selectedID
		);
	}

	render() {
		return (
			<div className="tc-pg">
				<DataTableComponent
					onDelete={
						this.canEdit
							? (id) => {
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
										name: text("add new").c,
										onClick: () => {
											const treatment = modules.treatments!.new();
											modules.treatments!.add(treatment);
											core.router.select({
												id: treatment._id,
												tab: "details",
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
						text("treatment").c,
						text("expenses/unit").c,
						text("done appointments").c,
						text("upcoming appointments").c,
					]}
					rows={modules.treatments!.docs.map((treatment) => {
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
							if (appointment.isUpcoming) {
								upcoming++;
							}
							if (appointment.isDone) {
								done++;
							}
						}

						return {
							id: treatment._id,
							searchableString: treatment.searchableString,
							actions: this.tabs
								.filter((x) => !x.hidden)
								.map((x) => ({
									key: x.key,
									title: x.title,
									icon: x.icon,
									onClick: () => {
										if (x.key === "delete") {
											modules.treatments!.deleteModal(
												treatment._id
											);
										} else {
											core.router.select({
												id: treatment._id,
												tab: x.key,
											});
										}
									},
								})),
							cells: [
								{
									dataValue: treatment.type,
									component: (
										<ProfileSquaredComponent
											text={treatment.type}
											onRenderSecondaryText={() => (
												<span className="itl">{`${
													text("expenses").c
												}: ${modules.setting!.getSetting(
													"currencySymbol"
												)}${treatment.expenses} ${text(
													"per unit"
												)}`}</span>
											)}
										/>
									),
									onClick: () => {
										core.router.select({
											id: treatment._id,
											tab: "details",
										});
									},
									className: "no-label",
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
									className: "hidden-xs",
								},
								{
									dataValue: done,
									component: (
										<span>
											{done} {text("done")}
										</span>
									),
									className: "hidden-xs",
								},
								{
									dataValue: upcoming,
									component: (
										<span>
											{upcoming} {text("upcoming")}
										</span>
									),
									className: "hidden-xs",
								},
							],
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
							<div className="panel-heading">
								<PanelTop
									title={this.selectedTreatment!.type}
									type={text("treatment").c}
									subTitle={`${
										text("expenses").c
									}: ${modules.setting!.getSetting(
										"currencySymbol"
									)}${
										this.selectedTreatment!.expenses
									} ${text("per unit")}`}
									onDismiss={() => core.router.unSelect()}
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
						<div className="treatment-editor">
							{core.router.selectedTab === "details" ? (
								<SectionComponent
									title={text("treatment details").h}
								>
									<div className="treatment-input">
										<TextField
											label={text("treatment title").c}
											value={this.selectedTreatment.type}
											onChange={(ev, val) =>
												(this.selectedTreatment!.type = val!)
											}
											disabled={!this.canEdit}
											data-testid="treatment-title"
										/>
										<TextField
											label={
												text(
													"treatment expenses (per unit)"
												).c
											}
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
											data-testid="treatment-expenses"
										/>
									</div>
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
											modules.treatments!.delete(
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
