import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics, Treatment, treatments } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{
	selectedTreatments: {
		treatment: Treatment;
		male: number;
		female: number;
		profit: number;
		times: number;
	}[];
}> {
	@computed
	get values() {
		return this.props.selectedTreatments.map((treatment, i) => ({
			x: i,
			y: treatment.profit,
			times: treatment.times,
			title:
				treatments.list[
					treatments.getIndexByID(treatment.treatment._id)
				].type
		}));
	}
	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.values.map(x => x.title),
							bars: [
								{
									label: text("Profits"),
									data: this.values.map(x => x.y)
								},
								{
									label: text("Applied times"),
									data: this.values.map(x => x.times)
								}
							]
						}
					}}
				/>
			</div>
		);
	}
}

export const treatmentsNumberChart: Chart = {
	Component,
	name: "Treatments by profits",
	description: "Treatments by profit",
	tags: "treatments number profit",
	className: "col-xs-12 col-lg-6"
};
