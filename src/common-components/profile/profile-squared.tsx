import { observer } from "mobx-react";
import { Persona, PersonaInitialsColor } from "office-ui-fabric-react";
import * as React from "react";

interface Props {
	text?: string;
	subText?: string;
	onRenderInitials?: () => JSX.Element;
	initialsColor?: PersonaInitialsColor;
	size?: number;
	onClick?: () => void;
	className?: string;
}
@observer
export class ProfileSquaredComponent extends React.Component<Props, {}> {
	render() {
		return (
			<Persona
				className={`profile-squared size-${this.props.size} ${
					this.props.onClick ? "clickable" : ""
				} ${this.props.className || ""}`}
				text={this.props.text || ""}
				size={this.props.size || 3}
				onRenderInitials={this.props.onRenderInitials}
				secondaryText={this.props.subText}
				onClick={this.props.onClick}
				initialsColor={this.props.initialsColor}
			/>
		);
	}
}
