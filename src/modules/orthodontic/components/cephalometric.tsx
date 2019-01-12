import * as dateUtils from "../../../assets/utils/date";
import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import { computed } from "mobx";
import {
	Dropdown,
	IconButton,
	Panel,
	PanelType,
	PrimaryButton,
	TextField,
	DatePicker
} from "office-ui-fabric-react";
import {
	DentalHistory,
	PatientAppointments,
	PatientDetails
} from "../../patients/components";
import { EditableList } from "../../../assets/components/editable-list/editable-list";
import {
	FacialProfile,
	Lips,
	OralHygiene,
	OrthoCase
} from "../data/class.ortho";
import { Gallery } from "../../../assets/components/gallery/gallery";
import { observer } from "mobx-react";
import { orthoData } from "../index";
import { patientsData } from "../../patients";
import { Profile } from "../../../assets/components/profile/profile";
import { Section } from "../../../assets/components/section/section";
import { TagInput } from "../../../assets/components/tag-input/tag-input";
import "./ortho-single.scss";
import { Patient } from "../../patients/data/class.patient";

@observer
export class Cephalometric extends React.Component<{
	data: string;
	date: number;
	open: boolean;
	patient: Patient;
	onSaveData: (data: string) => void;
	onSaveDate: (date: number) => void;
	onDismiss: () => void;
}> {
	componentDidMount() {
		setTimeout(() => {
			const iFrame: any = document.getElementById("cephalometric");

			iFrame.onload = () => {
				// send the message
				iFrame.contentWindow.postMessage(
					"cephalometric-open:" + this.props.data,
					"*"
				);
			};

			// wait for response
			onmessage = e => {
				if (e.data && typeof e.data === "string") {
					if (e.data.startsWith("cephalometric-save:")) {
						this.props.onSaveData(
							e.data.split("cephalometric-save:")[1]
						);
					}
				}
			};
		}, 100);
	}

	render() {
		return (
			<Panel
				isOpen={this.props.open && !!this.props.data}
				type={PanelType.largeFixed}
				closeButtonAriaLabel="Close"
				isLightDismiss={true}
				onDismiss={this.props.onDismiss}
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
									placeholder="Select a date..."
									value={new Date(this.props.date)}
									onSelectDate={date => {
										if (date) {
											this.props.onSaveDate(
												new Date(date).getTime()
											);
										}
									}}
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
					id="cephalometric"
					src="https://cephalometric.apexo.app"
				/>
			</Panel>
		);
	}
}
