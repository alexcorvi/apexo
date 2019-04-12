import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics, Treatment, treatments } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: Treatment;
			profit: number;
			times: number;
		}[] = [];
		statistics.selectedAppointments.forEach(appointment => {
			if (!appointment.isPaid || appointment.treatment === undefined) {
				return;
			}
			const i = selectedTreatments.findIndex(
				t => t.treatment._id === appointment.treatment!._id
			);
			if (i === -1) {
				selectedTreatments.push({
					treatment: appointment.treatment,
					profit: appointment.profit,
					times: 1
				});
			} else {
				selectedTreatments[i].times++;
				selectedTreatments[i].profit =
					selectedTreatments[i].profit + appointment.profit;
			}
		});
		return selectedTreatments;
	}
	@computed
	get values() {
		return this.selectedTreatments.map((treatment, i) => ({
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
