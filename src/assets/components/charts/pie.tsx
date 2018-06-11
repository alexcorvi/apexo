import './styles.scss';

import * as React from 'react';
import * as d3 from 'd3';
import * as nv from 'nvd3';

import { removeToolTips } from './remove-tooltips';

export class PieChart extends React.Component<
	{
		margins?: number[];
		showLegend?: boolean;
		height?: string;
		width?: string;
		labelsOutside?: boolean;
		labelType?: 'key' | 'value' | 'percent';
		showLabels?: boolean;
		pieLabelsOutside?: boolean;
		donut?: boolean;
		donutRatio?: number;
		data: {
			label: string;
			value: number;
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
				.pieChart()
				.margin({
					top: margins[0],
					right: margins[1],
					bottom: margins[2],
					left: margins[3]
				})
				.showLegend(!!this.props.showLegend)
				.labelsOutside(!!this.props.labelsOutside)
				.labelType(this.props.labelType || 'value')
				.showLabels(!!this.props.showLabels)
				.labelsOutside(!!this.props.pieLabelsOutside)
				.donut(!!this.props.donut)
				.donutRatio(this.props.donutRatio || 0.3)
				.x((d) => d.label)
				.y((d) => d.value);

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
