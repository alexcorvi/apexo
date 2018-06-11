import './prompts.scss';

import * as React from 'react';

import { Icon } from 'office-ui-fabric-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import prompts from './data.prompts';

@observer
export class PromptsComponent extends React.Component<{}, {}> {
	render() {
		return (
			<div className="prompts-component">
				{prompts.prompts.map((prompt) => {
					return (
						<div key={prompt.id} className="prompt bottom-bounce">
							<Icon iconName={prompt.iconName || 'Important'} />
							<span className="message">{prompt.message}</span>
							<span className="buttons">
								{prompt.buttons.map((button) => {
									return (
										<a key={button.title} className="button" onClick={() => button.onClick()}>
											{button.iconName ? <Icon iconName={button.iconName} /> : ''}
											{button.title}
										</a>
									);
								})}
							</span>
						</div>
					);
				})}
			</div>
		);
	}
}
