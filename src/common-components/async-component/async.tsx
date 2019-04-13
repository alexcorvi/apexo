import { observable } from "mobx";
import { observer } from "mobx-react";
import { Shimmer } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class AsyncComponent extends React.Component<{
	key: string;
	loader: () => Promise<React.ReactElement<any>>;
}> {
	@observable componentToRender: React.ReactElement = <Shimmer />;

	componentDidMount() {
		this.props.loader().then(c => (this.componentToRender = c));
	}
	render() {
		return this.componentToRender;
	}
}
