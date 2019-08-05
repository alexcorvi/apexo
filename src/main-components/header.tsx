import { Col, Row } from "@common-components";
import { status, text } from "@core";
import * as core from "@core";
import { observer } from "mobx-react";
import { Icon, IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class HeaderView extends React.Component {
	render() {
		return (
			<div
				className="header-component"
				data-login-type={status.loginType}
			>
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={() => core.menu.show()}
								disabled={false}
								iconProps={{ iconName: "GlobalNavButton" }}
								title="Menu"
								ariaLabel="Menu"
								data-testid="expand-menu"
							/>
						</section>
					</Col>
					<Col span={8}>
						<section className="title">
							{text(core.router.currentNamespace || "Home")}
						</section>
					</Col>
					<Col span={8}>
						<section className="right-buttons">
							{core.status.isOnline.server ? (
								<TooltipHost content={text("Sync with server")}>
									<IconButton
										id="online"
										onClick={async () => {
											core.router.isCurrentlyReSyncing = true;
											// resync on clicking (manual)
											await core.dbAction("resync");
											core.router.isCurrentlyReSyncing = false;
										}}
										iconProps={{ iconName: "Sync" }}
										className={
											core.router.isCurrentlyReSyncing
												? "rotate"
												: ""
										}
										title="Re-Sync"
									/>
								</TooltipHost>
							) : (
								<span className="offline" id="offline">
									<Icon iconName="WifiWarning4" />
								</span>
							)}

							<TooltipHost content={text("User panel")}>
								<IconButton
									onClick={() => core.user.show()}
									iconProps={{ iconName: "Contact" }}
									data-testid="expand-user"
								/>
							</TooltipHost>
						</section>
					</Col>
				</Row>
			</div>
		);
	}
}
