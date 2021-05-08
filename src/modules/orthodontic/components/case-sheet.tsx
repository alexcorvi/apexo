import { SectionComponent, TagInputComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as loadable from "react-loadable";
import {
	FacialProfile,
	ISOTeethArr,
	Lips,
	OralHygiene,
	OrthoCase,
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
				<SectionComponent title={text(`extra-oral features`).h}>
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
				</SectionComponent>

				<SectionComponent title={text(`jaw - jaw relationships`).h}>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`skeletal relationship`).c}
						options={[1, 2, 3].map((n) => ({
							key: n.toString(),
							text:
								text("skeletal relationship") +
								": " +
								text("class") +
								n,
						}))}
						selectedKey={this.props.orthoCase.skeletalRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.skeletalRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`molars relationship`).c}
						options={[1, 2, 3].map((n) => ({
							key: n.toString(),
							text:
								text("molars relationship") +
								": " +
								text("class") +
								n,
						}))}
						selectedKey={this.props.orthoCase.molarsRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.molarsRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`canine relationship`).c}
						options={[1, 2, 3].map((n) => ({
							key: n.toString(),
							text:
								text("canine relationship") +
								": " +
								text("class") +
								n,
						}))}
						selectedKey={this.props.orthoCase.canineRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.canineRelationship = num(
								n!.key
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent
					title={text(`intercuspal - interincisal relationships`).h}
				>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`overjet`).r}
						value={this.props.orthoCase.overJet.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overJet = num(n!);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`overbite`).c}
						value={this.props.orthoCase.overBite.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overBite = num(n!);
						}}
					/>
					<TagInputComponent
						label={text("cross/scissors bite").r}
						options={ISOTeethArr.map((x) => {
							return {
								key: x.toString(),
								text: x.toString(),
							};
						})}
						suggestionsHeaderText={text("cross/scissors bite").c}
						noResultsFoundText={text("no teeth found").c}
						disabled={!this.canEdit}
						value={Array.from(
							this.props.orthoCase.crossScissorBite
						).map((x) => ({
							key: x.toString(),
							text: x.toString(),
						}))}
						onChange={(newValue) => {
							this.props.orthoCase.crossScissorBite = newValue.map(
								(x) => num(x)
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent title={text(`upper arch space analysis`).h}>
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
				</SectionComponent>

				<SectionComponent title={text(`lower arch space analysis`).h}>
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
				</SectionComponent>

				<SectionComponent title={text(`problems`).h}>
					<EditableListComponent
						disabled={!this.canEdit}
						label={text("patient concerns").c}
						value={this.props.orthoCase.problemsList}
						onChange={(v) => {
							this.props.orthoCase.problemsList = v;
						}}
					/>
					<br />
					<br />
					<h3>{text("other problems").h}</h3>
					{this.props.orthoCase.computedProblems.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{
								text(
									"the case sheet of this patient does not show any problems that needs orthodontic treatment"
								).c
							}
						</MessageBar>
					) : (
						<DetailsList
							constrainMode={ConstrainMode.horizontalConstrained}
							compact
							items={[
								...this.props.orthoCase.computedProblems.map(
									(x, i) => [`${i + 1}. ${x}`]
								),
							]}
							isHeaderVisible={false}
							selectionMode={SelectionMode.none}
						/>
					)}
				</SectionComponent>
			</div>
		);
	}
}
