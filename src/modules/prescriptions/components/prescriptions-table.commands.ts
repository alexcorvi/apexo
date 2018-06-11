import { PrescriptionItem, prescriptions } from '../data';

import { IContextualMenuItem } from 'office-ui-fabric-react';

export const commands: IContextualMenuItem[] = [
	{
		key: 'addNew',
		title: 'Add new',
		name: 'Add New',
		onClick: () => {
			prescriptions.list.push(new PrescriptionItem());
		},
		iconProps: {
			iconName: 'Add'
		}
	}
];
