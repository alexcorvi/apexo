import { menu, router, text } from "@core";
import { observer } from "mobx-react";
import { Icon, Nav, Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class MenuView extends React.Component<any, any> {
	public render() {
		return (
			<div>
				<div className="visible-lg visible-md icon-list">
					{menu.sortedItems.map((item, index) => {
						return (
							<div
								key={index}
								className={
									"item " +
									(menu.currentIndex === index
										? "selected"
										: "")
								}
								onClick={item.onClick}
							>
								<Icon iconName={item.icon} />
								<span className="text">{text(item.name)}</span>
							</div>
						);
					})}
				</div>
				<Panel
					className="menu"
					isLightDismiss={true}
					isOpen={menu.visible}
					type={PanelType.smallFixedNear}
					onDismiss={() => (menu.visible = false)}
					hasCloseButton={false}
				>
					<Nav
						groups={[
							{
								links: menu.sortedItems.map(x => {
									return {
										icon: x.icon,
										name: text(x.name),
										key: x.key,
										url: x.url,
										onClick: x.onClick
									};
								})
							}
						]}
						selectedKey={router.currentNamespace}
					/>
				</Panel>
			</div>
		);
	}
}
