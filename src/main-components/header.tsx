import { Col, Row } from "@common-components";
import { text } from "@core";
import { observer } from "mobx-react";
import { Icon, IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class HeaderView extends React.Component<{
	onExpandMenu: () => void;
	onExpandUser: () => void;
	currentNamespace: string;
	isOnline: boolean;
	resync: () => Promise<boolean>;
	onStartReSyncing: () => void;
	onFinishReSyncing: () => void;
	isCurrentlyReSyncing: boolean;
}> {
	render() {
		return (
			<div className="header-component">
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={this.props.onExpandMenu}
								disabled={false}
								iconProps={{ iconName: "GlobalNavButton" }}
								title="GlobalNavButton"
								ariaLabel="GlobalNavButton"
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
										onClick={async () => {
											this.props.onStartReSyncing();
											await this.props.resync();
											this.props.onFinishReSyncing();
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
								<span className="offline">
									<Icon iconName="WifiWarning4" />
								</span>
							)}

							<TooltipHost content={text("User panel")}>
								<IconButton
									onClick={this.props.onExpandUser}
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
