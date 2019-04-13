import { Col, Row } from "@common-components";
import {
	menu,
	resync,
	router,
	status,
	text,
	user
	} from "@core";
import { observer } from "mobx-react";
import { Icon, IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class HeaderView extends React.Component<{}, {}> {
	render() {
		return (
			<div className="header-component">
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={() => {
									menu.show();
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
							{text(router.currentNamespace || "Home")}
						</section>
					</Col>
					<Col span={8}>
						<section className="right-buttons">
							{status.online ? (
								<TooltipHost content={text("Sync with server")}>
									<IconButton
										onClick={async () => {
											router.reSyncing = true;
											await resync.resync();
											router.reSyncing = false;
										}}
										iconProps={{ iconName: "Sync" }}
										className={
											router.reSyncing ? "rotate" : ""
										}
										title="Re-Sync"
									/>
								</TooltipHost>
							) : (
								<span className="offline">
									<Icon iconName="WifiWarning4" />
								</span>
							)}

							<TooltipHost content={text("User panel")}>
								<IconButton
									onClick={() => (user.visible = true)}
									disabled={false}
									iconProps={{ iconName: "Contact" }}
								/>
							</TooltipHost>
						</section>
					</Col>
				</Row>
			</div>
		);
	}
}
