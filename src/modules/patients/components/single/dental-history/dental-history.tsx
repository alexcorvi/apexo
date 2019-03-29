import "./dental-history.scss";

import * as React from "react";

import {
	Dropdown,
	Panel,
	PanelType,
	Toggle,
	IconButton
} from "office-ui-fabric-react";
import { Patient, ToothCondition, conditionToColor } from "../../../data";
import { TeethDeciduousChart, TeethPermanentChart } from "../../index";
import { observable, computed } from "mobx";

import { EditableList } from "../../../../../assets/components/editable-list/editable-list";
import { observer } from "mobx-react";
import { Row, Col } from "../../../../../assets/components/grid/index";
import { Profile } from "../../../../../assets/components/profile/profile";
import { API } from "../../../../../core/index";
import { lang } from "../../../../../core/i18/i18";
import { Section } from "../../../../../assets/components/section/section";

@observer
export class DentalHistory extends React.Component<{ patient: Patient }, {}> {
	@observable viewChart: boolean = true;
	@observable viewToothISO: number = 0;
	@observable triggerUpdate: number = 0;

	@computed get canEdit() {
		return API.user.currentUser.canEditPatients;
	}

	componentWillMount() {
		this.viewToothISO = 0;
	}

	render() {
		return (
			<div className="dental-history teeth">
				<br />
				<Toggle
					defaultChecked={true}
					onText={lang("View graphic chart")}
					offText={lang("View sorted table")}
					onChanged={newVal => {
						this.viewChart = newVal;
					}}
				/>
				<div className="m-t-20">
					{this.viewChart ? (
						<div className="chart">
							<Section title={lang(`Permanent Teeth`)}>
								<TeethPermanentChart
									teeth={this.props.patient.teeth}
									onClick={number =>
										(this.viewToothISO = number)
									}
								/>
							</Section>
							<Section title={lang(`Deciduous Teeth`)}>
								<TeethDeciduousChart
									teeth={this.props.patient.teeth}
									onClick={number =>
										(this.viewToothISO = number)
									}
								/>
							</Section>
						</div>
					) : (
						<div className="tabulated">
							<Section title={lang(`Permanent Teeth`)}>
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
							</Section>
							<Section title={lang(`Deciduous Teeth`)}>
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
							</Section>
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
									<Profile
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
								placeHolder={lang(`Condition`)}
								onChanged={(newVal: any) => {
									this.props.patient.teeth[
										this.viewToothISO
									].condition = newVal.key.toString();
									this.props.patient.triggerUpdate++;
									this.forceUpdate();
								}}
								defaultSelectedKey={
									this.props.patient.teeth[this.viewToothISO]
										.condition
								}
								className="single-tooth-condition"
								options={Object.keys(ToothCondition).map(c => ({
									key: c,
									text: lang(c)
								}))}
								disabled={!this.canEdit}
							/>
							<EditableList
								label={lang("History notes")}
								value={
									this.props.patient.teeth[this.viewToothISO]
										.notes
								}
								disabled={!this.canEdit}
								onChange={e => {
									this.props.patient.teeth[
										this.viewToothISO
									].notes = e;
									this.props.patient.triggerUpdate++;
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
