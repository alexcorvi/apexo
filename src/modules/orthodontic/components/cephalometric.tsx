import * as dateUtils from "../../../assets/utils/date";
import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import { computed, observable } from "mobx";
import {
	IconButton,
	Panel,
	PanelType,
	DatePicker,
	Icon
} from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { lang } from "../../../core/i18/i18";
import { CephalometricItem } from "../data/interface.ortho-json";
import { cases } from "../data";

@observer
export class CephalometricEditor extends React.Component<{
	item: CephalometricItem;
	onDismiss: () => void;
}> {
	@observable loading: boolean = true;
	componentDidMount() {
		setTimeout(async () => {
			const iFrame: any = document.getElementById("cephalometric");
			iFrame.onload = () => {
				cases.toCephString(this.props.item).then(cephString => {
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
						this.props.item.pointCoordinates = cases.getCephCoordinates(
							e.data.split("cephalometric-save:")[1]
						);

						this.props.onDismiss();
						cases.triggerUpdate++;
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
				className="external-service-panel"
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
									placeholder={lang("Select a date") + "..."}
									value={new Date(this.props.item.date)}
									onSelectDate={date => {
										if (date) {
											this.props.item.date = new Date(
												date
											).getTime();
										}
									}}
									formatDate={d =>
										dateUtils.unifiedDateFormat(d || 0)
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
