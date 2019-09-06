import * as core from "@core";
import { OrthoCase, PatientGalleryPanel } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";


@observer
export class OrthoGalleryPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditOrtho;
	}

	render() {
		return (
			<div>
				{this.props.orthoCase.patient ? (
					<PatientGalleryPanel
						patient={this.props.orthoCase.patient}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
