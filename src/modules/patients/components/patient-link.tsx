import { router } from "@core";
import { patients } from "@modules";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientLinkComponent extends React.Component<
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
				className={"plk-c " + this.props.className}
				onClick={() => {
					if (!this.props.notClickable) {
						router.go(["patients", this.props.id]);
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
