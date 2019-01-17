import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import { IconButton, Panel, PanelType } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { Profile } from "../../../assets/components/profile/profile";
import "./ortho-single.scss";
import { Patient } from "../../patients/data/class.patient";
import setting from "../../settings/data/data.settings";

@observer
export class Orthograph extends React.Component<{
	open: boolean;
	patient: Patient;
	onDismiss: () => void;
}> {
	render() {
		return (
			<Panel
				isOpen={this.props.open}
				type={PanelType.largeFixed}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={this.props.onDismiss}
				className="external-service-panel"
				onRenderNavigation={() => {
					return (
						<Row className="panel-heading">
							<Col span={22}>
								<Profile
									name={this.props.patient.name}
									secondaryElement={
										<span>Orthograph Album</span>
									}
									size={3}
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
					id="orthograph"
					src={`https://orthograph.apexo.app/#!/${setting.getSetting(
						"dropbox_accessToken"
					)}/@id:${encodeURI(
						this.props.patient._id
					)}@title:apexo-album`}
				/>
			</Panel>
		);
	}
}
