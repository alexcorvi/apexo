import './menu.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { INavProps, Icon, Nav, Panel, PanelType } from 'office-ui-fabric-react';

import { API } from '../';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Profile } from '../../assets/components/profile/profile';
import { menu } from './data.menu';
import { observer } from 'mobx-react';

@observer
export class MenuComponent extends React.Component<any, any> {
	public render() {
		return (
			<div>
				<div className="visible-lg visible-md icon-list">
					{menu.sortedItems.map((item, index) => {
						return (
							<div
								key={index}
								className={'item ' + (menu.currentIndex === index ? 'selected' : '')}
								onClick={item.onClick}
							>
								<Icon iconName={item.icon} />
								<span className="text">{item.name}</span>
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
								links: menu.sortedItems
							}
						]}
						selectedKey={API.router.currentNamespace}
					/>
				</Panel>
			</div>
		);
	}
}
