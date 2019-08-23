import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { gender, Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class GenderPieChart extends React.Component<{
	selectedPatients: Patient[];
}> {
	@computed
	get malePercentile() {
		return this.calculateGenderPercentile(gender.male);
	}
	@computed
	get femalePercentile() {
		return this.calculateGenderPercentile(gender.female);
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
	calculateGenderPercentile(requiredG: keyof typeof gender) {
		return this.props.selectedPatients.filter(
			patient => patient.gender === requiredG
		).length;
	}
}
