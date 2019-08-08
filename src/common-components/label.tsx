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
	const r = num(
		(str.length * str.charCodeAt(0) + str.charCodeAt(str.length - 1))
			.toString()
			.charAt(0)
	);
	if (r === 1 || r === 4) {
		return tagType.primary;
	}
	if (r === 3) {
		return tagType.warning;
	}
	if (r === 5 || r === 6) {
		return tagType.success;
	}
	if (r === 7 || r === 8 || r === 2) {
		return tagType.info;
	} else {
		return tagType.danger;
	}
}

interface Props {
	text: string;
	type: keyof typeof tagType;
	onClick?: () => void;
	className?: string;
}

@observer
export class TagComponent extends React.Component<Props, {}> {
	render() {
		return (
			<span
				className={
					`label ${this.props.type} ` +
					(this.props.onClick ? "clickable" : "")
				}
				onClick={this.props.onClick}
			>
				{this.props.text}
			</span>
		);
	}
}
