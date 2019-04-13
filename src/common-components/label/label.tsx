import { num } from "@utils";
import { observer } from "mobx-react";
import * as React from "react";

export enum TagType {
	warning,
	danger,
	success,
	info,
	primary
}

export function TagTypeToString(input: TagType) {
	if (input === TagType.danger) {
		return "danger";
	} else if (input === TagType.info) {
		return "info";
	} else if (input === TagType.primary) {
		return "primary";
	} else if (input === TagType.success) {
		return "success";
	} else if (input === TagType.warning) {
		return "warning";
	} else {
		return "primary";
	}
}

export function stringToTagType(input: string) {
	if (input === "danger") {
		return TagType.danger;
	} else if (input === "info") {
		return TagType.info;
	} else if (input === "primary") {
		return TagType.primary;
	} else if (input === "success") {
		return TagType.success;
	} else if (input === "warning") {
		return TagType.warning;
	} else {
		return TagType.primary;
	}
}

export function getRandomTagType(str: string) {
	const r = num(
		(str.length * str.charCodeAt(0) + str.charCodeAt(str.length - 1))
			.toString()
			.charAt(0)
	);
	if (r === 1 || r === 4) {
		return TagType.primary;
	}
	if (r === 3) {
		return TagType.warning;
	}
	if (r === 5 || r === 6) {
		return TagType.success;
	}
	if (r === 7 || r === 8 || r === 2) {
		return TagType.info;
	} else {
		return TagType.danger;
	}
}

interface Props {
	text: string;
	type: TagType;
	onClick?: () => void;
	className?: string;
}

@observer
export class TagComponent extends React.Component<Props, {}> {
	render() {
		return (
			<span
				className={
					`label ${TagTypeToString(this.props.type)} ` +
					(this.props.onClick ? "clickable" : "")
				}
				onClick={this.props.onClick}
			>
				{this.props.text}
			</span>
		);
	}
}
