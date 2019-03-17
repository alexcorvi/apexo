import "./modal.scss";

import * as React from "react";

import { Panel, PanelType, PrimaryButton } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { modals } from "./data.modal";
import { lang } from "../i18/i18";

@observer
export class ModalsComponent extends React.Component<{}, {}> {
	render() {
		return (
			<div className="modals-component">
				{modals.activeModals.map((modal, index) => (
					<Panel
						key={modal.id}
						className="confirmation-modal"
						isBlocking
						isLightDismiss
						isOpen
						onDismiss={() => modals.activeModals.splice(index, 1)}
						type={PanelType.smallFluid}
						hasCloseButton={false}
						onRenderHeader={() => <div />}
					>
						<p>{modal.message}</p>
						<PrimaryButton
							onClick={() => {
								modals.activeModals.splice(index, 1);
								modal.onConfirm();
							}}
							iconProps={{ iconName: "CheckMark" }}
						>
							{lang("Confirm")}
						</PrimaryButton>
						<PrimaryButton
							onClick={() => modals.activeModals.splice(index, 1)}
							iconProps={{ iconName: "Cancel" }}
						>
							{lang("Cancel")}
						</PrimaryButton>
					</Panel>
				))}
			</div>
		);
	}
}
