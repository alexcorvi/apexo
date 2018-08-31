import './statistics.scss';

import * as React from 'react';

import { Label as ColoredLabel, LabelType } from '../../../assets/components/label/label.component';
import { DatePicker, Dropdown, Label, Pivot, PivotItem, TextField } from 'office-ui-fabric-react';
import { computed, observable } from 'mobx';
import { Row, Col } from '../../../assets/components/grid/index';
import { observer } from 'mobx-react';
import { round } from '../../../assets/utils/round';
import { statistics } from '../data';
import { data } from '../../';

@observer
export class StatisticsComponent extends React.Component<{}, {}> {
	render() {
		return (
			<div className="statistics-component">
				<div className="controls">
					<div className="container-fluid">
						<Row gutter={2}>
							<Col sm={8}>
								<Label>Doctor:</Label>
								<Dropdown
									placeHolder="Filter By Doctor"
									options={[ { key: '', text: 'All Doctors' } ].concat(
										data.doctorsData.doctors.list.map((doctor) => {
											return {
												key: doctor._id,
												text: doctor.name
											};
										})
									)}
									onChanged={(doctor) => {
										statistics.filterByDoctor = doctor.key.toString();
									}}
								/>
							</Col>
							<Col sm={8}>
								<Label>From:</Label>
								<DatePicker
									onSelectDate={(date) => {
										if (date) {
											statistics.startingDate = statistics.getDayStartingPoint(date.getTime());
										}
									}}
									value={new Date(statistics.startingDate)}
								/>
							</Col>
							<Col sm={8}>
								<Label>To:</Label>
								<DatePicker
									onSelectDate={(date) => {
										if (date) {
											statistics.endingDate = statistics.getDayStartingPoint(date.getTime());
										}
									}}
									value={new Date(statistics.endingDate)}
								/>
							</Col>
						</Row>
					</div>
				</div>
				<div className="container-fluid m-t-20 quick">
					<Row>
						<Col sm={6} xs={12}>
							<label>
								Appointments:{' '}
								<ColoredLabel
									text={round(statistics.selectedAppointments.length).toString()}
									type={LabelType.primary}
								/>
							</label>
						</Col>
						<Col sm={6} xs={12}>
							<label>
								Payments:{' '}
								<ColoredLabel
									text={
										data.settingsData.settings.getSetting('currencySymbol') +
										round(statistics.totalPayments).toString()
									}
									type={LabelType.warning}
								/>
							</label>
						</Col>
						<Col sm={6} xs={12}>
							<label>
								Expenses:{' '}
								<ColoredLabel
									text={
										data.settingsData.settings.getSetting('currencySymbol') +
										round(statistics.totalExpenses).toString()
									}
									type={LabelType.danger}
								/>
							</label>
						</Col>
						<Col sm={6} xs={12}>
							<label>
								Profits:{' '}
								<ColoredLabel
									text={
										data.settingsData.settings.getSetting('currencySymbol') +
										round(statistics.totalProfits).toString()
									}
									type={LabelType.success}
								/>
							</label>
						</Col>
					</Row>
				</div>
				<div className="charts container-fluid">
					<div className="row">
						{statistics.charts.map((chart, index) => {
							return (
								<div
									key={index + chart.name}
									className={'chart-wrapper ' + (chart.className || 'col-xs-12 col-md-5 col-lg-4')}
								>
									<div className="chart">
										<div className="graph">{<chart.Component />}</div>
										<div className="name">{chart.name}</div>
										<div className="description">{chart.description}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
