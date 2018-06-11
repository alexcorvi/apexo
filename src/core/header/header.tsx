import './header.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { API, components } from '../';

import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Row, Col } from 'antd';
import {
	OverflowSet,
	Link,
	IconButton,
	CommandBarButton,
	IOverflowSetItemProps,
	IOverflowSet
} from 'office-ui-fabric-react';

@observer
export class HeaderComponent extends React.Component<{}, {}> {
	@observable reSyncing = false;

	render() {
		return (
			<div className="header-component">
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={() => {
									API.menu.show();
								}}
								disabled={false}
								iconProps={{ iconName: 'GlobalNavButton' }}
								title="GlobalNavButton"
								ariaLabel="GlobalNavButton"
							/>
						</section>
					</Col>
					<Col span={8}>
						<section className="title">{API.router.currentNamespace || 'Home'}</section>
					</Col>
					<Col span={8} style={{ textAlign: 'right' }}>
						{API.router.innerWidth > 385 ? (
							<section className="notifications-button">
								<IconButton
									onClick={() => API.reSyncDBWithRemote()}
									disabled={false}
									iconProps={{ iconName: 'Sync' }}
									className={API.router.reSyncing ? 'rotate' : ''}
									title="Re-Sync"
								/>
								<IconButton
									onClick={() => (API.issues.visible = true)}
									disabled={false}
									iconProps={{ iconName: 'Message' }}
									title="Talk to dev"
								/>
								{(API.issues.list[API.issues.list.length - 1] || {}).notify ? (
									<span onClick={() => (API.issues.visible = true)} className="issue-bubble" />
								) : (
									''
								)}
								<IconButton
									onClick={() => (API.user.visible = true)}
									disabled={false}
									iconProps={{ iconName: 'Contact' }}
									title="Personal Panel"
								/>
							</section>
						) : (
							<OverflowSet
								items={[]}
								overflowItems={[
									{
										key: 'resync',
										name: 'Resync with server',
										icon: 'Sync',
										onClick: () => API.reSyncDBWithRemote()
									},
									{
										key: 'message',
										name: 'Talk to the developer',
										icon: 'Message',
										onClick: () => (API.issues.visible = true)
									},
									{
										key: 'personal',
										name: 'Your account',
										icon: 'Contact',
										onClick: () => (API.user.visible = true)
									}
								]}
								onRenderOverflowButton={(overflowItems: any[] | undefined) => (
									<IconButton
										menuIconProps={{ iconName: 'More' }}
										menuProps={{ items: overflowItems! }}
									/>
								)}
								onRenderItem={(item: any) => (
									<IconButton iconProps={{ iconName: item.icon }}>{item.name}</IconButton>
								)}
							/>
						)}
					</Col>
				</Row>
				<components.UserComponent />
				<components.IssuesComponent />
			</div>
		);
	}
}

// TODO: add a bubble on the notifications icon.
