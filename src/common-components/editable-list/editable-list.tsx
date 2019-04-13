import { Col, Row } from "@common-components";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DetailsList, Icon, IconButton, SelectionMode, TextField } from "office-ui-fabric-react";
import * as React from "react";

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

	@observable expandIndex: number = -1;

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
				<div className="editable-list">
					<div
						className="input"
						style={
							this.props.value.length
								? {}
								: { borderBottom: "none" }
						}
					>
						<Row>
							<Col
								xs={this.props.disabled ? 24 : 20}
								sm={this.props.disabled ? 24 : 21}
							>
								<input
									className="new-item-input"
									style={
										this.props.value.length > 0
											? undefined
											: { borderBottom: "none" }
									}
									placeholder={this.props.label || undefined}
									onKeyDown={keydown => {
										if (keydown.keyCode === 13) {
											this.addItem();
											keydown.preventDefault();
										}
									}}
									onKeyUp={keyUp => {
										if (keyUp.keyCode === 13) {
											this.addItem();
											keyUp.preventDefault();
										}
									}}
									value={this.valueToAdd}
									onChange={e =>
										(this.valueToAdd = e.target.value)
									}
									disabled={this.props.disabled}
								/>
							</Col>
							<Col xs={4} sm={3} style={{ textAlign: "right" }}>
								{this.props.disabled ? (
									""
								) : (
									<Icon
										className="input-icon"
										iconName="Add"
										onClick={() => {
											this.addItem();
										}}
									/>
								)}
							</Col>
						</Row>
					</div>
					{this.props.value.length ? (
						<div className="items">
							<DetailsList
								compact
								items={[
									...this.props.value.map((x, i) => [
										<div id={i.toString()}>
											{this.expandIndex === i ? (
												<div className="list-item">
													<TextField
														multiline
														value={x}
														onBlur={() =>
															(this.expandIndex = -1)
														}
														disabled={
															this.props.disabled
														}
														autoFocus
														onChange={(e, val) => {
															this.props.value[
																i
															] = val!;

															(this.props
																.onChange ||
																(() => {}))(
																this.props.value
															);
														}}
													/>
												</div>
											) : (
												<div
													className="el-expander"
													onClick={() => {
														this.expandIndex = i;
													}}
												>
													{x.length > 30
														? x.substr(0, 25) +
														  "..."
														: x}
												</div>
											)}
											<IconButton
												className="delete"
												iconProps={{
													iconName: "trash"
												}}
												onClick={e => {
													this.expandIndex = -1;
													this.props.value.splice(
														i,
														1
													);
													(this.props.onChange ||
														(() => {}))(
														this.props.value
													);
												}}
												disabled={this.props.disabled}
											/>
										</div>
									])
								]}
								isHeaderVisible={false}
								selectionMode={SelectionMode.none}
							/>
						</div>
					) : (
						""
					)}
				</div>
			</div>
		);
	}
}
