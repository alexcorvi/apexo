import { ModalInterface, text } from "@core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ModalsView extends React.Component<{
	activeModals: ModalInterface[];
	onDismiss: (index: number) => void;
}> {
	@observable inputValue: string = "";

	render() {
		return (
			<div className="modals-component">
				{this.props.activeModals.map((modal, index) => (
					<Panel
						key={modal.id}
						className={`confirmation-modal ${
							modal.input ? "input-modal" : ""
						}`}
						isBlocking
						isLightDismiss
						isOpen
						onDismiss={() => this.props.onDismiss(index)}
						type={PanelType.smallFluid}
						hasCloseButton={false}
						onRenderHeader={() => <div />}
					>
						<p>{modal.text}</p>
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
									this.props.onDismiss(index);
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
								onClick={() => this.props.onDismiss(index)}
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
