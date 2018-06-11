import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { Chart } from '../../data/interface.chart';
import { LineChart } from '../../../../assets/components/charts/line';
import { appointmentsData } from '../../../appointments';
import { observer } from 'mobx-react';
import { patientsData } from '../../../patients';
import { round } from '../../../../assets/utils/round';
import { settingsData } from '../../../settings';
import t4mat from 't4mat';
import { treatmentsData } from '../../../treatments';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	private get _unsortedValues() {
		return statistics.selectedFinances.map((date) => {
			const timestamp = date.day.getTime();
			let totalExpenses = 0;
			let totalPayments = 0;
			let totalProfits = 0;
			for (let index = 0; index < date.appointments.length; index++) {
				const appointment = date.appointments[index];
				totalExpenses = totalExpenses + appointment.expenses;
				totalPayments = totalPayments + appointment.paid;
				totalProfits = totalProfits + appointment.profit;
			}
			totalExpenses = round(totalExpenses);
			totalPayments = round(totalPayments);
			totalProfits = round(totalProfits);
			return {
				timestamp,
				totalPayments,
				totalExpenses,
				totalProfits
			};
		});
	}
	@computed
	get expensesValues() {
		return this._unsortedValues.map((x) => ({ x: x.timestamp, y: x.totalExpenses }));
	}
	@computed
	get profitValues() {
		return this._unsortedValues.map((x) => ({ x: x.timestamp, y: x.totalProfits }));
	}
	@computed
	get paymentsValues() {
		return this._unsortedValues.map((x) => ({ x: x.timestamp, y: x.totalPayments }));
	}
	render() {
		return (
			<LineChart
				height={'400px'}
				xLabelsFormatter={(x) => t4mat({ time: x, format: '{d} {M}' })}
				yLabelsFormatter={(y) => settingsData.settings.getSetting('currencySymbol') + y}
				showLegend={true}
				{...{
					data: [
						{
							key: 'Expenses',
							color: colors.greenish[0],
							values: this.expensesValues
						},
						{
							key: 'Payments',
							color: colors.purple[0],
							values: this.paymentsValues
						},
						{
							key: 'Profits',
							color: colors.orange[0],
							values: this.profitValues
						}
					]
				}}
			/>
		);
	}
}

export const financesByDate: Chart = {
	Component,
	name: 'Finances by date',
	description: 'A calculation of finances',
	tags: 'net profit by per day date',
	className: 'col-xs-12'
};
