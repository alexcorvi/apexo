import { Patient, patients } from '../../data';

import { API } from '../../../../core';
import { IContextualMenuItem } from 'office-ui-fabric-react';

export const commands: IContextualMenuItem[] = [
	{
		key: 'addNew',
		title: 'Add new',
		name: 'Add New',
		onClick: () => {
			const patient = new Patient();
			patients.list.push(patient);
			API.router.go([ 'patients', patient._id ]);
		},
		iconProps: {
			iconName: 'Add'
		}
	}
];
