import './treatments.scss';

import * as React from 'react';

import { Treatment, namespace, treatments } from '../data';
import { Icon, Nav, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { computed, observable } from 'mobx';

import { API } from '../../../core';
import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { escapeRegExp } from '../../../assets/utils/escape-regex';
import { observer } from 'mobx-react';
import { round } from '../../../assets/utils/round';
import { settingsData } from '../../settings';
import { Row, Col } from 'antd';
import { sortArrByProp } from '../../../assets/utils/sort-arr';
import { TreatmentLink } from './link';

@observer
export class Treatments extends React.Component<{}, {}> {
	@observable showMenu: boolean = true;

	@computed
	get hideMenu() {
		return !this.showMenu;
	}

	@computed
	get selectedID() {
		return API.router.currentLocation.split('/')[1];
	}

	@computed
	get selectedIndex() {
		return treatments.list.findIndex((x) => x._id === this.selectedID);
	}

	@computed
	get selectedTreatment() {
		return treatments.list[this.selectedIndex];
	}

	render() {
		return (
			<div className="treatments-component">
				<Row>
					<Col sm={6} lg={4}>
						{!this.showMenu ? (
							<div className="p-10 visible-xs">
								<PrimaryButton
									text="Treatments List"
									style={{ width: '100%' }}
									iconProps={{ iconName: 'CollapseMenu' }}
									onClick={() => {
										this.showMenu = true;
									}}
								/>
							</div>
						) : (
							''
						)}
						<Nav
							className={'treatments-nav' + (this.hideMenu ? ' hidden-xs' : '')}
							groups={[
								{
									links: [
										{
											name: 'Add New',
											icon: 'Add',
											onClick: (event) => {
												this.showMenu = false;
												const newTreatment = new Treatment();
												newTreatment.type = 'New Treatment';
												treatments.list.push(newTreatment);
												API.router.go([ 'treatments', newTreatment._id ]);
												if (event) {
													event.stopPropagation();
												}
											},
											url: '',
											key: 'addNew'
										}
									]
								},
								{
									links: sortArrByProp(
										treatments.list.map((treatment, index) => {
											return {
												name: treatment.type,
												url: '',
												key: treatment.type + index,
												onClick: () => {
													this.showMenu = false;
													API.router.go([ 'treatments', treatment._id ]);
												}
											};
										}),
										'key'
									)
								}
							]}
						/>
					</Col>
					<Col sm={18} lg={20}>
						{this.selectedTreatment ? (
							<div className={'treatment-edit' + (this.showMenu ? ' hidden-xs' : '')}>
								<TreatmentLink id={this.selectedID} notClickable />
								<section>
									<label>Treatment Title</label>
									<TextField
										value={this.selectedTreatment.type}
										onChanged={(newVal) => {
											treatments.list[this.selectedIndex].type = newVal;
										}}
									/>
								</section>
								<section>
									<label>Expected Expenses</label>
									<TextField
										type="number"
										value={this.selectedTreatment.expenses.toString()}
										onChanged={(newVal) => {
											treatments.list[this.selectedIndex].expenses = Number(newVal);
										}}
									/>
								</section>
								<PrimaryButton
									text="Delete"
									className="delete m-t-5"
									iconProps={{ iconName: 'trash' }}
									onClick={() => {
										this.showMenu = true;
										treatments.deleteModal(this.selectedID);
									}}
								/>
							</div>
						) : (
							''
						)}
					</Col>
				</Row>
			</div>
		);
	}
}
