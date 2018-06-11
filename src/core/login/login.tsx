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
	clinicID: TextField;
	clinicPassword: TextField;
	@observable errorMessage: string = '';
	@observable disableInputs: boolean = false;
	@observable step: number = 1;
	render() {
		return (
			<div className="container m-t-50" style={{ maxWidth: '400px' }}>
				<div className="login-step">
					<TextField
						name="identification"
						label="Clinic ID"
						ref={(el) => (el ? (this.clinicID = el) : '')}
						disabled={this.disableInputs}
					/>
					<TextField
						name="password"
						type="Password"
						label="Clinic Password"
						ref={(el) => (el ? (this.clinicPassword = el) : '')}
						disabled={this.disableInputs}
					/>
					<PrimaryButton
						text="login"
						disabled={this.disableInputs}
						className="m-t-15 m-b-15"
						onClick={async () => {
							if (!(this.clinicID.value && this.clinicPassword)) {
								return;
							}
							this.errorMessage = '';
							const result = await login.login({
								u: this.clinicID.value || '',
								p: this.clinicPassword.value || ''
							});
							if (result !== true) {
								this.errorMessage = 'Incorrect clinic ID or password';
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
