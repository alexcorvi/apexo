import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PatientLinkComponent extends React.Component<
	{
		id: string;

		name: string;
		className?: string;
		onClick?: () => void;
	},
	{}
> {
	render() {
		return (
			<a
				className={"plk-c " + this.props.className}
				onClick={() => {
					if (this.props.onClick) {
						this.props.onClick();
					}
				}}
			>
				<Icon iconName="ContactCard" className="icon" />
				&nbsp;
				{this.props.name}
			</a>
		);
	}
}
