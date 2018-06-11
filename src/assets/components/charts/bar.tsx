import './styles.scss';

import * as React from 'react';
import * as d3 from 'd3';
import * as nv from 'nvd3';

import { removeToolTips } from './remove-tooltips';

export class BarChart extends React.Component<
	{
		margins?: number[];
		showLegend?: boolean;
		hideYAxis?: boolean;
		hideXAxis?: boolean;
		yAxisLabel?: string;
		xAxisLabel?: string;
		xLabelsFormatter?: (x: number) => any;
		yLabelsFormatter?: (y: number) => any;
		height?: string;
		width?: string;
		reduceXTicks?: boolean;
		showControls?: boolean;
		staggerLabels?: boolean;
		stacked?: boolean;
		horizontal?: boolean;
		data: {
			key: string;
			color: string;
			values?: {
				x: number;
				y: number;
			}[];
			singleValues?: number[];
		}[];
	},
	{}
> {
	private id: string = 'id' + Math.random().toString(32).substr(4);
	private graph() {
		removeToolTips();
		nv.addGraph(() => {
			const margins = this.props.margins || [];
			const chart = (this.props.horizontal ? nv.models.multiBarHorizontalChart() : nv.models.multiBarChart())
				.margin({
					top: margins[0],
					right: margins[1],
					bottom: margins[2],
					left: margins[3]
				})
				.showLegend(!!this.props.showLegend)
				.showControls(!!this.props.showControls)
				.showYAxis(!this.props.hideYAxis)
				.stacked(!!this.props.stacked)
				.showXAxis(!this.props.hideXAxis);

			if (!this.props.horizontal) {
				(chart as nv.MultiBarChart)
					.reduceXTicks(!!this.props.reduceXTicks)
					.staggerLabels(!!this.props.staggerLabels);
			}

			chart.xAxis.axisLabel(this.props.xAxisLabel || '');
			chart.yAxis.axisLabel(this.props.yAxisLabel || '');

			if (this.props.xLabelsFormatter) {
				chart.xAxis.tickFormat(this.props.xLabelsFormatter);
			}
			if (this.props.yLabelsFormatter) {
				chart.yAxis.tickFormat(this.props.yLabelsFormatter);
			}

			for (let index = 0; index < this.props.data.length; index++) {
				const singleValues = this.props.data[index].singleValues;
				if (singleValues) {
					this.props.data[index].values = singleValues.map((v, i) => {
						return { x: i + 1, y: v };
					});
				}
			}
			d3.select('#' + this.id).datum(this.props.data).call(chart);
			nv.utils.windowResize(chart.update);
			return chart;
		});
	}
	render() {
		return (
			<svg
				style={{
					height: this.props.height,
					width: this.props.width
				}}
				id={this.id}
			/>
		);
	}
	componentDidUpdate() {
		this.graph();
	}
	componentDidMount() {
		this.graph();
	}
}
