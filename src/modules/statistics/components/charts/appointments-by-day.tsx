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
		return statistics.selectedAppointmentsByDay.map((x) => ({ y: x.appointments.length, x: x.day.getTime() }));
	}
	render() {
		return (
			<BarChart
				height={'400px'}
				xLabelsFormatter={(x) => t4mat({ time: x, format: '{d} {M}' })}
				reduceXTicks={true}
				{...{
					data: [
						{
							key: 'Appointments:',
							color: colors.greenish[0],
							values: this.values
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
