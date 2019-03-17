import * as React from "react";

import { statistics } from "../../data";
import { computed, observable } from "mobx";

import { BarChart } from "../../../../assets/components/charts/bar";
import { Chart } from "../../data/interface.chart";
import { observer } from "mobx-react";
import { treatmentsData } from "../../../treatments";
import { lang } from "../../../../core/i18/i18";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: treatmentsData.Treatment;
			profit: number;
			times: number;
		}[] = [];
		statistics.selectedAppointments.forEach(appointment => {
			if (!appointment.paid || appointment.treatment === undefined) {
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
				treatmentsData.treatments.list[
					treatmentsData.treatments.getIndexByID(
						treatment.treatment._id
					)
				].type
		}));
	}
	render() {
		return (
			<div>
				<BarChart
					{...{
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.values.map(x => x.title),
							bars: [
								{
									label: lang("Profits"),
									data: this.values.map(x => x.y)
								},
								{
									label: lang("Applied times"),
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

export const treatments: Chart = {
	Component,
	name: lang("Treatments by profits"),
	description: lang("Treatments by profit"),
	tags: "treatments number profit",
	className: "col-xs-12 col-lg-6"
};
