import './link.scss';

import * as React from 'react';

import { Persona, PersonaSize, Icon } from 'office-ui-fabric-react';

import { API } from '../../../core';
import { treatmentsData } from '../../../modules/treatments';
import { generateID } from '../../../assets/utils/generate-id';
import { computed, observable } from 'mobx';
import { settingsData } from '../../settings';

interface Props {
	id: string;
	small?: boolean;
	notClickable?: boolean;
	showExpenses?: boolean;
}

export class TreatmentLink extends React.Component<Props, {}> {
	@computed
	get found() {
		return treatmentsData.treatments.list.find((treatment) => treatment._id === this.props.id);
	}

	@computed
	get type() {
		if (this.found) {
			return this.found.type;
		} else if (this.props.id.indexOf('|') > -1) {
			return this.props.id.split('|')[0];
		} else {
			return 'not found';
		}
	}

	render() {
		if (!this.found) {
			return <span />;
		}
		return (
			<Persona
				className={'treatment-link'}
				text={this.type}
				size={this.props.small ? PersonaSize.extraExtraSmall : 3}
				onRenderInitials={() => <Icon iconName="Cricket" />}
				secondaryText={
					this.props.showExpenses ? (
						`Expenses: ${settingsData.settings.getSetting(
							'currencySymbol'
						)}${this.found.expenses.toString()} per unit`
					) : (
						''
					)
				}
				onClick={() => {
					if (!this.props.notClickable && this.found) {
						API.router.go([ 'treatments', this.props.id ]);
					}
				}}
			/>
		);
	}
}
