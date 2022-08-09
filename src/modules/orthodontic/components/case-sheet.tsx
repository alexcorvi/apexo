import { text } from "@core";
import * as core from "@core";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	SectionComponent,
	TagInputComponent,
	Col,
	Row,
} from "@common-components";
import {
	FacialProfile,
	ISOTeethArr,
	Lips,
	OralHygiene,
	OrthoCase,
	orthoCases,
} from "@modules";
import {
	ConstrainMode,
	DetailsList,
	Dropdown,
	MessageBar,
	MessageBarType,
	SelectionMode,
	Shimmer,
	TextField,
} from "office-ui-fabric-react";

const EditableListComponent = loadable({
	loading: () => <Shimmer />,
	loader: async () =>
		(await import("common-components/editable-list")).EditableListComponent,
});

@observer
export class OrthoCaseSheetPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@computed get canEdit() {
		return core.user.currentUser!.canEditOrtho;
	}

	render() {
		return (
			<div>
				<h3>{text("extra-oral features").h}</h3>
				<Row gutter={8}>
					<Col sm={12}>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text("lips competency").c}
							options={Object.keys(Lips).map((x) => ({
								key: x,
								text: text((Lips as any)[x]).r,
							}))}
							selectedKey={this.props.orthoCase.lips}
							onChange={(ev, has: any) => {
								this.props.orthoCase.lips = has.key;
							}}
						/>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text("facial profile").c}
							options={Object.keys(FacialProfile).map((x) => ({
								key: x,
								text: text((FacialProfile as any)[x]).r,
							}))}
							selectedKey={this.props.orthoCase.facialProfile}
							onChange={(ev, has: any) => {
								this.props.orthoCase.facialProfile = has.key;
							}}
						/>
					</Col>
					<Col sm={12}>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text("oral hygiene").c}
							options={Object.keys(OralHygiene).map((x) => ({
								key: x,
								text: text((OralHygiene as any)[x]).r,
							}))}
							selectedKey={this.props.orthoCase.oralHygiene}
							onChange={(ev, has: any) => {
								this.props.orthoCase.oralHygiene = has.key;
							}}
						/>
						<TextField
							disabled={!this.canEdit}
							min={0}
							max={180}
							value={this.props.orthoCase.nasioLabialAngle.toString()}
							onChange={(ev, v) => {
								this.props.orthoCase.nasioLabialAngle = num(v!);
							}}
							type="number"
							prefix={text(`nasio-labial angle`).c}
						/>
					</Col>
				</Row>
				<h3>{text(`jaw - jaw relationships`).h}</h3>
				<Row gutter={8}>
					<Col sm={8}>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text(`skeletal relationship`).c}
							options={[1, 2, 3].map((n) => ({
								key: n.toString(),
								text: text("skeletal relationship") + ": " + n,
							}))}
							selectedKey={this.props.orthoCase.skeletalRelationship.toString()}
							onChange={(ev, n) => {
								this.props.orthoCase.skeletalRelationship = num(
									n!.key
								);
							}}
						/>
					</Col>
					<Col sm={8}>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text(`molars relationship`).c}
							options={[1, 2, 3].map((n) => ({
								key: n.toString(),
								text: text("molars relationship") + ": " + n,
							}))}
							selectedKey={this.props.orthoCase.molarsRelationship.toString()}
							onChange={(ev, n) => {
								this.props.orthoCase.molarsRelationship = num(
									n!.key
								);
							}}
						/>
					</Col>
					<Col sm={8}>
						<Dropdown
							disabled={!this.canEdit}
							placeholder={text(`canine relationship`).c}
							options={[1, 2, 3].map((n) => ({
								key: n.toString(),
								text: text("canine relationship") + ": " + n,
							}))}
							selectedKey={this.props.orthoCase.canineRelationship.toString()}
							onChange={(ev, n) => {
								this.props.orthoCase.canineRelationship = num(
									n!.key
								);
							}}
						/>
					</Col>
				</Row>
				<h3>{text(`intercuspal - interincisal relationships`).h}</h3>
				<Row gutter={8}>
					<Col sm={6}>
						<TextField
							disabled={!this.canEdit}
							type="number"
							prefix={text(`overjet`).r}
							value={this.props.orthoCase.overJet.toString()}
							onChange={(ev, n) => {
								this.props.orthoCase.overJet = num(n!);
							}}
						/>
					</Col>
					<Col sm={6}>
						<TextField
							disabled={!this.canEdit}
							type="number"
							prefix={text(`overbite`).c}
							value={this.props.orthoCase.overBite.toString()}
							onChange={(ev, n) => {
								this.props.orthoCase.overBite = num(n!);
							}}
						/>
					</Col>
					<Col sm={12}>
						<TagInputComponent
							mainClassName="csb"
							label={text("cross/scissors bite").r}
							options={ISOTeethArr.map((x) => {
								return {
									key: x.toString(),
									text: x.toString(),
								};
							})}
							suggestionsHeaderText={
								text("cross/scissors bite").c
							}
							noResultsFoundText={text("no teeth found").c}
							disabled={!this.canEdit}
							value={Array.from(
								this.props.orthoCase.crossScissorBite
							).map((x) => ({
								key: x.toString(),
								text: x.toString(),
							}))}
							onChange={(newValue) => {
								this.props.orthoCase.crossScissorBite =
									newValue.map((x) => num(x));
							}}
						/>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col sm={12}>
						<h3>{text(`upper arch space analysis`).h}</h3>
						<TextField
							disabled={!this.canEdit}
							type="number"
							prefix={text(`space available`).c}
							value={this.props.orthoCase.u_spaceAvailable.toString()}
							onChange={(ev, v) => {
								this.props.orthoCase.u_spaceAvailable = num(v!);
							}}
						/>
						<TextField
							disabled={!this.canEdit}
							type="number"
							prefix={text(`space required`).c}
							value={this.props.orthoCase.u_spaceNeeded.toString()}
							onChange={(ev, v) => {
								this.props.orthoCase.u_spaceNeeded = num(v!);
							}}
						/>
						{this.props.orthoCase.u_crowding > 0 ? (
							<TextField
								type="number"
								disabled
								prefix={text(`crowding`).c}
								value={this.props.orthoCase.u_crowding.toString()}
							/>
						) : (
							""
						)}

						{this.props.orthoCase.u_spacing > 0 ? (
							<TextField
								type="number"
								disabled
								prefix={text(`spacing`).c}
								value={this.props.orthoCase.u_spacing.toString()}
							/>
						) : (
							""
						)}
					</Col>
					<Col sm={12}>
						<h3>{text(`lower arch space analysis`).h}</h3>
						<TextField
							type="number"
							prefix={text(`space available`).c}
							disabled={!this.canEdit}
							value={this.props.orthoCase.l_spaceAvailable.toString()}
							onChange={(ev, v) => {
								this.props.orthoCase.l_spaceAvailable = num(v!);
							}}
						/>
						<TextField
							type="number"
							prefix={text(`space required`).c}
							disabled={!this.canEdit}
							value={this.props.orthoCase.l_spaceNeeded.toString()}
							onChange={(ev, v) => {
								this.props.orthoCase.l_spaceNeeded = num(v!);
							}}
						/>
						{this.props.orthoCase.l_crowding > 0 ? (
							<TextField
								type="number"
								disabled
								prefix={text(`crowding`).c}
								value={this.props.orthoCase.l_crowding.toString()}
							/>
						) : (
							""
						)}

						{this.props.orthoCase.l_spacing > 0 ? (
							<TextField
								type="number"
								disabled
								prefix={text(`spacing`).c}
								value={this.props.orthoCase.l_spacing.toString()}
							/>
						) : (
							""
						)}
					</Col>
				</Row>
				<TagInputComponent
					disabled={!this.canEdit}
					label={text("patient concerns").c}
					value={this.props.orthoCase.problemsList.map((x) => ({
						key: x,
						text: x,
					}))}
					onChange={(v) => {
						this.props.orthoCase.problemsList = v;
					}}
					loose
					options={this.props.orthoCase.computedProblems
						.map((x) => ({
							key: x,
							text: x,
						}))
						.concat(
							orthoCases!.docs
								.map((x) => x.problemsList)
								.reduce(
									(a: string[], b) =>
										a.concat(b.map((x) => x)),
									[]
								)
								.map((x) => ({
									key: x,
									text: x,
								}))
						)

						.reduce(
							(
								arr: {
									key: string;
									text: string;
								}[],
								item
							) => {
								if (
									arr.findIndex(
										(x) =>
											x.key.substring(0, 12) ===
											item.key.substring(0, 12)
									) === -1
								) {
									arr.push(item);
								}
								return arr;
							},
							[]
						)}
				></TagInputComponent>
				<Row gutter={8}>
					<Col sm={16}>
						<TagInputComponent
							mainClassName="txplan"
							label={text("treatment plan").c}
							options={orthoCases!.docs
								.map((x) => x.treatmentPlan_appliance)
								.reduce((a: string[], b) => a.concat(b), [])
								.map((x) => ({
									key: x,
									text: x,
								}))
								.reduce(
									(
										arr: {
											key: string;
											text: string;
										}[],
										item
									) => {
										if (
											arr.findIndex(
												(x) => x.key === item.key
											) === -1
										) {
											arr.push(item);
										}
										return arr;
									},
									[]
								)}
							value={this.props.orthoCase.treatmentPlan_appliance.map(
								(x, i) => ({ key: x, text: `${i + 1}: ${x}` })
							)}
							onChange={(v) =>
								(this.props.orthoCase.treatmentPlan_appliance =
									v)
							}
							loose
						></TagInputComponent>
					</Col>
					<Col sm={8}>
						<TagInputComponent
							mainClassName="problems"
							disabled={true}
							label={text("problems").c}
							value={this.props.orthoCase.problemsList
								.concat(this.props.orthoCase.computedProblems)

								.map((x) => ({
									key: x,
									text: x,
								}))
								.reduce(
									(
										arr: {
											key: string;
											text: string;
										}[],
										item
									) => {
										if (
											arr.findIndex(
												(x) =>
													x.key.substring(0, 12) ===
													item.key.substring(0, 12)
											) === -1
										) {
											arr.push(item);
										}
										return arr;
									},
									[]
								)}
							options={[]}
						></TagInputComponent>
					</Col>
				</Row>
				<br></br>
				<br></br>
			</div>
		);
	}
}
