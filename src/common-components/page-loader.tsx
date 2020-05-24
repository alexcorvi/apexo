import * as core from "@core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class PageLoader extends React.Component<{
	pageComponent: () => Promise<React.ReactElement<any>>;
}> {
	@observable componentToRender: React.ReactElement = (
		<div className="spinner-container">
			<Spinner
				size={SpinnerSize.large}
				label={core.text(`please wait`).c}
			/>
		</div>
	);

	componentDidMount() {
		this.props.pageComponent().then((c) => (this.componentToRender = c));
	}
	render() {
		return this.componentToRender;
	}
}
