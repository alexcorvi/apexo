import "./header.scss";

import * as React from "react";

import { API, components } from "../";
import { resync } from "../db";
import { observer } from "mobx-react";
import { Row, Col } from "../../assets/components/grid/index";
import {
	OverflowSet,
	Link,
	IconButton,
	CommandBarButton,
	IOverflowSetItemProps,
	IOverflowSet,
	Icon
} from "office-ui-fabric-react";
import { isOnline } from "../../assets/utils/is-online";
import { lang } from "../i18/i18";

@observer
export class HeaderComponent extends React.Component<{}, {}> {
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
								iconProps={{ iconName: "GlobalNavButton" }}
								title="GlobalNavButton"
								ariaLabel="GlobalNavButton"
							/>
						</section>
					</Col>
					<Col span={8}>
						<section className="title">
							{lang(API.router.currentNamespace || "Home")}
						</section>
					</Col>
					<Col span={8}>
						<section className="right-buttons">
							{API.login.online ? (
								<IconButton
									onClick={async () => {
										API.router.reSyncing = true;
										await resync.resync();
										API.router.reSyncing = false;
									}}
									iconProps={{ iconName: "Sync" }}
									className={
										API.router.reSyncing ? "rotate" : ""
									}
									title="Re-Sync"
								/>
							) : (
								<span className="offline">
									<Icon iconName="WifiWarning4" />
								</span>
							)}

							<IconButton
								onClick={() => (API.user.visible = true)}
								disabled={false}
								iconProps={{ iconName: "Contact" }}
								title="Personal Panel"
							/>
						</section>
					</Col>
				</Row>
				<components.UserComponent />
			</div>
		);
	}
}
