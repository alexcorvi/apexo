import { observer } from "mobx-react";
import { Persona, PersonaInitialsColor } from "office-ui-fabric-react";
import * as React from "react";

interface Props {
	text?: string;
	subText?: string;
	onRenderInitials?: () => JSX.Element;
	onRenderPrimaryText?: () => JSX.Element;
	onRenderSecondaryText?: () => JSX.Element;
	initialsColor?: PersonaInitialsColor | string;
	size?: number;
	onClick?: () => void;
	className?: string;
	avatar?: string;
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
				imageInitials={
					this.props.text
						? this.props.text
								.split(" ")
								.filter((x, i) => i < (this.props.size || 3))
								.map(x => x.charAt(0))
								.join("")
								.toUpperCase()
						: undefined
				}
				secondaryText={this.props.subText}
				onRenderSecondaryText={this.props.onRenderSecondaryText}
				onClick={this.props.onClick}
				initialsColor={this.props.initialsColor}
				onRenderPrimaryText={this.props.onRenderPrimaryText}
				imageUrl={this.props.avatar}
			/>
		);
	}
}
