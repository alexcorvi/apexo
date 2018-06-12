import './login.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MessageBar, MessageBarType, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { API } from '../';
import { login } from './data.login';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class LoginComponent extends React.Component<{}, {}> {
	usernameField: TextField | undefined;
	passwordField: TextField | undefined;
	serverField: TextField | undefined;
	@observable errorMessage: string = '';
	@observable disableInputs: boolean = false;
	@observable step: number = 1;
	render() {
		return (
			<div className="container m-t-50" style={{ maxWidth: '400px' }}>
				<div className="login-step">
					<TextField
						name="server"
						label="CouchDB Server location"
						ref={(el) => (el ? (this.serverField = el) : '')}
						disabled={this.disableInputs}
						defaultValue={
							/* location.origin.replace(/:\d+$/g, ':5984') */ 'http://46.101.172.26:5984/asd/_all_docs'
						}
					/>
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
}
