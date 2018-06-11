import './issue.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TextField, Panel, PanelType } from 'office-ui-fabric-react';

import { API } from '../';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import issues from './data.issues';
import t4mat from 't4mat';

@observer
export class IssuesComponent extends React.Component<{}, {}> {
	@observable toSend = '';

	componentDidUpdate() {
		setTimeout(() => {
			const el = document.querySelectorAll('.issues-component .ms-Panel-content')[0];
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		}, 100);
	}

	render() {
		return (
			<Panel
				className="issues-component"
				type={PanelType.medium}
				isLightDismiss={true}
				isOpen={issues.visible}
				onDismiss={() => (issues.visible = false)}
				hasCloseButton={true}
				headerText="Talk to the developer"
				onRenderHeader={() => {
					return <div />;
				}}
			>
				<br />
				{issues.list.map((issue) => (
					<div key={issue.time} className={`issue${issue.incoming ? ' incoming' : ''}`}>
						<div className="content">{issue.content}</div>
						<div className="time">
							{t4mat({
								time: issue.time,
								format: '{R}'
							})}
						</div>
					</div>
				))}
				<TextField
					className="send-issue"
					value={this.toSend}
					onChanged={(v) => (this.toSend = v)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							issues.sendIssue(this.toSend);
							this.toSend = '';
						}
					}}
				/>
			</Panel>
		);
	}
}
