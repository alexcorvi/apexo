import { text } from "@core";
import { observer } from "mobx-react";
import { Pivot, PivotItem } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PanelTabs extends React.Component<{
	items: {
		key: string;
		title: string;
		icon: string;
		hidden?: boolean;
	}[];
	onSelect: (key: string) => void;
	currentSelectedKey: string;
}> {
	render() {
		return (
			<div className="panel-tabs">
				<Pivot
					headersOnly
					defaultSelectedKey={this.props.currentSelectedKey}
					onLinkClick={item => {
						if (item && item.props.itemKey) {
							this.props.onSelect(item.props.itemKey);
						}
					}}
				>
					{this.props.items.map((item, index) =>
						item.hidden ? (
							""
						) : (
							<PivotItem
								headerText={
									this.props.currentSelectedKey === item.key
										? text(item.title)
										: undefined
								}
								itemIcon={item.icon}
								itemKey={item.key}
								key={item.key}
							/>
						)
					)}
				</Pivot>
			</div>
		);
	}
}
