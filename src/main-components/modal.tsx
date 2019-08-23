import { ModalInterface, text } from "@core";
import * as core from "@core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ModalsView extends React.Component {
	@observable inputValue: string = "";

	render() {
		return (
			<div className="modals-component">
				{core.modals.activeModals.map((modal, index) => (
					<Panel
						key={modal.id}
						className={`confirmation-modal ${modal.id} ${
							modal.input ? "input-modal" : ""
						}`}
						data-testid="confirmation-modal"
						isBlocking
						isLightDismiss
						isOpen
						onDismiss={() => {
							core.modals.deleteModal(index);
							if (modal.onDismiss) {
								modal.onDismiss();
							}
						}}
						type={PanelType.smallFluid}
						hasCloseButton={false}
						onRenderHeader={() => <div />}
					>
						<p>{modal.text}</p>
						{modal.input ? (
							<TextField
								value={this.inputValue}
								onChange={(e, val) => {
									this.inputValue = val!;
								}}
								data-testid="modal-input"
							/>
						) : (
							""
						)}

						{modal.showConfirmButton ? (
							<PrimaryButton
								onClick={() => {
									core.modals.deleteModal(index);
									modal.onConfirm(this.inputValue);
									this.inputValue = "";
								}}
								iconProps={{ iconName: "CheckMark" }}
								text={text("Confirm")}
								data-testid="modal-confirm"
							/>
						) : (
							""
						)}
						{modal.showCancelButton ? (
							<DefaultButton
								onClick={() => {
									core.modals.deleteModal(index);
									this.inputValue = "";
									if (modal.onDismiss) {
										modal.onDismiss();
									}
								}}
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
