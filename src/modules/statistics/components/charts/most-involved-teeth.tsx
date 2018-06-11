import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { Chart } from '../../data/interface.chart';
import { PieChart } from '../../../../assets/components/charts/pie';
import { convert } from '../../../../assets/utils/teeth-numbering-systems';
import { observer } from 'mobx-react';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get data() {
		return statistics.selectedAppointments
			.map((x) => x.involvedTeeth)
			.reduce((result: { label: number; value: number }[], arr) => {
				arr.forEach((n) => {
					const fixedN = Number(n.toString().charAt(1));
					const i = result.findIndex((x) => x.label === fixedN);
					if (i === -1) {
						result.push({
							label: fixedN,
							value: 1
						});
					} else {
						result[i].value++;
					}
				});
				return result;
			}, [])
			.sort((a, b) => b.value - a.value)
			.filter((x, i) => i <= 4)
			.map((d, i) => {
				if (i === 0) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.blue[1]
					};
				} else if (i === 1) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.green[1]
					};
				} else if (i === 2) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.greenish[1]
					};
				} else if (i === 3) {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.purple[1]
					};
				} else {
					return {
						label: this.getToothName(d.label),
						value: d.value,
						color: colors.orange[1]
					};
				}
			});
	}
	render() {
		return (
			<PieChart
				donut={true}
				labelType={'key'}
				showLabels={true}
				showLegend={true}
				height={'400px'}
				data={this.data}
			/>
		);
	}
	getToothName(n: number) {
		return convert(Number(`1${n.toString()}`)).Name.replace(/(permanent|deciduous|upper|lower|left|right)/gi, '');
	}
}

export const mostInvolvedTeeth: Chart = {
	Component,
	name: 'Most Involved Teeth',
	description: 'Top 5 most treated teeth',
	tags: 'teeth most involved tooth treated'
};
