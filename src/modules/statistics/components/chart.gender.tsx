import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { appointments, Chart, Gender, Patient, statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

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
			<PieChartComponent
				height={400}
				{...{
					data: [
						{ label: text("Male"), value: this.malePercentile },
						{ label: text("Female"), value: this.femalePercentile }
					]
				}}
			/>
		);
	}
	calculateGenderPercentile(gender: Gender) {
		return statistics.selectedDays
			.map(
				day =>
					appointments
						.appointmentsForDay(
							day.getFullYear(),
							day.getMonth() + 1,
							day.getDate()
						)
						.filter(
							appointment =>
								(appointment.patient || new Patient())
									.gender === gender
						).length
			)
			.reduce((total, males) => (total = total + males), 0);
	}
}

export const genderPieChart: Chart = {
	Component,
	name: "Patients' Gender",
	description: "treated patients gender",
	tags: "gender patients pie chart",
	className: "col-xs-12 col-lg-6"
};
