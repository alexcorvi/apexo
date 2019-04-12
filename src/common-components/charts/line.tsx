import { colors } from "@common-components";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class LineChartComponent extends React.Component<
	{
		height: number;
		data: {
			xLabels: string[];
			lines: {
				label: string;
				data: number[];
			}[];
		};
	},
	{}
> {
	private id: string =
		"id" +
		Math.random()
			.toString(32)
			.substr(4);
	private async graph() {
		const ChartJS = await import("chart.js");
		const Chart: typeof ChartJS = (ChartJS as any).default;
		const ctx = (document.getElementById(
			this.id
		) as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
		const chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: this.props.data.xLabels,
				datasets: this.props.data.lines.map((x, i) => ({
					label: x.label,
					data: x.data,
					borderColor: colors[i],
					backgroundColor: colors[i],
					fill: false
				}))
			},
			options: {
				hover: {
					mode: "nearest",
					intersect: true
				},
				legend: { fullWidth: true }
			}
		});
	}
	render() {
		return (
			<div
				id={this.id + "_container"}
				style={{ height: this.props.height }}
			>
				<canvas
					id={this.id}
					style={{ height: "100%", width: "100%" }}
				/>
			</div>
		);
	}
	componentWillUpdate() {
		(document.getElementById(
			this.id + "_container"
		) as HTMLDivElement).innerHTML = `<canvas id="${
			this.id
		}" style="height: 100%; width: 100%" />`;
	}
	componentDidUpdate() {
		this.graph();
	}
	componentDidMount() {
		this.graph();
	}
}
