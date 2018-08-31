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
				if (appointment.isDone) {
					totalExpenses = totalExpenses + appointment.expenses;
				}
				if (appointment.isPaid) {
					totalPayments = totalPayments + appointment.paid;
					totalProfits = totalProfits + appointment.profit;
				}
			}
			totalExpenses = round(totalExpenses);
			totalPayments = round(totalPayments);
			totalProfits = round(totalProfits);
			return {
				label: t4mat({ time: timestamp, format: '{d} {M}' }),
				totalPayments,
				totalExpenses,
				totalProfits
			};
		});
	}
	render() {
		return (
			<LineChart
				{...{
					height: 300,
					data: {
						xLabels: this._unsortedValues.map((x) => x.label),
						lines: [
							{ label: 'Payments', data: this._unsortedValues.map((x) => x.totalPayments) },
							{ label: 'Expenses', data: this._unsortedValues.map((x) => x.totalExpenses) },
							{ label: 'Profits', data: this._unsortedValues.map((x) => x.totalProfits) }
						]
					}
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
