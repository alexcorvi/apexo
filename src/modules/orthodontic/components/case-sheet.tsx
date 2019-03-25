import * as React from "react";
import { computed } from "mobx";
import {
	Dropdown,
	TextField,
	DetailsList,
	ConstrainMode,
	SelectionMode
} from "office-ui-fabric-react";

import { EditableList } from "../../../assets/components/editable-list/editable-list";
import {
	FacialProfile,
	Lips,
	OralHygiene,
	OrthoCase
} from "../data/class.ortho";
import { observer } from "mobx-react";
import { patientsData } from "../../patients";
import { Section } from "../../../assets/components/section/section";
import { TagInput } from "../../../assets/components/tag-input/tag-input";
import { API } from "../../../core/index";
import { lang } from "../../../core/i18/i18";

@observer
export class OrthoCaseSheet extends React.Component<{
	orthoCase: OrthoCase;
}> {
	@computed get canEdit() {
		return API.user.currentUser.canEditOrtho;
	}

	render() {
		return (
			<div>
				<Section showByDefault title="Extra-oral Features">
					<Dropdown
						disabled={!this.canEdit}
						placeHolder={lang("Lips competency")}
						options={Object.keys(Lips).map(x => ({
							key: x,
							text: (Lips as any)[x]
						}))}
						defaultSelectedKey={this.props.orthoCase.lips}
						onChanged={(has: any) => {
							this.props.orthoCase.lips = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeHolder={lang("Facial profile")}
						options={Object.keys(FacialProfile).map(x => ({
							key: x,
							text: (FacialProfile as any)[x]
						}))}
						defaultSelectedKey={this.props.orthoCase.facialProfile}
						onChanged={(has: any) => {
							this.props.orthoCase.facialProfile = has.key;
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeHolder={lang("Oral hygiene")}
						options={Object.keys(OralHygiene).map(x => ({
							key: x,
							text: (OralHygiene as any)[x]
						}))}
						defaultSelectedKey={this.props.orthoCase.oralHygiene}
						onChanged={(has: any) => {
							this.props.orthoCase.oralHygiene = has.key;
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						min={0}
						max={180}
						value={this.props.orthoCase.nasioLabialAngle.toString()}
						onChanged={v => {
							this.props.orthoCase.nasioLabialAngle = Number(v);
						}}
						type="number"
						prefix="Nasio-labial angle"
					/>
				</Section>

				<Section showByDefault title="Jaw-Jaw relationships">
					<Dropdown
						disabled={!this.canEdit}
						placeHolder="Skeletal relationship"
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: "Skeletal relationship: Class " + n
						}))}
						defaultSelectedKey={this.props.orthoCase.skeletalRelationship.toString()}
						onChanged={n => {
							this.props.orthoCase.skeletalRelationship = Number(
								n.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeHolder="Molars relationship"
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: "Molars relationship: Class " + n
						}))}
						defaultSelectedKey={this.props.orthoCase.molarsRelationship.toString()}
						onChanged={n => {
							this.props.orthoCase.molarsRelationship = Number(
								n.key
							);
						}}
					/>
					<Dropdown
						disabled={!this.canEdit}
						placeHolder="Canine relationship"
						options={[1, 2, 3].map(n => ({
							key: n.toString(),
							text: "Canine relationship: Class " + n
						}))}
						defaultSelectedKey={this.props.orthoCase.canineRelationship.toString()}
						onChanged={n => {
							this.props.orthoCase.canineRelationship = Number(
								n.key
							);
						}}
					/>
				</Section>

				<Section
					showByDefault
					title="Intercuspal-Interincisal relationships"
				>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix="Overjet"
						value={this.props.orthoCase.overJet.toString()}
						onChanged={n => {
							this.props.orthoCase.overJet = n;
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix="Overbite"
						value={this.props.orthoCase.overBite.toString()}
						onChanged={n => {
							this.props.orthoCase.overBite = n;
						}}
					/>
					<TagInput
						disabled={!this.canEdit}
						strict
						placeholder="Cross/Scissors Bite"
						options={patientsData.ISOTeethArr.map(x => {
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
								x => Number(x.key)
							);
						}}
					/>
				</Section>

				<Section showByDefault title="Upper arch space analysis">
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix="Space available"
						value={this.props.orthoCase.u_spaceAvailable.toString()}
						onChanged={v => {
							this.props.orthoCase.u_spaceAvailable = Number(v);
						}}
					/>
					<TextField
						disabled={!this.canEdit}
						type="number"
						prefix="Space required"
						value={this.props.orthoCase.u_spaceNeeded.toString()}
						onChanged={v => {
							this.props.orthoCase.u_spaceNeeded = Number(v);
						}}
					/>
					{this.props.orthoCase.u_crowding > 0 ? (
						<TextField
							type="number"
							disabled
							prefix="Crowding"
							value={this.props.orthoCase.u_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.u_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix="Spacing"
							value={this.props.orthoCase.u_spacing.toString()}
						/>
					) : (
						""
					)}
				</Section>

				<Section showByDefault title="Lower arch space analysis">
					<TextField
						type="number"
						prefix="Space available"
						disabled={!this.canEdit}
						value={this.props.orthoCase.l_spaceAvailable.toString()}
						onChanged={v => {
							this.props.orthoCase.l_spaceAvailable = Number(v);
						}}
					/>
					<TextField
						type="number"
						prefix="Space required"
						disabled={!this.canEdit}
						value={this.props.orthoCase.l_spaceNeeded.toString()}
						onChanged={v => {
							this.props.orthoCase.l_spaceNeeded = Number(v);
						}}
					/>
					{this.props.orthoCase.l_crowding > 0 ? (
						<TextField
							type="number"
							disabled
							prefix="Crowding"
							value={this.props.orthoCase.l_crowding.toString()}
						/>
					) : (
						""
					)}

					{this.props.orthoCase.l_spacing > 0 ? (
						<TextField
							type="number"
							disabled
							prefix="Spacing"
							value={this.props.orthoCase.l_spacing.toString()}
						/>
					) : (
						""
					)}
				</Section>

				<Section showByDefault title="Problems">
					<EditableList
						disabled={!this.canEdit}
						label={lang("Patient Concerns") + "..."}
						value={this.props.orthoCase.problemsList}
						onChange={v => {
							this.props.orthoCase.problemsList = v;
							this.props.orthoCase.triggerUpdate++;
						}}
					/>
					<br />
					<br />
					<h3>Other Problems</h3>
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
				</Section>
			</div>
		);
	}
}
