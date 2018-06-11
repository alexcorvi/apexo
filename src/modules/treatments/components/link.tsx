import './link.scss';

import * as React from 'react';

import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

import { API } from '../../../core';
import { treatmentsData } from '../../../modules/treatments';
import { generateID } from '../../../assets/utils/generate-id';
import { computed, observable } from 'mobx';

interface Props {
	id: string;
	small?: boolean;
	notClickable?: boolean;
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
		return (
			<Persona
				className={'treatment-link'}
				primaryText={this.type}
				size={this.props.small ? PersonaSize.extraExtraSmall : PersonaSize.extraSmall}
				onClick={() => {
					if (!this.props.notClickable && this.found) {
						API.router.go([ 'treatments', this.props.id ]);
					}
				}}
			/>
		);
	}
}
