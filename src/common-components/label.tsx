import { num } from "@utils";
import { observer } from "mobx-react";
import * as React from "react";

export const tagType: {
	warning: "warning";
	danger: "danger";
	success: "success";
	info: "info";
	primary: "primary";
} = {
	warning: "warning",
	danger: "danger",
	success: "success",
	info: "info",
	primary: "primary"
};

export function getRandomTagType(str: string) {
	const rs = (
		Math.cos(str.length) *
		Math.sin(
			str.charCodeAt(0) +
				str.charCodeAt(str.length - 1) * str.charCodeAt(0)
		)
	).toString();
	const r = Math.round(Number(rs.charAt(rs.length - 1)) / 2);

	if (r === 1) {
		return tagType.warning;
	}
	if (r === 2) {
		return tagType.primary;
	}
	if (r === 3) {
		return tagType.info;
	}
	if (r === 4) {
		return tagType.success;
	} else {
		return tagType.danger;
	}
}

interface Props {
	text: string;
	type: keyof typeof tagType;
	onClick?: () => void;
	className?: string;
	highlighted?: boolean;
}

@observer
export class TagComponent extends React.Component<Props, {}> {
	render() {
		return (
			<span
				className={`label ${this.props.type} ${
					this.props.onClick ? " clickable" : ""
				} ${this.props.highlighted ? " highlighted" : ""}
				`}
				onClick={this.props.onClick}
			>
				{this.props.text}
			</span>
		);
	}
}
