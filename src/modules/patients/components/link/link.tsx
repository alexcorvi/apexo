import "./link.scss";

import * as React from "react";

import { API } from "../../../../core";
import { Icon } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import { patients } from "../../data";

@observer
export class PatientLink extends React.Component<
	{
		id: string;

		notClickable?: boolean;

		className?: string;
	},
	{}
> {
	render() {
		const patient = patients.list.find(pt => pt._id === this.props.id) || {
			name: "not found"
		};
		return (
			<a
				className={"patient-link-component " + this.props.className}
				onClick={() => {
					if (!this.props.notClickable) {
						API.router.go(["patients", this.props.id]);
					}
				}}
			>
				<Icon iconName="ContactCard" className="icon" />
				&nbsp;
				{patient.name}
			</a>
		);
	}
}
