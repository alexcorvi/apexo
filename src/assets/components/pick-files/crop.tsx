import * as React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import * as ImageEditor from "react-avatar-editor";
import {
	Slider,
	Toggle,
	IconButton,
	PrimaryButton,
	Dialog,
	CommandBar
} from "office-ui-fabric-react";
import { Row, Col } from "../grid";
import "./crop.scss";
import { GridTable } from "../../../modules/orthodontic/components/grid-table";
const Editor = ImageEditor.default || ImageEditor;

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.3;

@observer
export class Crop extends React.Component<{
	src: string;
	prevSrc: string;
	onDismiss: () => void;
	onSave: (src: string) => void;
}> {
	@observable overlay: boolean = false;
	@observable zoom: number = 1;
	@observable baseRotation: number = 1;
	@observable addedRotation: number = 1;
	@observable showGrid: boolean = true;
	@observable editorRef: ImageEditor.default | null = null;

	@observable x: number = 0.5;
	@observable y: number = 0.5;

	render() {
		return (
			<div className="crop-modal">
				<Dialog
					modalProps={{ className: "crop-dialog" }}
					hidden={false}
					onDismiss={() => this.props.onDismiss()}
				>
					<div className="editor">
						{this.showGrid ? <GridTable /> : ""}
						{this.overlay ? (
							<img
								src={this.props.prevSrc}
								className="prev-overlay"
							/>
						) : (
							""
						)}
						<Editor
							image={this.props.src}
							width={280}
							height={530}
							color={[0, 0, 0, 0.6]}
							scale={this.zoom}
							rotate={this.baseRotation + this.addedRotation}
							ref={ref => (this.editorRef = ref)}
							position={{ x: this.x, y: this.y }}
							onPositionChange={
								((p: { x: number; y: number }) => {
									this.x = p.x;
									this.y = p.y;
								}) as any
							}
						/>
					</div>

					<div className="crop-controls">
						<Row gutter={6}>
							<Col span={12}>
								<Slider
									min={MIN_ZOOM * 100}
									max={MAX_ZOOM * 100}
									value={this.zoom * 100}
									defaultValue={this.zoom * 100}
									onChange={v => {
										this.zoom = v / 100;
									}}
									label="Zoom"
									showValue={false}
								/>
							</Col>
							<Col span={12}>
								<Row gutter={2}>
									<Col span={16}>
										<Slider
											min={-45}
											max={45}
											value={this.addedRotation}
											defaultValue={this.addedRotation}
											onChange={v => {
												if (v !== -1) {
													this.addedRotation = v;
												}
											}}
											label="Rotation"
											showValue={false}
										/>
									</Col>
									<Col span={4}>
										<IconButton
											onClick={() => {
												this.baseRotation =
													this.baseRotation - 90;
											}}
											iconProps={{
												iconName: "Rotate90Clockwise"
											}}
										/>
									</Col>
									<Col span={4}>
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
									</Col>
								</Row>
							</Col>
						</Row>
					</div>

					<CommandBar
						items={[
							{
								key: "grid",
								text: "Grid",
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
								text: "Overlay",
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
								text: "Save",
								iconProps: { iconName: "save" },
								classNames: "abc",
								onClick: () => {
									if (!this.editorRef) {
										return;
									}

									this.props.onSave(
										this.editorRef
											.getImageScaledToCanvas()
											.toDataURL()
									);
								}
							},
							{
								key: "cancel",
								text: "Cancel",
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
