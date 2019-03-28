import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import {
	Icon,
	TextField,
	DetailsList,
	SelectionMode,
	IconButton
} from "office-ui-fabric-react";
import { observer } from "mobx-react";
import "./editable-list.scss";
import { observable } from "mobx";

@observer
export class EditableList extends React.Component<
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
			<div className="editable-list-component" style={this.props.style}>
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
								<TextField
									className="input-field"
									placeholder={this.props.label}
									onKeyDown={keydown => {
										if (keydown.keyCode === 13) {
											this.addItem();
											keydown.preventDefault();
										}
									}}
									value={this.valueToAdd}
									onChanged={val => (this.valueToAdd = val)}
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
								onActiveItemChanged={a => {
									this.expandIndex = Number(a[0].props.id);
								}}
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
														onChanged={val => {
															this.props.value[
																i
															] = val;

															(this.props
																.onChange ||
																(() => {}))(
																this.props.value
															);
														}}
													/>
												</div>
											) : x.length > 30 ? (
												x.substr(0, 25) + "..."
											) : (
												x
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
