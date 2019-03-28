import * as React from "react";
import "./label.scss";

export enum LabelType {
	warning,
	danger,
	success,
	info,
	primary
}

export function LabelTypeToString(input: LabelType) {
	if (input === LabelType.danger) {
		return "danger";
	} else if (input === LabelType.info) {
		return "info";
	} else if (input === LabelType.primary) {
		return "primary";
	} else if (input === LabelType.success) {
		return "success";
	} else if (input === LabelType.warning) {
		return "warning";
	} else {
		return "primary";
	}
}

export function stringToLabelType(input: string) {
	if (input === "danger") {
		return LabelType.danger;
	} else if (input === "info") {
		return LabelType.info;
	} else if (input === "primary") {
		return LabelType.primary;
	} else if (input === "success") {
		return LabelType.success;
	} else if (input === "warning") {
		return LabelType.warning;
	} else {
		return LabelType.primary;
	}
}

export function getRandomLabelType(str: string) {
	const r = Number(
		(str.length * str.charCodeAt(0) + str.charCodeAt(str.length - 1))
			.toString()
			.charAt(0)
	);
	if (r === 1 || r === 4) {
		return LabelType.primary;
	}
	if (r === 3) {
		return LabelType.warning;
	}
	if (r === 5 || r === 6) {
		return LabelType.success;
	}
	if (r === 7 || r === 8 || r === 2) {
		return LabelType.info;
	} else {
		return LabelType.danger;
	}
}

interface Props {
	text: string;
	type: LabelType;
	onClick?: () => void;
	className?: string;
}

@observer
export class Label extends React.Component<Props, {}> {
	render() {
		return (
			<span
				className={
					`label ${LabelTypeToString(this.props.type)} ` +
					(this.props.onClick ? "clickable" : "")
				}
				onClick={this.props.onClick}
			>
				{this.props.text}
			</span>
		);
	}
}
