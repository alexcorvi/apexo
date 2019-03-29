import "./modal.scss";

import * as React from "react";

import {
	Panel,
	PanelType,
	PrimaryButton,
	TextField
} from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { modals } from "./data.modal";
import { lang } from "../i18/i18";
import { observable } from "mobx";

@observer
export class ModalsComponent extends React.Component<{}, {}> {
	@observable inputValue: string = "";

	render() {
		return (
			<div className="modals-component">
				{modals.activeModals.map((modal, index) => (
					<Panel
						key={modal.id}
						className={`confirmation-modal ${
							modal.input ? "input-modal" : ""
						}`}
						isBlocking
						isLightDismiss
						isOpen
						onDismiss={() => modals.activeModals.splice(index, 1)}
						type={PanelType.smallFluid}
						hasCloseButton={false}
						onRenderHeader={() => <div />}
					>
						<p>{modal.message}</p>
						{modal.input ? (
							<TextField
								value={this.inputValue}
								onChanged={val => (this.inputValue = val)}
							/>
						) : (
							""
						)}

						{modal.showConfirmButton ? (
							<PrimaryButton
								onClick={() => {
									modals.activeModals.splice(index, 1);
									modal.onConfirm(this.inputValue);
								}}
								iconProps={{ iconName: "CheckMark" }}
								text={lang("Confirm")}
							/>
						) : (
							""
						)}
						{modal.showCancelButton ? (
							<PrimaryButton
								onClick={() =>
									modals.activeModals.splice(index, 1)
								}
								iconProps={{ iconName: "Cancel" }}
								text={lang("Cancel")}
							/>
						) : (
							""
						)}
					</Panel>
				))}
			</div>
		);
	}
}
