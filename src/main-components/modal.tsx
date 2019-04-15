import { modals, text } from "@core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ModalsView extends React.Component<{}, {}> {
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
								onChange={(e, val) => (this.inputValue = val!)}
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
								text={text("Confirm")}
							/>
						) : (
							""
						)}
						{modal.showCancelButton ? (
							<DefaultButton
								onClick={() =>
									modals.activeModals.splice(index, 1)
								}
								iconProps={{ iconName: "Cancel" }}
								text={text("Cancel")}
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
