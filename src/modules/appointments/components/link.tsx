import './link.scss';

import * as React from 'react';

import { API } from '../../../core';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import formatter from 't4mat';

interface Props {
	time: number;
	format: string;
	className?: string;
	notClickable: boolean;
}

export class DateLink extends React.Component<Props, {}> {
	render() {
		const dateObj = new Date(this.props.time);
		const y = dateObj.getFullYear();
		const m = dateObj.getMonth() + 1;
		const d = dateObj.getDate();
		return (
			<div className={'date-link ' + this.props.className || ''}>
				<a
					onClick={() => {
						if (this.props.notClickable) {
							return;
						}
						API.router.go([ 'appointments', `${y}-${m}-${d}` ]);
					}}
				>
					<span className="icon">
						<Icon iconName="Calendar" />
					</span>
					{formatter({
						time: this.props.time,
						format: this.props.format
					})}
				</a>
			</div>
		);
	}
}
