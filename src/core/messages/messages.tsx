import "./messages.scss";

import * as React from "react";

import { Icon } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import messages from "./data.messages";

@observer
export class MessagesComponent extends React.Component<{}, {}> {
	render() {
		return (
			<div className="messages-component">
				{messages.messages.map(msg => {
					return (
						<div key={msg.id} className="message bottom-bounce">
							<Icon iconName={"Important"} />
							<span className="message-inner">{msg.string}</span>
						</div>
					);
				})}
			</div>
		);
	}
}
