import * as core from "@core";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class MessagesView extends React.Component {
	render() {
		return (
			<div className="messages-component">
				{core.messages.activeMessages.map(msg => {
					return (
						<div
							key={msg.id}
							className={`message bottom-bounce m-id-${msg.id}`}
							data-testid="message"
						>
							<Icon iconName={"Important"} />
							<span className="message-inner">{msg.text}</span>
						</div>
					);
				})}
			</div>
		);
	}
}
