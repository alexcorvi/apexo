import { router } from "@core";
import { setting } from "@modules";
import { formatDate } from "@utils";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

interface Props {
	time: number;
	format: string;
	className?: string;
	notClickable: boolean;
}

@observer
export class DateLinkComponent extends React.Component<Props, {}> {
	render() {
		const dateObj = new Date(this.props.time);
		const y = dateObj.getFullYear();
		const m = dateObj.getMonth() + 1;
		const d = dateObj.getDate();
		return (
			<div className={"date-link " + this.props.className || ""}>
				<a
					onClick={() => {
						if (this.props.notClickable) {
							return;
						}
						router.go(["appointments", `${y}-${m}-${d}`]);
					}}
				>
					<span className="icon">
						<Icon iconName="Calendar" />
					</span>
					{formatDate(
						this.props.time,
						setting.getSetting("date_format")
					)}
				</a>
			</div>
		);
	}
}
