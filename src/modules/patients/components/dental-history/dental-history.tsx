import './dental-history.scss';

import * as React from 'react';

import { DatePicker, Dropdown, Icon, Panel, PanelType, PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { Gender, ISOTeethArr, Patient, ToothCondition, patients, conditionToColor } from '../../data';
import { Label, LabelType, getRandomLabelType } from '../../../../assets/components/label/label.component';
import { TeethDeciduousChart, TeethPermanentChart } from '../index';
import { computed, observable } from 'mobx';

import { API } from '../../../../core';
import { AppointmentThumb } from '../../../../assets/components/appointment-thumb/appointment-thumb';
import { EditableList } from '../../../../assets/components/editable-list/editable-list';
import { TagInput } from '../../../../assets/components/tag-input/tag-input';
import { appointmentsComponents } from '../../../appointments';
import { appointmentsData } from '../../../appointments';
import { convert } from '../../../../assets/utils/teeth-numbering-systems';
import { observer } from 'mobx-react';
import { treatmentsData } from '../../../treatments';
import { Row, Col } from '../../../../assets/components/grid/index';

@observer
export class DentalHistory extends React.Component<{ patient: Patient; hideTitle?: boolean }, {}> {
	@observable viewChart: boolean = true;
	@observable viewToothISO: number = 0;
	@observable triggerUpdate: number = 0;

	componentWillMount() {
		this.viewToothISO = 0;
	}

	render() {
		return (
			<div className="dental-history teeth">
				{this.props.hideTitle ? '' : <h3>Dental History</h3>}
				<Toggle
					defaultChecked={true}
					onText="View graphic chart"
					offText="View sorted table"
					onChanged={(newVal) => {
						this.viewChart = newVal;
					}}
				/>
				<div className="m-t-20">
					{this.viewChart ? (
						<div className="chart">
							<Row>
								<Col sm={12}>
									<TeethPermanentChart
										teeth={this.props.patient.teeth}
										onClick={(number) => (this.viewToothISO = number)}
									/>
								</Col>
								<Col sm={12}>
									<TeethDeciduousChart
										teeth={this.props.patient.teeth}
										onClick={(number) => (this.viewToothISO = number)}
									/>
								</Col>
							</Row>
						</div>
					) : (
						<div className="tabulated">
							<table className="permanent">
								<tbody>
									<tr>{[ this.mapQuadrant(11, 18, true), this.mapQuadrant(21, 28, false) ]}</tr>
									<tr>{[ this.mapQuadrant(41, 48, true), this.mapQuadrant(31, 38, false) ]}</tr>
								</tbody>
							</table>
							<table className="deciduous">
								<tbody>
									<tr>{[ this.mapQuadrant(51, 55, true), this.mapQuadrant(61, 65, false) ]}</tr>
									<tr>{[ this.mapQuadrant(81, 85, true), this.mapQuadrant(71, 75, false) ]}</tr>
								</tbody>
							</table>
						</div>
					)}
				</div>

				<Panel
					isOpen={!!this.props.patient.teeth[this.viewToothISO]}
					type={PanelType.smallFixedFar}
					headerText={
						this.props.patient.teeth[this.viewToothISO] ? (
							this.props.patient.teeth[this.viewToothISO].Name.toUpperCase()
						) : (
							''
						)
					}
					closeButtonAriaLabel="Close"
					isLightDismiss={true}
					onDismiss={() => (this.viewToothISO = 0)}
				>
					{this.props.patient.teeth[this.viewToothISO] ? (
						<div className="tooth-details">
							<Label type={LabelType.primary} text="WHO ISO Notation System" />
							<Label
								type={LabelType.info}
								text={this.props.patient.teeth[this.viewToothISO].ISO.toString()}
							/>
							<br />
							<Label type={LabelType.primary} text="Universal Notation System" />
							<Label
								type={LabelType.info}
								text={this.props.patient.teeth[this.viewToothISO].Universal.toString()}
							/>
							<br />
							<Label type={LabelType.primary} text="Palmer Notation System" />
							<Label
								type={LabelType.info}
								text={this.props.patient.teeth[this.viewToothISO].Palmer.toString()}
							/>
							<br />
							<Dropdown
								placeHolder="Condition"
								onChanged={(newVal: any) => {
									this.props.patient.teeth[this.viewToothISO].condition = newVal.key.toString();
									this.props.patient.triggerUpdate++;
									this.forceUpdate();
								}}
								defaultSelectedKey={this.props.patient.teeth[this.viewToothISO].condition}
								className="single-tooth-condition"
								options={Object.keys(ToothCondition).map((c) => ({
									key: c,
									text: c
								}))}
							/>
							<EditableList
								label="History notes"
								value={this.props.patient.teeth[this.viewToothISO].notes}
							/>
						</div>
					) : (
						''
					)}
				</Panel>
			</div>
		);
	}

	/**
	 * Utility function to map view quadrants of teeth
	 * 
	 * @param {number} min 
	 * @param {number} max 
	 * @param {boolean} reverse 
	 * @returns 
	 * @memberof SinglePatient
	 */
	mapQuadrant(min: number, max: number, reverse: boolean) {
		let arr = this.props.patient.teeth;
		arr = arr.filter((tooth) => tooth.ISO >= min && tooth.ISO <= max);
		arr = reverse ? arr.reverse() : arr;
		return arr.map((tooth) => (
			<td
				key={'tooth' + tooth.ISO}
				style={{ background: conditionToColor(tooth.condition) }}
				onClick={() => (this.viewToothISO = tooth.ISO)}
			>
				<span className="has-notes" style={tooth.notes.length ? {} : { display: 'none' }} />
				{tooth.ISO}
			</td>
		));
	}
}
