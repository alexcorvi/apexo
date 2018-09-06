import * as React from 'react';

import {
	CommandBar,
	Persona,
	PersonaPresence,
	PersonaSize,
	IRenderFunction,
	IPersonaSharedProps
} from 'office-ui-fabric-react';

import { observer } from 'mobx-react';

@observer
export class Profile extends React.Component<
	{
		name: string;
		secondaryText?: string;
		tertiaryText?: string;
		onClick?: () => void;
		size?: PersonaSize;
		className?: string;
		style?: React.CSSProperties;
		secondaryElement?: JSX.Element;
		onRenderInitials?: IRenderFunction<IPersonaSharedProps>;
	},
	{}
> {
	render() {
		const style = Object.assign(
			{
				cursor: this.props.onClick ? 'pointer' : ''
			},
			this.props.style || {}
		);

		return (
			<Persona
				onRenderSecondaryText={() => this.props.secondaryElement || null}
				className={this.props.className}
				onClick={() => (this.props.onClick || (() => {}))()}
				style={style}
				imageInitials={this.props.name.charAt(0)}
				size={this.props.size || PersonaSize.large}
				presence={PersonaPresence.none}
				text={this.props.name}
				secondaryText={this.props.secondaryText}
				tertiaryText={this.props.tertiaryText}
				onRenderInitials={this.props.onRenderInitials}
			/>
		);
	}
}
