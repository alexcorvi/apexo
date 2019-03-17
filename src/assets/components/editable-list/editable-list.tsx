import * as React from "react";
import { Col, Row } from "../../../assets/components/grid/index";
import { Icon, TextField } from "office-ui-fabric-react";
import { observer } from "mobx-react";
import "./editable-list.scss";

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
	valueToAdd: string = "";

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
									multiline
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
					<div className="items">
						{this.props.value.map((item, key) => {
							const id = Math.random()
								.toString(32)
								.substr(3);
							return (
								<div key={key} id={id} className="item">
									<Row gutter={6}>
										<Col
											xs={this.props.disabled ? 24 : 20}
											sm={this.props.disabled ? 24 : 21}
										>
											<TextField
												multiline
												value={item}
												onChanged={val =>
													(this.props.value[
														key
													] = val)
												}
												disabled={this.props.disabled}
											/>
										</Col>
										{this.props.disabled ? (
											""
										) : (
											<Col
												xs={4}
												sm={3}
												style={{ textAlign: "right" }}
											>
												<Icon
													className="delete"
													iconName="delete"
													onClick={async () => {
														this.props.value.splice(
															key,
															1
														);
														(this.props.onChange ||
															(() => {}))(
															this.props.value
														);
													}}
													onMouseEnter={() => {
														const el = document.getElementById(
															id
														);

														el!.className =
															el!.className +
															" toBeDeleted";
													}}
													onMouseLeave={() => {
														const el = document.getElementById(
															id
														);

														el!.className = el!.className.replace(
															" toBeDeleted",
															""
														);
													}}
												/>
											</Col>
										)}
									</Row>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
