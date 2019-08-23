import { Col, ProfileComponent, ProfileSquaredComponent, Row } from "@common-components";
import { observer } from "mobx-react";
import { IconButton } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PanelTop extends React.Component<
	{
		title: string;
		type: string;
		subTitle?: string;
		initials?: string | JSX.Element;
		initialsColor?: string;
		onDismiss: () => void;
		square?: boolean;
		avatar?: string;
	},
	{}
> {
	primaryText() {
		return (
			<div>
				<span style={{ display: "block", marginBottom: "-5px" }}>
					{this.props.title}
				</span>
				<i style={{ fontSize: 12 }}>
					{this.props.type}
					{this.props.subTitle ? ` - ${this.props.subTitle}` : ""}
				</i>
			</div>
		);
	}

	uProps() {
		return {
			text: this.props.title,
			name: this.props.title,
			onRenderPrimaryText: () => this.primaryText(),
			onRenderInitials: this.props.initials
				? () => <span>{this.props.initials}</span>
				: undefined,
			size: 2,
			avatar: this.props.avatar,
			initialsColor: this.props.initialsColor
		};
	}

	render() {
		return (
			<Row>
				<Col span={22}>
					{this.props.square ? (
						<ProfileSquaredComponent {...this.uProps()} />
					) : (
						<ProfileComponent {...this.uProps()} />
					)}
				</Col>
				<Col span={2} className="close">
					<IconButton
						iconProps={{ iconName: "cancel" }}
						onClick={() => {
							this.props.onDismiss();
						}}
					/>
				</Col>
			</Row>
		);
	}
}
