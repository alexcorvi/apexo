import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, Gender, Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{ selectedPatients: Patient[] }> {
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

export const genderPieChart: Chart = {
	Component,
	name: "Patients' Gender",
	description: "treated patients gender",
	tags: "gender patients pie chart",
	className: "col-xs-12 col-lg-6"
};
