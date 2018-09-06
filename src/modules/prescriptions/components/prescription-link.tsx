import './prescription-link.scss';

import * as React from 'react';

import { Persona, PersonaSize, Icon } from 'office-ui-fabric-react';

import { API } from '../../../core';
import { prescriptions, itemFormToString } from '../data';
import { generateID } from '../../../assets/utils/generate-id';
import { computed, observable } from 'mobx';

interface Props {
	id: string;
	small?: boolean;
	notClickable?: boolean;
}

export class PrescriptionLink extends React.Component<Props, {}> {
	@computed
	get found() {
		return prescriptions.list.find((prescription) => prescription._id === this.props.id);
	}

	render() {
		if (!this.found) {
			return <span />;
		}
		return (
			<Persona
				className={'prescription-link'}
				text={this.found.name}
				size={3}
				onRenderInitials={() => <Icon iconName="pill" />}
				secondaryText={`${this.found.doseInMg}mg ${this.found.timesPerDay}X${this.found
					.unitsPerTime} ${itemFormToString(this.found.form)}`}
				onClick={() => {
					if (!this.props.notClickable && this.found) {
						API.router.go([ 'prescriptions', this.props.id ]);
					}
				}}
			/>
		);
	}
}
