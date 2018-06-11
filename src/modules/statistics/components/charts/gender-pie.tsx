import * as React from 'react';

import { colors, statistics } from '../../data';
import { computed, observable } from 'mobx';

import { Chart } from '../../data/interface.chart';
import { Gender } from '../../../patients/data/enum.gender';
import { PieChart } from '../../../../assets/components/charts/pie';
import { appointmentsData } from '../../../appointments';
import { observer } from 'mobx-react';
import { patientsData } from '../../../patients';

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get malePercentile() {
		return this.calculateGenderPercentile(Gender.male);
	}
	@computed
	get femalePercentile() {
		return this.calculateGenderPercentile(Gender.female);
	}
	render() {
		return (
			<PieChart
				showLabels={true}
				showLegend={true}
				height={'400px'}
				labelType={'key'}
				labelsOutside={true}
				{...{
					data: [
						{ label: 'male', value: this.malePercentile, color: '#262626' },
						{ label: 'female', value: this.femalePercentile, color: colors.purple[1] }
					]
				}}
			/>
		);
	}
	calculateGenderPercentile(gender: Gender) {
		return statistics.selectedDays
			.map(
				(day) =>
					appointmentsData.appointments
						.appointmentsForDay(day.getFullYear(), day.getMonth() + 1, day.getDate())
						.filter((appointment) => appointment.patient.gender === gender).length
			)
			.reduce((total, males) => (total = total + males), 0);
	}
}

export const genderPie: Chart = {
	Component,
	name: "Patients' Gender",
	description: 'treated patients gender',
	tags: 'gender patients pie chart'
};
