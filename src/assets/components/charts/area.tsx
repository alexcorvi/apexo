import './styles.scss';

import * as React from 'react';
import * as d3 from 'd3';
import * as nv from 'nvd3';

import { removeToolTips } from './remove-tooltips';

export class AreaChart extends React.Component<
	{
		useInteractiveGuideline?: boolean;
		margins?: number[];
		showLegend?: boolean;
		showControls?: boolean;
		hideYAxis?: boolean;
		hideXAxis?: boolean;
		yAxisLabel?: string;
		xAxisLabel?: string;
		xLabelsFormatter?: (x: number) => any;
		yLabelsFormatter?: (y: number) => any;
		height?: string;
		width?: string;
		style?: 'stack' | 'stream' | 'expand';
		data: {
			singleValues?: number[];
			values?: { x: number; y: number }[];
			key: string;
			color: string;
		}[];
	},
	{}
> {
	private id: string = 'id' + Math.random().toString(32).substr(4);
	private graph() {
		removeToolTips();
		nv.addGraph(() => {
			const margins = this.props.margins || [];
			const chart = nv.models
				.stackedAreaChart()
				.margin({
					top: margins[0],
					right: margins[1],
					bottom: margins[2],
					left: margins[3]
				})
				.useInteractiveGuideline(!!this.props.useInteractiveGuideline)
				.showControls(!!this.props.showControls)
				.showYAxis(!this.props.hideYAxis)
				.showLegend(!!this.props.showLegend)
				.showXAxis(!this.props.hideXAxis)
				.style(this.props.style || 'stack');

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
					this.props.data[index].values = singleValues.map((y, x) => {
						return { y, x: x + 1 };
					});
				}
			}

			d3.select('#' + this.id).datum(this.props.data).call(chart as any);
			nv.utils.windowResize(chart.update);

			return chart;
		});
	}
	render() {
		return (
			<div>
				<svg
					style={{
						height: this.props.height,
						width: this.props.width
					}}
					id={this.id}
				/>
			</div>
		);
	}
	componentDidUpdate() {
		this.graph();
	}
	componentDidMount() {
		this.graph();
	}
}
