import { colors } from "@common-components";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class BarChartComponent extends React.Component<
	{
		height: number;
		data: {
			xLabels: string[];
			bars: {
				label: string;
				data: number[];
			}[];
		};
		notStacked?: boolean;
		horizontal?: boolean;
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
			type: this.props.horizontal ? "horizontalBar" : "bar",
			data: {
				labels: this.props.data.xLabels,
				datasets: this.props.data.bars.map((x, i) => ({
					label: x.label,
					data: x.data,
					borderColor: colors[i],
					backgroundColor: colors[i],
					fill: false,
					stack: this.props.notStacked ? "stack " + i : "stack 0"
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
