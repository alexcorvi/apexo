import './settings.scss';

import * as React from 'react';
import * as data from '../data';

import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { TextField, Toggle } from 'office-ui-fabric-react';
import { observer } from 'mobx-react';
import { settings } from '../data';
import { observable } from 'mobx';

@observer
export class SettingsComponent extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	render() {
		return (
			<div className="settings-component p-15 p-l-10 p-r-10">
				<h3>Financial Settings</h3>
				<hr />
				<div className="form">
					<TextField
						label="Hour Rate"
						type="number"
						value={settings.getSetting('hourlyRate')}
						onChanged={(newVal) => {
							settings.setSetting('hourlyRate', newVal.toString());
						}}
					/>
				</div>
				<div className="form">
					<TextField
						label="Currency"
						value={settings.getSetting('currencySymbol')}
						onChanged={(newVal) => {
							settings.setSetting('currencySymbol', newVal.toString());
						}}
					/>
				</div>
				<br />
				<br />
				<h3>Optional Modules</h3>
				<hr />

				<div className="form">
					<Toggle
						onText="Prescriptions Module Enabled"
						offText="Prescriptions Module Disabled"
						defaultChecked={!!settings.getSetting('module_prescriptions')}
						onChanged={(val) => {
							settings.setSetting('module_prescriptions', val ? 'enable' : '');
						}}
					/>
					<Toggle
						onText="Orthodontic Module Enabled"
						offText="Orthodontic Module Disabled"
						defaultChecked={!!settings.getSetting('module_orthodontics')}
						onChanged={(val) => {
							settings.setSetting('module_orthodontics', val ? 'enable' : '');
						}}
					/>
					<Toggle
						onText="Statistics Module Enabled"
						offText="Statistics Module Disabled"
						defaultChecked={!!settings.getSetting('module_statistics')}
						onChanged={(val) => {
							settings.setSetting('module_statistics', val ? 'enable' : '');
						}}
					/>
				</div>
			</div>
		);
	}
}
