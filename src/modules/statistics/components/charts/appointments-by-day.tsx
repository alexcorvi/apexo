import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { BarChart } from '../../../../assets/components/charts/bar';
import { Chart } from '../../data/interface.chart';
import { appointmentsData } from '../../../appointments';
import { observer } from 'mobx-react';
import { patientsData } from '../../../patients';
import t4mat from 't4mat';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get values() {
		const initialValue: { missed: number[]; outstanding: number[]; paid: number[]; days: string[] } = {
			days: [],
			missed: [],
			outstanding: [],
			paid: []
		};

		return statistics.selectedAppointmentsByDay.reduce((acc, val) => {
			acc.paid.push(val.appointments.filter((a) => a.paid).length);
			acc.outstanding.push(val.appointments.filter((a) => a.outstanding).length);
			acc.missed.push(val.appointments.filter((a) => a.missed).length);
			acc.days.push(t4mat({ time: val.day.getTime(), format: '{d} {M}' }));
			return acc;
		}, initialValue);
	}
	render() {
		return (
			<BarChart
				{...{
					height: 400,
					data: {
						xLabels: this.values.days,
						bars: [
							{
								label: 'Missed',
								data: this.values.missed
							},
							{
								label: 'Paid',
								data: this.values.paid
							},
							{
								label: 'Outstanding',
								data: this.values.outstanding
							}
						]
					}
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
