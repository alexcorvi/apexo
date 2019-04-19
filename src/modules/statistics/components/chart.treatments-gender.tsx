import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Treatment } from "@modules";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class TreatmentsByGenderChart extends React.Component<{
	selectedTreatments: {
		treatment: Treatment;
		male: number;
		female: number;
	}[];
}> {
	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						horizontal: true,
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.props.selectedTreatments.map(
								x => x.treatment.type
							),
							bars: [
								{
									label: text("Male"),
									data: this.props.selectedTreatments.map(
										x => x.male
									)
								},
								{
									label: text("Female"),
									data: this.props.selectedTreatments.map(
										x => x.female * -1
									)
								}
							]
						}
					}}
				/>
			</div>
		);
	}
}
