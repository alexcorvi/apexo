import { LineChartComponent } from "@common-components";
import { text } from "@core";
import * as modules from "@modules";
import { formatDate, round } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class FinancesByDateChart extends React.Component<{
	selectedFinancesByDay: {
		day: Date;
		appointments: Partial<modules.Appointment>[];
	}[];
	dateFormat: string;
}> {
	@computed
	private get _unsortedValues() {
		return this.props.selectedFinancesByDay.map(dateFinances => {
			const timestamp = dateFinances.day.getTime();
			let totalExpenses = 0;
			let totalPayments = 0;
			let totalProfits = 0;

			for (
				let index = 0;
				index < dateFinances.appointments.length;
				index++
			) {
				const appointment = dateFinances.appointments[index];
				if (appointment.isDone) {
					totalExpenses = totalExpenses + appointment.expenses!;
				}
				if (appointment.isPaid) {
					totalPayments = totalPayments + appointment.paidAmount!;
					totalProfits = totalProfits + appointment.profit!;
				}
			}
			totalExpenses = round(totalExpenses);
			totalPayments = round(totalPayments);
			totalProfits = round(totalProfits);
			return {
				label: formatDate(timestamp, this.props.dateFormat),
				totalPayments,
				totalExpenses,
				totalProfits
			};
		});
	}
	render() {
		return (
			<LineChartComponent
				{...{
					height: 300,
					data: {
						xLabels: this._unsortedValues.map(x => x.label),
						lines: [
							{
								label: text("Payments"),
								data: this._unsortedValues.map(
									x => x.totalPayments
								)
							},
							{
								label: text("Expenses"),
								data: this._unsortedValues.map(
									x => x.totalExpenses
								)
							},
							{
								label: text("Profits"),
								data: this._unsortedValues.map(
									x => x.totalProfits
								)
							}
						]
					}
				}}
			/>
		);
	}
}
