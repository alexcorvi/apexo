import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { BarChart } from '../../../../assets/components/charts/bar';
import { Chart } from '../../data/interface.chart';
import { observer } from 'mobx-react';
import t4mat from 't4mat';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get missedAppointments() {
		return statistics.selectedAppointments.filter((x) => x.missed).map((x) => ({ value: 1, date: x.date }));
	}
	@computed
	get values() {
		return this.missedAppointments.reduce((result: { x: number; y: number; n: number }[], single) => {
			const x = statistics.getDayStartingPoint(single.date);
			const i = result.findIndex((point) => point.x === x);
			if (i === -1) {
				result.push({ x, y: single.value, n: 1 });
			} else {
				result[i].n++;
				result[i].y = result[i].y + single.value;
			}
			return result;
		}, []);
	}
	render() {
		return (
			<BarChart
				stacked={true}
				height={'400px'}
				xLabelsFormatter={(x) => t4mat({ time: x, format: `{dd} {M}: ${this.getNumberByTime(x)}` })}
				{...{
					data: [
						{
							key: 'Number of missed appointments',
							color: '#262626',
							values: this.values
						}
					]
				}}
			/>
		);
	}
	getNumberByTime(t: number) {
		return (this.values.find((x) => x.x === t) || { n: 1 }).n;
	}
}

export const missedAppointments: Chart = {
	Component,
	name: 'Missed Appointments',
	description: 'Number of missed appointments',
	tags: 'missed patient appointments per date'
};
