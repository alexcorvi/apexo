import * as React from "react";

import { colors, statistics } from "../../data";
import { computed } from "mobx";

import { Chart } from "../../data/interface.chart";
import { PieChart } from "../../../../assets/components/charts/pie";
import { observer } from "mobx-react";
import { treatmentsData } from "../../../treatments";
import { lang } from "../../../../core/i18/i18";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get data() {
		return statistics.selectedAppointments
			.map(x => x.treatmentID)
			.reduce((result: { label: string; value: number }[], id) => {
				const treatment =
					treatmentsData.treatments.list[
						treatmentsData.treatments.getIndexByID(id)
					];
				if (!treatment) {
					return result;
				}
				const label = treatment.type;
				const i = result.findIndex(t => t.label === label);
				if (i === -1) {
					result.push({
						label,
						value: 1
					});
				} else {
					result[i].value++;
				}
				return result;
			}, [])
			.sort((a, b) => b.value - a.value)
			.filter((x, i) => i <= 4)
			.map((d, i) => {
				if (i === 0) {
					return {
						label: d.label,
						value: d.value,
						color: colors.blue[1]
					};
				} else if (i === 1) {
					return {
						label: d.label,
						value: d.value,
						color: colors.green[1]
					};
				} else if (i === 2) {
					return {
						label: d.label,
						value: d.value,
						color: colors.greenish[1]
					};
				} else if (i === 3) {
					return {
						label: d.label,
						value: d.value,
						color: colors.purple[1]
					};
				} else {
					return {
						label: d.label,
						value: d.value,
						color: colors.orange[1]
					};
				}
			});
	}
	render() {
		return <PieChart height={400} data={this.data} />;
	}
}

export const mostAppliedTreatments: Chart = {
	Component,
	name: lang("Most Applied Treatments"),
	description: lang("Top 5 most applied treatments"),
	tags: "most applied used administered treatments",
	className: "col-xs-12 col-lg-6"
};
