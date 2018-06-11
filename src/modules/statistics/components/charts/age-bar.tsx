import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { BarChart } from '../../../../assets/components/charts/bar';
import { Chart } from '../../data/interface.chart';
import { appointmentsData } from '../../../appointments';
import { observer } from 'mobx-react';
import { patientsData } from '../../../patients';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get values() {
		return statistics.selectedPatients
			.filter((x) => x.birthYear)
			.map((x) => {
				if (x.birthYear === 0) {
				}
				return new Date().getFullYear() - x.birthYear;
			})
			.reduce((result: { x: number; y: number }[], occ) => {
				const i = result.findIndex((rOCC) => rOCC.x === occ);
				if (i === -1) {
					result.push({
						x: occ,
						y: 1
					});
				} else {
					result[i].y++;
				}
				return result;
			}, [])
			.sort((a, b) => a.x - b.x);
	}
	render() {
		return (
			<BarChart
				height={'400px'}
				{...{
					data: [
						{
							key: 'Patients: ',
							color: '#262626',
							values: this.values
						}
					]
				}}
			/>
		);
	}
}

export const ageBar: Chart = {
	Component,
	name: "Patients' Age",
	description: 'Comparing patients age',
	tags: 'patient age patients'
};
