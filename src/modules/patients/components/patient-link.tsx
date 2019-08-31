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
				onClick={ev => {
					core.router.go([modules.patientsNamespace]);
					setTimeout(
						() => core.router.selectID(this.props.id, "details"),
						100
					);
					ev.stopPropagation();
				}}
			>
				<Icon iconName="Contact" className="icon" />
				&nbsp;
				{this.props.name}
			</a>
		);
	}
}
