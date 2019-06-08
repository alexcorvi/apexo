import { text } from "@core";
import { action, observable } from "mobx";
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
	}[];
	onSelect: (key: string) => void;
}> {
	render() {
		return (
			<div className="table-actions">
				{this.props.items.map((item, index) =>
					item.hidden ? (
						""
					) : (
						<TooltipHost content={text(item.title)} key={item.key}>
							<IconButton
								className="action-button"
								iconProps={{
									iconName: item.icon
								}}
								onClick={e => {
									this.props.onSelect(item.key);
									e.stopPropagation();
								}}
							/>
						</TooltipHost>
					)
				)}
			</div>
		);
	}
}
