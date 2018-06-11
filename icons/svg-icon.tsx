import * as React from 'react';
import * as icons from './svg-tsx/_index';

export class SVGIcon extends React.Component<{ icon: keyof typeof icons }> {
	render() {
		return icons[this.props.icon];
	}
}
