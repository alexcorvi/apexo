import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { BarChart } from '../../../../assets/components/charts/bar';
import { Chart } from '../../data/interface.chart';
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
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: treatmentsData.Treatment;
			profit: number;
			times: number;
		}[] = [];
		statistics.selectedAppointments.forEach((appointment) => {
			const i = selectedTreatments.findIndex((t) => t.treatment._id === appointment.treatment._id);
			if (i === -1) {
				selectedTreatments.push({
					treatment: appointment.treatment,
					profit: appointment.profit,
					times: 1
				});
			} else {
				selectedTreatments[i].times++;
				selectedTreatments[i].profit = selectedTreatments[i].profit + appointment.profit;
			}
		});
		return selectedTreatments;
	}
	@computed
	get values() {
		return this.selectedTreatments.map((treatment, i) => ({
			x: i,
			y: treatment.profit,
			times: treatment.times,
			title: treatmentsData.treatments.list[treatmentsData.treatments.getIndexByID(treatment.treatment._id)].type
		}));
	}
	render() {
		return (
			<BarChart
				height={'400px'}
				xLabelsFormatter={(x) => `${this.values[x].title} (${this.values[x].times})`}
				yLabelsFormatter={(y) => round(y) + settingsData.settings.getSetting('currencySymbol')}
				{...{
					data: [
						{
							key: 'Profit',
							color: colors.blue[0],
							values: this.values
						}
					]
				}}
			/>
		);
	}
}

export const treatments: Chart = {
	Component,
	name: 'Treatments',
	description: 'Treatments by profit',
	tags: 'treatments number profit',
	className: 'col-xs-12 col-lg-6'
};
