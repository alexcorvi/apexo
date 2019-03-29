import * as React from "react";

import { statistics } from "../../data";
import { computed } from "mobx";

import { BarChart } from "../../../../assets/components/charts/bar";
import { Chart } from "../../data/interface.chart";
import { observer } from "mobx-react";
import t4mat from "t4mat";
import { lang } from "../../../../core/i18/i18";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get values() {
		const initialValue: {
			missed: number[];
			outstanding: number[];
			paid: number[];
			days: string[];
		} = {
			days: [],
			missed: [],
			outstanding: [],
			paid: []
		};

		return statistics.selectedAppointmentsByDay.reduce((acc, val) => {
			acc.paid.push(val.appointments.filter(a => a.isPaid).length);
			acc.outstanding.push(
				val.appointments.filter(a => a.isOutstanding).length
			);
			acc.missed.push(val.appointments.filter(a => a.missed).length);
			acc.days.push(
				t4mat({ time: val.day.getTime(), format: "{d} {M}" })
			);
			return acc;
		}, initialValue);
	}
	render() {
		return (
			<BarChart
				{...{
					height: 400,
					data: {
						xLabels: this.values.days,
						bars: [
							{
								label: lang("Missed"),
								data: this.values.missed
							},
							{
								label: lang("Paid"),
								data: this.values.paid
							},
							{
								label: lang("Outstanding"),
								data: this.values.outstanding
							}
						]
					}
				}}
			/>
		);
	}
}

export const appointmentsByDate: Chart = {
	Component,
	name: lang("Appointments by Date"),
	description: lang("Number of appointments"),
	tags: "appointments date number how many",
	className: "col-xs-12"
};
