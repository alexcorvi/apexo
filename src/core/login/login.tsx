import './login.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MessageBar, MessageBarType, PrimaryButton, TextField, Label, DefaultButton } from 'office-ui-fabric-react';
import { API } from '../';
import { login } from './data.login';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Label as LabelC, LabelType } from '../../assets/components/label/label.component';
import { checkServer } from '../../assets/utils/check-server';

@observer
export class LoginComponent extends React.Component<{}, {}> {
	usernameField: TextField | undefined;
	passwordField: TextField | undefined;
	serverField: TextField | undefined;

	couchDBDefaultServer: string = (window as any).couchDBServer ||
		localStorage.getItem('server_location') ||
		location.origin.replace(/:\d+$/g, ':5984');

	@observable errorMessage: string = '';
	@observable disableInputs: boolean = false;
	@observable step: number = 1;

	@observable editServerLocation: boolean = false;

	@observable initiallyChecked: boolean = false;

	componentWillMount() {
		login.initialCheck(this.couchDBDefaultServer).then(() => (this.initiallyChecked = true));
	}

	render() {
		return (
			<div className="container m-t-50" style={{ maxWidth: '400px', margin: '30px auto' }}>
				{this.initiallyChecked ? (
					<div className="login-step">
						<div className={navigator.onLine ? 'hidden' : ''}>
							<MessageBar messageBarType={MessageBarType.warning}>
								{`
								You're offline.
								Use the latest username/password you've successfully
								used on this machine to login to this server:
								${(this.couchDBDefaultServer || '').replace(/([^\/])\/[^\/].+/, '$1')}.
							`}
							</MessageBar>
						</div>

						<br />
						<hr />

						<div className={navigator.onLine ? '' : 'hidden'}>
							<div
								style={{
									display: 'inline-block',
									width: '75%'
								}}
							>
								<TextField
									name="server"
									label="Server location"
									ref={(el) => (el ? (this.serverField = el) : '')}
									disabled={this.disableInputs || !this.editServerLocation}
									defaultValue={this.couchDBDefaultServer}
								/>
							</div>

							<DefaultButton
								style={{
									display: 'inline-block',
									marginTop: '23px'
								}}
								onClick={() => {
									this.editServerLocation = true;
								}}
							>
								Change
							</DefaultButton>
						</div>

						<br />
						<br />
						<hr />
						<TextField
							name="identification"
							label="Username"
							ref={(el) => (el ? (this.usernameField = el) : '')}
							disabled={this.disableInputs}
						/>
						<TextField
							name="password"
							type="Password"
							label="Password"
							ref={(el) => (el ? (this.passwordField = el) : '')}
							disabled={this.disableInputs}
						/>
						<PrimaryButton
							text="login"
							disabled={this.disableInputs}
							className="m-t-15 m-b-15"
							onClick={async () => {
								if (!(this.passwordField && this.usernameField && this.serverField)) {
									return;
								}
								if (!(this.usernameField.value && this.passwordField.value && this.serverField.value)) {
									this.errorMessage = 'All fields are necessary';
									return;
								}
								this.errorMessage = '';
								const result = await login.login({
									user: this.usernameField.value,
									pass: this.passwordField.value,
									server: this.serverField.value.replace(/([^\/])\/[^\/].+/, '$1')
								});
								if (result !== true) {
									this.errorMessage = result;
								}
							}}
						/>
						<DefaultButton
							onClick={() => {
								login.noServerMode();
							}}
							style={{ position: 'absolute', bottom: '10px', left: '10px' }}
						>
							no-server mode
						</DefaultButton>
					</div>
				) : (
					''
				)}
				{this.errorMessage ? (
					<MessageBar messageBarType={MessageBarType.error}>{this.errorMessage}</MessageBar>
				) : (
					''
				)}
			</div>
		);
	}
}
