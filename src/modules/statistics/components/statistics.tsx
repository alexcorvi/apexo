import "./statistics.scss";

import * as React from "react";

import {
	Label as ColoredLabel,
	LabelType
} from "../../../assets/components/label/label.component";
import { DatePicker, Dropdown, Label } from "office-ui-fabric-react";
import { Row, Col } from "../../../assets/components/grid/index";
import { observer } from "mobx-react";
import { round } from "../../../assets/utils/round";
import { statistics } from "../data";
import { data } from "../../";
import { Section } from "../../../assets/components/section/section";
import { lang } from "../../../core/i18/i18";

@observer
export class StatisticsComponent extends React.Component<{}, {}> {
	render() {
		return (
			<div className="statistics-component">
				<div className="controls">
					<div className="container-fluid">
						<Row gutter={2}>
							<Col sm={8}>
								<Label>{lang("Staff Member")}:</Label>
								<Dropdown
									placeHolder={lang("Filter By Staff Member")}
									defaultValue=""
									options={[
										{ key: "", text: lang("All Members") }
									].concat(
										data.staffData.staffMembers.list.map(
											member => {
												return {
													key: member._id,
													text: member.name
												};
											}
										)
									)}
									onChanged={member => {
										statistics.filterByMember = member.key.toString();
									}}
								/>
							</Col>
							<Col sm={8}>
								<Label>{lang("From")}:</Label>
								<DatePicker
									onSelectDate={date => {
										if (date) {
											statistics.startingDate = statistics.getDayStartingPoint(
												date.getTime()
											);
										}
									}}
									value={new Date(statistics.startingDate)}
								/>
							</Col>
							<Col sm={8}>
								<Label>{lang("To")}:</Label>
								<DatePicker
									onSelectDate={date => {
										if (date) {
											statistics.endingDate = statistics.getDayStartingPoint(
												date.getTime()
											);
										}
									}}
									value={new Date(statistics.endingDate)}
								/>
							</Col>
						</Row>
					</div>
				</div>
				<div className="container-fluid m-t-20 quick">
					<Section title={lang("Quick stats")} showByDefault>
						<Row>
							<Col sm={6} xs={12}>
								<label>
									{lang("Appointments")}:{" "}
									<ColoredLabel
										text={round(
											statistics.selectedAppointments
												.length
										).toString()}
										type={LabelType.primary}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Payments")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalPayments
											).toString()
										}
										type={LabelType.warning}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Expenses")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalExpenses
											).toString()
										}
										type={LabelType.danger}
									/>
								</label>
							</Col>
							<Col sm={6} xs={12}>
								<label>
									{lang("Profits")}:{" "}
									<ColoredLabel
										text={
											data.settingsData.settings.getSetting(
												"currencySymbol"
											) +
											round(
												statistics.totalProfits
											).toString()
										}
										type={LabelType.success}
									/>
								</label>
							</Col>
						</Row>
					</Section>
				</div>
				<div className="charts container-fluid">
					<div className="row">
						{statistics.charts.map((chart, index) => {
							return (
								<div
									key={index + chart.name}
									className={
										"chart-wrapper " +
										(chart.className ||
											"col-xs-12 col-md-5 col-lg-4")
									}
								>
									<Section title={chart.name} showByDefault>
										<chart.Component />
									</Section>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
