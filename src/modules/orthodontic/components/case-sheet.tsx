import { SectionComponent, TagInputComponent } from "@common-components";
import { text, user } from "@core";
import { FacialProfile, ISOTeethArr, Lips, OralHygiene, OrthoCase } from "@modules";
import { num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
	ConstrainMode,
	DetailsList,
	Dropdown,
	MessageBar,
	MessageBarType,
	SelectionMode,
	TextField
	} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class OrthoCaseSheetPanel extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@computed get canEdit() {
		return user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div>
				<SectionComponent title={text(`Extra-Oral Features`)}>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text("Lips competency")}
						options={Object.keys(Lips).map(x => ({
							key: x,
							text: text((Lips as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.lips}
						onChange={(ev, has: any) => {
							this.props.orthoCase.lips = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text("Facial profile")}
						options={Object.keys(FacialProfile).map(x => ({
							key: x,
							text: text((FacialProfile as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.facialProfile}
						onChange={(ev, has: any) => {
							this.props.orthoCase.facialProfile = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text("Oral hygiene")}
						options={Object.keys(OralHygiene).map(x => ({
							key: x,
							text: text((OralHygiene as any)[x])
						}))}
						defaultSelectedKey={this.props.orthoCase.oralHygiene}
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
						prefix={text(`Nasio-labial angle`)}
					/>
				</SectionComponent>

				<SectionComponent title={text(`Jaw-Jaw Relationships`)}>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`Skeletal relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: text("Skeletal relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.skeletalRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.skeletalRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`Molars relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: text("Molars relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.molarsRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.molarsRelationship = num(
								n!.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeholder={text(`Canine relationship`)}
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: text("Canine relationship: Class ") + n
						}))}
						defaultSelectedKey={this.props.orthoCase.canineRelationship.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.canineRelationship = num(
								n!.key
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent
					title={text(`Intercuspal-Interincisal Relationships`)}
				>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`Overjet`)}
						value={this.props.orthoCase.overJet.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overJet = num(n!);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`Overbite`)}
						value={this.props.orthoCase.overBite.toString()}
						onChange={(ev, n) => {
							this.props.orthoCase.overBite = num(n!);
						}}
					/>
					<TagInputComponent
						disabled={!this.canEdit}
						strict
						placeholder={text("Cross/scissors bite")}
						options={ISOTeethArr.map(x => {
							return {
								key: x.toString(),
								text: x.toString()
							};
						})}
						value={Array.from(
							this.props.orthoCase.crossScissorBite
						).map(x => ({
							key: x.toString(),
							text: x.toString()
						}))}
						onChange={newValue => {
							this.props.orthoCase.crossScissorBite = newValue.map(
								x => num(x.key)
							);
						}}
					/>
				</SectionComponent>

				<SectionComponent title={text(`Upper Arch Space Analysis`)}>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`Space available`)}
						value={this.props.orthoCase.u_spaceAvailable.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.u_spaceAvailable = num(v!);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix={text(`Space required`)}
						value={this.props.orthoCase.u_spaceNeeded.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.u_spaceNeeded = num(v!);
						}}
					/>
					{this.props.orthoCase.u_crowding > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={text(`Crowding`)}
							value={this.props.orthoCase.u_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.u_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={text(`Spacing`)}
							value={this.props.orthoCase.u_spacing.toString()}
						/>
					) : (
						""
					)}
				</SectionComponent>

				<SectionComponent title={text(`Lower Arch Space Analysis`)}>
					<TextField
						type="number"
						prefix={text(`Space available`)}
						disabled={!this.canEdit}
						value={this.props.orthoCase.l_spaceAvailable.toString()}
						onChange={(ev, v) => {
							this.props.orthoCase.l_spaceAvailable = num(v!);
						}}
					/>
					<TextField
						type="number"
						prefix={text(`Space required`)}
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
							prefix={text(`Crowding`)}
							value={this.props.orthoCase.l_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.l_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix={text(`Spacing`)}
							value={this.props.orthoCase.l_spacing.toString()}
						/>
					) : (
						""
					)}
				</SectionComponent>

				<SectionComponent title={text(`Problems`)}>
					<EditableListComponent
						disabled={!this.canEdit}
						label={text("Patient concerns")}
						value={this.props.orthoCase.problemsList}
						onChange={v => {
							this.props.orthoCase.problemsList = v;
							this.props.orthoCase.triggerUpdate++;
						}}
					/>
					<br />
					<br />
					<h3>{text("Other Problems")}</h3>
					{this.props.orthoCase.computedProblems.length === 0 ? (
						<MessageBar messageBarType={MessageBarType.info}>
							{text(
								"The case sheet of this patient does not show any problems that needs orthodontic treatment"
							)}
						</MessageBar>
					) : (
						<DetailsList
							constrainMode={ConstrainMode.horizontalConstrained}
							compact
							items={[
								...this.props.orthoCase.computedProblems.map(
									(x, i) => [`${i + 1}. ${x}`]
								)
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
