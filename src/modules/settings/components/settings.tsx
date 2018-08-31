import './settings.scss';

import * as React from 'react';
import * as data from '../data';

import { TagInput } from '../../../assets/components/tag-input/tag-input';
import { TextField, Toggle, PrimaryButton } from 'office-ui-fabric-react';
import { observer } from 'mobx-react';
import { settings } from '../data';
import { observable } from 'mobx';
import { Row, Col } from '../../../assets/components/grid/index';
import * as backup from '../../../assets/utils/backup';

@observer
export class SettingsComponent extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	@observable restoreText: string = '';

	render() {
		return (
			<div className="settings-component p-15 p-l-10 p-r-10">
				<h3>Financial Settings</h3>
				<hr />
				{!!settings.getSetting('time_tracking') ? (
					<Row gutter={12}>
						<Col md={12}>
							<div className="form">
								<TextField
									label="Time expenses (per hour)"
									type="number"
									value={settings.getSetting('hourlyRate')}
									onChanged={(newVal) => {
										settings.setSetting('hourlyRate', newVal.toString());
									}}
								/>
							</div>
						</Col>
						<Col md={12}>
							<p className="hint">
								When time tracking enabled, this is used to calculate profits and expenses, as time is
								also added to the expenses. So here you can put the electricity, rent, and other time
								dependent expenses.
							</p>
						</Col>
					</Row>
				) : (
					''
				)}

				<Row gutter={12}>
					<Col md={12}>
						<div className="form">
							<TextField
								label="Currency Symbol"
								value={settings.getSetting('currencySymbol')}
								onChanged={(newVal) => {
									settings.setSetting('currencySymbol', newVal.toString());
								}}
							/>
						</div>
					</Col>
					<Col md={12}>
						<p className="hint">This symbol you enter here will be used across your application.</p>
					</Col>
				</Row>

				<br />
				<br />
				<h3>Optional Modules and features</h3>
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
					<Toggle
						onText="Time Tracking Enabled"
						offText="Time Tracking Disabled"
						defaultChecked={!!settings.getSetting('time_tracking')}
						onChanged={(val) => {
							settings.setSetting('time_tracking', val ? 'enable' : '');
						}}
					/>
				</div>

				<br />
				<br />
				<h3>Backup and restore</h3>
				<hr />

				<p className="hint">
					The following text is an encoded representation of your current data, copy this text and keep it
					somewhere safe to backup.
				</p>
				<TextField multiline value={backup.backup2Base64()} disabled />

				<p className="hint">
					To restore your data from an encoded representation (similar to the one above) paste it down below
					and click "restore"
				</p>
				<TextField
					multiline
					value={this.restoreText}
					onChanged={(v) => {
						this.restoreText = v;
					}}
				/>
				<PrimaryButton
					disabled={this.restoreText.length === 0}
					onClick={() => {
						try {
							backup.restoreFromBase64(this.restoreText);
						} catch (e) {
							console.log(e);
							alert('Could not restore. The encoded representation you entered seems corrupted!');
						}
					}}
				>
					Restore
				</PrimaryButton>
			</div>
		);
	}
}
