import { Col, GridTableComponent, Row } from "@common-components";
import { text } from "@core";
import { generateID } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { CommandBar, Dialog, IconButton, Slider, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
import * as ImageEditor from "react-avatar-editor";

const Editor = ImageEditor.default || ImageEditor;

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.3;

@observer
export class CropComponent extends React.Component<{
	src: string;
	prevSrc: string;
	onDismiss: () => void;
	onSave: (src: string) => void;
}> {
	@observable unique: string = generateID(20).replace(/[^a-z]/g, "");

	@observable overlay: boolean = false;
	@observable zoom: number = 1;
	@observable baseRotation: number = 1;
	@observable addedRotation: number = 1;
	@observable showGrid: boolean = true;
	render() {
		return (
			<div className="crop-modal">
				<Dialog
					modalProps={{ className: "crop-dialog" }}
					hidden={false}
					onDismiss={() => this.props.onDismiss()}
				>
					<div className="editor">
						{this.showGrid ? <GridTableComponent /> : ""}
						{this.overlay ? (
							<img
								src={this.props.prevSrc}
								className="prev-overlay"
							/>
						) : (
							""
						)}
						<Editor
							className={this.unique}
							image={this.props.src}
							width={280}
							height={530}
							color={[0, 0, 0, 0.6]}
							scale={this.zoom}
							rotate={this.baseRotation + this.addedRotation}
							border={0}
						/>
					</div>

					<div className="crop-controls">
						<Row gutter={0}>
							<Col span={12}>
								<Row gutter={0}>
									<Col span={16}>
										<Slider
											min={MIN_ZOOM * 100}
											max={MAX_ZOOM * 100}
											value={this.zoom * 100}
											onChange={v => {
												this.zoom = v / 100;
											}}
											label={text(`Zoom`)}
											showValue={false}
										/>
									</Col>
									<Col span={4}>
										<TooltipHost
											content={text("Flip horizontal")}
										>
											<IconButton
												onClick={() => {
													const canvas = document.querySelectorAll(
														"." + this.unique
													)[0] as HTMLCanvasElement;

													const context = canvas.getContext(
														"2d"
													);

													context!.translate(
														context!.canvas.width,
														0
													);
													context!.scale(-1, 1);
													this.forceUpdate();
												}}
												iconProps={{
													iconName: "More"
												}}
											/>
										</TooltipHost>
									</Col>
									<Col span={4}>
										<TooltipHost
											content={text("Flip vertical")}
										>
											<IconButton
												onClick={() => {
													const canvas = document.querySelectorAll(
														"." + this.unique
													)[0] as HTMLCanvasElement;

													const context = canvas.getContext(
														"2d"
													);

													context!.translate(
														0,
														context!.canvas.height
													);
													context!.scale(1, -1);
													this.forceUpdate();
												}}
												iconProps={{
													iconName: "MoreVertical"
												}}
											/>
										</TooltipHost>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row gutter={0}>
									<Col span={16}>
										<Slider
											min={-45}
											max={45}
											value={this.addedRotation}
											onChange={v => {
												if (v !== -1) {
													this.addedRotation = v;
												}
											}}
											label={text(`Rotation`)}
											showValue={false}
										/>
									</Col>
									<Col span={4}>
										<TooltipHost
											content={text("Rotate clockwise")}
										>
											<IconButton
												onClick={() => {
													this.baseRotation =
														this.baseRotation - 90;
												}}
												iconProps={{
													iconName:
														"Rotate90Clockwise"
												}}
											/>
										</TooltipHost>
									</Col>
									<Col span={4}>
										<TooltipHost
											content={"Rotate anti-clockwise"}
										>
											<IconButton
												onClick={() => {
													this.baseRotation =
														this.baseRotation + 90;
												}}
												iconProps={{
													iconName:
														"Rotate90CounterClockwise"
												}}
											/>
										</TooltipHost>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>

					<CommandBar
						items={[
							{
								key: "grid",
								text: text("Grid"),
								iconProps: { iconName: "GridViewSmall" },
								className: this.showGrid
									? "active-button"
									: undefined,
								active: true,
								onClick: () => {
									this.showGrid = !this.showGrid;
								}
							},
							{
								key: "overlay",
								text: text("Overlay"),
								iconProps: { iconName: "MapLayers" },
								className: this.overlay
									? "active-button"
									: undefined,
								onClick: () => {
									this.overlay = !this.overlay;
								},
								hidden: !this.props.prevSrc
							}
						]}
						farItems={[
							{
								key: "save",
								text: text("Save"),
								iconProps: { iconName: "save" },
								classNames: "abc",
								onClick: () => {
									const canvas = document.querySelectorAll(
										"." + this.unique
									)[0] as HTMLCanvasElement;
									this.props.onSave(canvas.toDataURL());
								}
							},
							{
								key: "cancel",
								text: text("Cancel"),
								iconProps: { iconName: "cancel" },
								classNames: "abc",
								onClick: () => {
									this.props.onDismiss();
								}
							}
						]}
					/>
				</Dialog>
			</div>
		);
	}
}
