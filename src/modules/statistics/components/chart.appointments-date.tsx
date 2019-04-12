import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, setting, statistics } from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

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
				formatDate(val.day.getTime(), setting.getSetting("date_format"))
			);
			return acc;
		}, initialValue);
	}
	render() {
		return (
			<BarChartComponent
				{...{
					height: 400,
					data: {
						xLabels: this.values.days,
						bars: [
							{
								label: text("Missed"),
								data: this.values.missed
							},
							{
								label: text("Paid"),
								data: this.values.paid
							},
							{
								label: text("Outstanding"),
								data: this.values.outstanding
							}
						]
					}
				}}
			/>
		);
	}
}

export const appointmentsByDateChart: Chart = {
	Component,
	name: "Appointments by Date",
	description: "Number of appointments",
	tags: "appointments date number how many",
	className: "col-xs-12"
};
