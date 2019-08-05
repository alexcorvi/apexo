import { Col, Row } from "@common-components";
import { text } from "@core";
import { CephalometricItemInterface } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Icon, IconButton, Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class CephalometricEditorPanel extends React.Component<{
	item: CephalometricItemInterface;
	onDismiss: () => void;
	onSave: (coordinates: string) => void;
}> {
	@observable loading: boolean = true;
	componentDidMount() {
		setTimeout(async () => {
			const iFrame: any = document.getElementById("cephalometric");
			iFrame.onload = () => {
				modules
					.orthoCases!.cephLoader(this.props.item)
					.then(cephString => {
						iFrame.contentWindow.postMessage(
							"cephalometric-open:" + cephString,
							"*"
						);
						this.loading = false;
					});
			};

			// wait for response
			onmessage = e => {
				if (e.data && typeof e.data === "string") {
					if (e.data.startsWith("cephalometric-save:")) {
						this.props.onSave(
							JSON.parse(e.data.split("cephalometric-save:")[1])
								.pointCoordinates
						);
						this.props.onDismiss();
					}
				}
			};
		}, 100);
	}

	render() {
		return (
			<Panel
				isOpen={!!this.props.item}
				type={PanelType.largeFixed}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={() => {
					this.props.onDismiss();
				}}
				className="ex-pnl"
				onRenderNavigation={() => {
					return (
						<Row className="panel-heading">
							<Col span={22}>
								<input
									style={{
										height: 0,
										width: 0,
										position: "absolute"
									}}
								/>
								<DatePicker
									placeholder={text("Select a date")}
									value={new Date(this.props.item.date)}
									onSelectDate={date => {
										if (date) {
											this.props.item.date = new Date(
												date
											).getTime();
										}
									}}
									formatDate={d =>
										formatDate(
											d || 0,
											modules.setting!.getSetting(
												"date_format"
											)
										)
									}
								/>
							</Col>
							<Col span={2} className="close">
								<IconButton
									iconProps={{ iconName: "cancel" }}
									onClick={() => {
										this.props.onDismiss();
									}}
								/>
							</Col>
						</Row>
					);
				}}
			>
				<iframe
					style={{ display: this.loading ? "none" : "block" }}
					id="cephalometric"
					src="https://cephalometric.apexo.app"
				/>
				{this.loading ? (
					<div
						style={{
							fontSize: 38,
							marginTop: 60,
							textAlign: "center"
						}}
					>
						<Icon iconName="sync" className="rotate" />
					</div>
				) : (
					""
				)}
			</Panel>
		);
	}
}
