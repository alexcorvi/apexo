import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { Gender, Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class GenderPieChart extends React.Component<{
	selectedPatients: Patient[];
}> {
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
	calculateGenderPercentile(requiredG: Gender) {
		return this.props.selectedPatients
			.map(patient => patient.gender)
			.filter(patientG => patientG === requiredG)
			.reduce((total, patientG) => (total = total + patientG), 0);
	}
}
