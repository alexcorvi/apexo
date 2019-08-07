import { Col, ProfileComponent, Row, SectionComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { conditionToColor, Patient, StaffMember, ToothCondition } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	Dropdown,
	IconButton,
	Panel,
	PanelType,
	Shimmer,
	Toggle
	} from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const EditableListComponent = loadable({
	loading: () => <Shimmer />,
	loader: async () =>
		(await import("common-components/editable-list/editable-list"))
			.EditableListComponent
});

const TeethDeciduousChart = loadable({
	loader: async () =>
		(await import("modules/patients/components/teeth-deciduous"))
			.TeethDeciduousChart,
	loading: () => <Shimmer />
});

const TeethPermanentChart = loadable({
	loader: async () =>
		(await import("modules/patients/components/teeth-permanent"))
			.TeethPermanentChart,
	loading: () => <Shimmer />
});

@observer
export class DentalHistoryPanel extends React.Component<
	{
		patient: Patient;
	},
	{}
> {
	@observable viewChart: boolean = true;
	@observable viewToothISO: number = 0;

	@computed get canEdit() {
		return core.user.currentUser!.canEditPatients;
	}

	componentWillMount() {
		this.viewToothISO = 0;
	}

	render() {
		return (
			<div className="dental-history teeth m-t-10">
				<div>
					<Toggle
						defaultChecked={true}
						onText={text("View graphic chart")}
						offText={text("View sorted table")}
						onChange={(ev, newVal) => {
							this.viewChart = newVal!;
						}}
					/>
					{this.viewChart ? (
						<div className="chart">
							<SectionComponent title={text(`Permanent Teeth`)}>
								<TeethPermanentChart
									teeth={this.props.patient.teeth}
									onClick={number =>
										(this.viewToothISO = number)
									}
								/>
							</SectionComponent>
							<SectionComponent title={text(`Deciduous Teeth`)}>
								<TeethDeciduousChart
									teeth={this.props.patient.teeth}
									onClick={number =>
										(this.viewToothISO = number)
									}
								/>
							</SectionComponent>
						</div>
					) : (
						<div className="tabulated">
							<SectionComponent title={text(`Permanent Teeth`)}>
								<table className="permanent">
									<tbody>
										<tr>
											{[
												this.mapQuadrant(11, 18, true),
												this.mapQuadrant(21, 28, false)
											]}
										</tr>
										<tr>
											{[
												this.mapQuadrant(41, 48, true),
												this.mapQuadrant(31, 38, false)
											]}
										</tr>
									</tbody>
								</table>
							</SectionComponent>
							<SectionComponent title={text(`Deciduous Teeth`)}>
								<table className="deciduous">
									<tbody>
										<tr>
											{[
												this.mapQuadrant(51, 55, true),
												this.mapQuadrant(61, 65, false)
											]}
										</tr>
										<tr>
											{[
												this.mapQuadrant(81, 85, true),
												this.mapQuadrant(71, 75, false)
											]}
										</tr>
									</tbody>
								</table>
							</SectionComponent>
						</div>
					)}
				</div>

				<Panel
					isOpen={!!this.props.patient.teeth[this.viewToothISO]}
					type={PanelType.smallFixedFar}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => (this.viewToothISO = 0)}
					onRenderNavigation={() => {
						const tooth = this.props.patient.teeth[
							this.viewToothISO
						];

						return (
							<Row className="panel-heading">
								<Col span={22}>
									<ProfileComponent
										name={`ISO: ${
											tooth ? tooth.ISO : ""
										} - Universal: ${
											tooth ? tooth.Universal : ""
										}`}
										secondaryElement={
											<span>
												{tooth
													? tooth.Name.split(" ")
															.filter((x, i) => i)
															.join(" ")
													: ""}
											</span>
										}
										onRenderInitials={() => (
											<span className="palmer">
												{tooth ? tooth.Palmer : ""}
											</span>
										)}
										size={3}
									/>
								</Col>
								<Col span={2} className="close">
									<IconButton
										iconProps={{ iconName: "cancel" }}
										onClick={() => {
											this.viewToothISO = 0;
										}}
									/>
								</Col>
							</Row>
						);
					}}
				>
					<br />
					<br />
					{this.props.patient.teeth[this.viewToothISO] ? (
						<div className="tooth-details">
							<Dropdown
								placeholder={text(`Condition`)}
								onChange={(ev, newVal: any) => {
									this.props.patient.teeth[
										this.viewToothISO
									].condition = newVal.key.toString();
									this.props.patient.saveToPouch();
								}}
								selectedKey={
									this.props.patient.teeth[this.viewToothISO]
										.condition
								}
								className="single-tooth-condition"
								options={Object.keys(ToothCondition).map(c => ({
									key: c,
									text: text(c)
								}))}
								disabled={!this.canEdit}
							/>
							<EditableListComponent
								label={text("History notes")}
								value={
									this.props.patient.teeth[this.viewToothISO]
										.notes
								}
								disabled={!this.canEdit}
								onChange={e => {
									this.props.patient.teeth[
										this.viewToothISO
									].notes = e;
									this.props.patient.saveToPouch();
								}}
							/>
						</div>
					) : (
						""
					)}
				</Panel>
			</div>
		);
	}

	mapQuadrant(min: number, max: number, reverse: boolean) {
		let arr = this.props.patient.teeth;
		arr = arr.filter(tooth => tooth.ISO >= min && tooth.ISO <= max);
		arr = reverse ? arr.reverse() : arr;
		return arr.map(tooth => (
			<td
				key={"tooth" + tooth.ISO}
				style={{ background: conditionToColor(tooth.condition) }}
				onClick={() => (this.viewToothISO = tooth.ISO)}
			>
				<span
					className="has-notes"
					style={tooth.notes.length ? {} : { display: "none" }}
				/>
				{tooth.ISO}
			</td>
		));
	}
}
