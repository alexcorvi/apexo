import { messages } from "@core";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class MessagesView extends React.Component<{}, {}> {
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
