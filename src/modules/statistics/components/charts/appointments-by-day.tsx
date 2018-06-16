import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { BarChart } from '../../../../assets/components/charts/bar';
import { Chart } from '../../data/interface.chart';
import { LineChart } from '../../../../assets/components/charts/line';
import { appointmentsData } from '../../../appointments';
import { observer } from 'mobx-react';
import { patientsData } from '../../../patients';
import t4mat from 't4mat';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get values() {
		type plotValues = { x: number; y: number }[];
		const initialValue: { missed: plotValues; outstanding: plotValues; paid: plotValues } = {
			missed: [],
			outstanding: [],
			paid: []
		};

		return statistics.selectedAppointmentsByDay.reduce((acc, val) => {
			acc.paid.push({ x: val.day.getTime(), y: val.appointments.filter((a) => a.paid).length });
			acc.outstanding.push({ x: val.day.getTime(), y: val.appointments.filter((a) => a.outstanding).length });
			acc.missed.push({ x: val.day.getTime(), y: val.appointments.filter((a) => a.missed).length });
			return acc;
		}, initialValue);
	}
	render() {
		return (
			<BarChart
				height={'400px'}
				xLabelsFormatter={(x) => t4mat({ time: x, format: '{d} {M}' })}
				reduceXTicks
				stacked
				showLegend
				showControls
				staggerLabels
				{...{
					data: [
						{
							key: 'Paid',
							color: colors.green[0],
							values: this.values.paid
						},
						{
							key: 'Outstanding',
							color: colors.yellow[0],
							values: this.values.outstanding
						},
						{
							key: 'Missed',
							color: colors.purple[0],
							values: this.values.missed
						}
					]
				}}
			/>
		);
	}
}

export const appointmentsByDate: Chart = {
	Component,
	name: 'Appointments By Date',
	description: 'Number of appointments',
	tags: 'appointments date number how many',
	className: 'col-xs-12'
};
