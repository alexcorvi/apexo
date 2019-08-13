import { observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class SectionComponent extends React.Component<{
	title: string;
	zIndex?: number;
}> {
	@observable show: boolean = true;
	render() {
		return (
			<section
				className="cl-section"
				style={{ zIndex: this.props.zIndex }}
			>
				<IconButton
					className="chevron"
					iconProps={{
						iconName: this.show ? "chevronUp" : "chevronDown"
					}}
					onClick={() => {
						this.show = !this.show;
					}}
				/>
				<h3
					className={
						"cl-section-title" + (this.show ? "" : " only-title")
					}
					onClick={() => {
						this.show = !this.show;
					}}
				>
					{this.props.title}
				</h3>
				<div style={{ clear: "both" }} />
				{this.show ? (
					<div style={{ marginBottom: 15 }}>
						{this.props.children}
					</div>
				) : (
					""
				)}
			</section>
		);
	}
}
