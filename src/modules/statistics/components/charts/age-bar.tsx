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
			.filter((x) => x.birthYearOrAge)
			.map((x) => {
				if (x.birthYearOrAge === 0) {
				}
				return new Date().getFullYear() - x.birthYearOrAge;
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
			<div>
				<BarChart
					{...{
						height: 400,
						data: {
							xLabels: this.values.map((x) => x.x.toString()),
							bars: [
								{
									data: this.values.map((x) => x.y),
									label: 'Age'
								}
							]
						}
					}}
				/>
			</div>
		);
	}
}

export const ageBar: Chart = {
	Component,
	name: "Patients' Age",
	description: 'Comparing patients age',
	tags: 'patient age patients',
	className: 'col-xs-12 col-lg-6'
};
