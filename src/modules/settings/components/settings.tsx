import * as backup from '../../../assets/utils/backup';
import * as React from 'react';
import { Col, Row } from '../../../assets/components/grid/index';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PrimaryButton, TextField, Toggle } from 'office-ui-fabric-react';
import { settings } from '../data';
import './settings.scss';

@observer
export class SettingsComponent extends React.Component<{}, {}> {
	@observable triggerUpdate: number = 0;

	@observable restoreText: string = '';

	@observable inputEl: HTMLInputElement | null = null;

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
					<Toggle
						onText="Have doctors contact details"
						offText="Don't have doctors contact details"
						defaultChecked={!!settings.getSetting('doctor_contact')}
						onChanged={(val) => {
							settings.setSetting('doctor_contact', val ? 'enable' : '');
						}}
					/>
				</div>

				<br />
				<br />
				<h3>Backup and restore</h3>
				<hr />

				<PrimaryButton
					onClick={() => {
						backup.saveToFile();
					}}
				>
					Download a backup
				</PrimaryButton>

				<PrimaryButton onClick={() => (this.inputEl ? this.inputEl.click() : '')} style={{ marginLeft: 10 }}>
					Restore from file
				</PrimaryButton>
				<input
					ref={(el) => (this.inputEl = el)}
					hidden
					type="file"
					multiple={false}
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0) {
							const reader = new FileReader();
							reader.addEventListener('load', () => {
								if (typeof reader.result === 'string') {
									backup.restoreFromFile(reader.result);
								}
							});
							reader.readAsDataURL(e.target.files[0]);
						}
					}}
				/>
			</div>
		);
	}
}
