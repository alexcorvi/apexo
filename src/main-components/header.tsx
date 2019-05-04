import { Col, Row } from "@common-components";
import { text } from "@core";
import { observer } from "mobx-react";
import { Icon, IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class HeaderView extends React.Component<{
	expandMenu: () => void;
	expandUser: () => void;
	resync: () => Promise<boolean>;
	startReSyncing: () => void;
	finishReSyncing: () => void;
	currentNamespace: string;
	isOnline: boolean;
	isCurrentlyReSyncing: boolean;
}> {
	render() {
		return (
			<div className="header-component">
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={this.props.expandMenu}
								disabled={false}
								iconProps={{ iconName: "GlobalNavButton" }}
								title="GlobalNavButton"
								ariaLabel="GlobalNavButton"
								id="expand-menu"
							/>
						</section>
					</Col>
					<Col span={8}>
						<section className="title">
							{text(this.props.currentNamespace || "Home")}
						</section>
					</Col>
					<Col span={8}>
						<section className="right-buttons">
							{this.props.isOnline ? (
								<TooltipHost content={text("Sync with server")}>
									<IconButton
										id="online"
										onClick={async () => {
											this.props.startReSyncing();
											await this.props.resync();
											this.props.finishReSyncing();
										}}
										iconProps={{ iconName: "Sync" }}
										className={
											this.props.isCurrentlyReSyncing
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
									onClick={this.props.expandUser}
									iconProps={{ iconName: "Contact" }}
									id="expand-user"
								/>
							</TooltipHost>
						</section>
					</Col>
				</Row>
			</div>
		);
	}
}
