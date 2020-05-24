import { text } from "@core";
import { observer } from "mobx-react";
import { IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class TableActions extends React.Component<{
	items: {
		key: string;
		title: string;
		icon: string;
		hidden?: boolean;
		bubbleContent?: number | string;
	}[];
	onSelect: (key: string) => void;
}> {
	render() {
		return (
			<div className="table-actions hidden-xs">
				{this.props.items.map((item) =>
					item.hidden ? (
						""
					) : (
						<TooltipHost content={item.title} key={item.key}>
							<IconButton
								className={"action-button " + item.key}
								iconProps={{
									iconName: item.icon,
								}}
								onClick={(e) => {
									this.props.onSelect(item.key);
									e.stopPropagation();
								}}
							/>
							{item.bubbleContent ? (
								<span className="bubble">
									{item.bubbleContent}
								</span>
							) : (
								""
							)}
						</TooltipHost>
					)
				)}
			</div>
		);
	}
}
