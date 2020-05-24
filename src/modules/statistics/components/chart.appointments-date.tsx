import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Appointment } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class AppointmentsByDateChart extends React.Component<{
	selectedAppointmentsByDay: {
		appointments: Appointment[];
		day: Date;
	}[];
}> {
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
			paid: [],
		};

		return this.props.selectedAppointmentsByDay.reduce((acc, val) => {
			acc.paid.push(
				val.appointments.filter((a) => a.isPaid && !a.isMissed).length
			);
			acc.outstanding.push(
				val.appointments.filter((a) => a.isOutstanding).length
			);
			acc.missed.push(val.appointments.filter((a) => a.isMissed).length);
			acc.days.push(
				formatDate(
					val.day.getTime(),
					modules.setting!.getSetting("date_format")
				)
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
								label: text("missed").c,
								data: this.values.missed,
							},
							{
								label: text("paid").c,
								data: this.values.paid,
							},
							{
								label: text("outstanding").c,
								data: this.values.outstanding,
							},
						],
					},
				}}
			/>
		);
	}
}
