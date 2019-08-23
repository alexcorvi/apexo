import * as core from "@core";
import * as modules from "@modules";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientLinkComponent extends React.Component<
	{
		id: string;
		name: string;
		className?: string;
	},
	{}
> {
	render() {
		return (
			<a
				className={"plk-c " + this.props.className}
				onClick={() => {
					core.router.go([modules.patientsNamespace, this.props.id]);
				}}
			>
				<Icon iconName="Contact" className="icon" />
				&nbsp;
				{this.props.name}
			</a>
		);
	}
}
