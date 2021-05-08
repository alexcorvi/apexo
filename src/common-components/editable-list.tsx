import { Col, Row } from "@common-components";
import { text } from "@core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	DetailsList,
	IconButton,
	Label,
	SelectionMode,
	TextField,
} from "office-ui-fabric-react";

@observer
export class EditableListComponent extends React.Component<
	{
		label: string;
		value: string[];
		onChange?: (newVal: string[]) => void;
		style?: any;
		disabled?: boolean;
	},
	{}
> {
	@observable valueToAdd: string = "";

	addItem() {
		if (this.valueToAdd.replace(/\W/, "").length) {
			this.props.value.push(this.valueToAdd);
			this.valueToAdd = "";
			(this.props.onChange || (() => {}))(this.props.value);
		}
	}

	render() {
		return (
			<div className="elc-c" style={this.props.style}>
				<Label>{this.props.label}</Label>
				<TextField
					className="new-item"
					placeholder={text("type here").c}
					onKeyDown={(keydown) => {
						if (keydown.keyCode === 13) {
							this.addItem();
							keydown.preventDefault();
						}
					}}
					onKeyUp={(keyUp) => {
						if (keyUp.keyCode === 13) {
							this.addItem();
							keyUp.preventDefault();
						}
					}}
					value={this.valueToAdd}
					onChange={(e, value) => (this.valueToAdd = value || "")}
					disabled={this.props.disabled}
					onRenderSuffix={() => (
						<IconButton
							iconProps={{ iconName: "Add" }}
							disabled={!this.valueToAdd.replace(/\W/, "").length}
							onClick={() => this.addItem()}
							data-testid="add-elc-item"
						/>
					)}
				/>

				{this.props.value.length ? (
					<div className="items">
						<DetailsList
							compact
							items={[
								...this.props.value.map((x, i) => [
									<div id={i.toString()}>
										<div className="list-item">
											<TextField
												multiline
												value={x}
												disabled={this.props.disabled}
												onChange={(e, val) => {
													this.props.value[i] = val!;

													(
														this.props.onChange ||
														(() => {})
													)(this.props.value);
												}}
												onRenderSuffix={() => {
													return (
														<IconButton
															data-testid="delete-elc-item"
															iconProps={{
																iconName:
																	"trash",
															}}
															onClick={() => {
																this.props.value.splice(
																	i,
																	1
																);
																(
																	this.props
																		.onChange ||
																	(() => {})
																)(
																	this.props
																		.value
																);
															}}
															disabled={
																this.props
																	.disabled
															}
														/>
													);
												}}
											/>
										</div>
									</div>,
								]),
							]}
							isHeaderVisible={false}
							selectionMode={SelectionMode.none}
						/>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
