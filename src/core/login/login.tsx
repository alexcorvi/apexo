import './login.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MessageBar, MessageBarType, PrimaryButton, TextField, Label } from 'office-ui-fabric-react';
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

	couchDBDefaultServer: string = localStorage.getItem('server_location') ||
		location.origin.replace(/:\d+$/g, ':5984');

	@observable errorMessage: string = '';
	@observable disableInputs: boolean = false;
	@observable step: number = 1;

	@observable serverLabelColor: LabelType = LabelType.primary;

	@observable editServerLocation: boolean = false;

	render() {
		return (
			<div className="container m-t-50" style={{ maxWidth: '400px' }}>
				<div className="login-step">
					{this.editServerLocation ? (
						''
					) : (
						<Label>
							<LabelC text={this.couchDBDefaultServer} type={LabelType.info} />
							<LabelC
								text={
									this.serverLabelColor === LabelType.danger ? (
										'OFFLINE'
									) : this.serverLabelColor === LabelType.success ? (
										'ONLINE'
									) : (
										'CHECKING'
									)
								}
								type={this.serverLabelColor}
							/>
							<a
								onClick={() => {
									this.editServerLocation = true;
								}}
							>
								change
							</a>
						</Label>
					)}

					<TextField
						name="server"
						label="CouchDB Server location"
						ref={(el) => (el ? (this.serverField = el) : '')}
						disabled={this.disableInputs}
						defaultValue={this.couchDBDefaultServer}
						className={this.editServerLocation ? '' : 'hidden'}
					/>
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
				</div>
				{this.errorMessage ? (
					<MessageBar messageBarType={MessageBarType.error}>{this.errorMessage}</MessageBar>
				) : (
					''
				)}
			</div>
		);
	}

	async componentDidMount() {
		const alive = await checkServer(this.couchDBDefaultServer);
		if (alive) {
			this.serverLabelColor = LabelType.success;
		} else {
			this.serverLabelColor = LabelType.danger;
		}
	}
}
