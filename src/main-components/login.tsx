import { status, text } from "@core";
import { second, store } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class LoginView extends React.Component<{
	tryOffline: boolean;
	initialCheck(server: string): Promise<void>;
	loginWithCredentials({
		username,
		password,
		server
	}: {
		username: string;
		password: string;
		server: string;
	}): Promise<boolean | string>;
	loginWithCredentialsOffline({
		username,
		password,
		server
	}: {
		username: string;
		password: string;
		server: string;
	}): Promise<boolean | string>;
	startNoServer(): Promise<void>;
}> {
	@observable usernameFieldValue = "";
	@observable passwordFieldValue = "";
	@observable serverFieldValue =
		(window as any).couchDBServer ||
		store.get("server_location") ||
		location.origin.replace(/:\d+$/g, ":5984");

	@observable errorMessage: string = "";
	@observable disableInputs: boolean = false;
	@observable step: number = 1;

	@observable editServerLocation: boolean = false;

	@observable initiallyChecked: boolean = false;

	@computed get impossibleToLogin() {
		return !status.isClientOnline && !store.found("LSL_hash");
	}

	componentWillMount() {
		this.props
			.initialCheck(this.serverFieldValue)
			.finally(() => (this.initiallyChecked = true));
	}

	async login(offline?: boolean) {
		if (
			!(
				this.usernameFieldValue &&
				this.passwordFieldValue &&
				this.serverFieldValue
			)
		) {
			this.errorMessage = "All fields are necessary";
			return;
		}
		this.errorMessage = "";
		const result = offline
			? await this.props.loginWithCredentialsOffline({
					username: this.usernameFieldValue,
					password: this.passwordFieldValue,
					server: this.serverFieldValue.replace(
						/([^\/])\/[^\/].+/,
						"$1"
					)
			  })
			: await this.props.loginWithCredentials({
					username: this.usernameFieldValue,
					password: this.passwordFieldValue,
					server: this.serverFieldValue.replace(
						/([^\/])\/[^\/].+/,
						"$1"
					)
			  });
		if (typeof result !== "boolean") {
			this.errorMessage = result;
		}
	}

	render() {
		return (
			<div className="login-component">
				{this.impossibleToLogin ? (
					<div data-testid="impossible">
						<MessageBar messageBarType={MessageBarType.error}>
							You're offline and unable to login
							<br />
						</MessageBar>
						<DefaultButton
							text="Reload"
							className="m-t-15 m-b-15 m-r-5"
							onClick={() => {
								location.reload();
							}}
							iconProps={{
								iconName: "Sync"
							}}
						/>
						<DefaultButton
							text="no-server mode"
							className="no-server-mode"
							onClick={() => {
								this.props.startNoServer();
							}}
							iconProps={{
								iconName: "StatusErrorFull"
							}}
						/>
					</div>
				) : (
					<div className="login-forum">
						{this.initiallyChecked ? (
							<div className="login-step">
								<div
									className={
										status.isClientOnline
											? "hidden"
											: "offline-msg"
									}
								>
									<MessageBar
										messageBarType={MessageBarType.warning}
									>
										{`${text(
											`You're offline. Use the latest username/password you've successfully used on this machine to login to this server`
										)}:
								${(this.serverFieldValue || "").replace(/([^\/])\/[^\/].+/, "$1")}.
							`}
									</MessageBar>
								</div>

								<br />
								<hr />

								<div
									className={
										status.isClientOnline ? "" : "hidden"
									}
								>
									<div
										style={{
											display: "inline-block",
											width: "75%"
										}}
									>
										<TextField
											name="server"
											label={text(`Server location`)}
											value={this.serverFieldValue}
											disabled={
												this.disableInputs ||
												!this.editServerLocation
											}
											onChange={(ev, v) =>
												(this.serverFieldValue = v!)
											}
											className="input-server"
										/>
									</div>

									<DefaultButton
										className="edit-server-location"
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
									label={text(`Username`)}
									disabled={this.disableInputs}
									value={this.usernameFieldValue}
									onChange={(e, v) =>
										(this.usernameFieldValue = v!)
									}
									data-testid="input-identification"
									onKeyDown={ev => {
										if (ev.keyCode === 13) {
											this.login();
										}
									}}
								/>
								<TextField
									name="password"
									type="Password"
									label={text(`Password`)}
									disabled={this.disableInputs}
									value={this.passwordFieldValue}
									onChange={(e, v) =>
										(this.passwordFieldValue = v!)
									}
									data-testid="input-password"
									onKeyDown={ev => {
										if (ev.keyCode === 13) {
											this.login();
										}
									}}
								/>
								<PrimaryButton
									iconProps={{
										iconName: "Permissions"
									}}
									text={text("Login")}
									disabled={this.disableInputs}
									className="m-t-15 m-b-15"
									data-testid="proceed-primary"
									onClick={() => {
										this.login();
									}}
								/>
								{this.props.tryOffline ? (
									<PrimaryButton
										text={text("Access offline")}
										disabled={this.disableInputs}
										className="m-t-15 m-b-15 m-l-5 m-r-5"
										data-testid="proceed-offline"
										onClick={() => {
											this.login(true);
										}}
									/>
								) : (
									""
								)}
								<DefaultButton
									onClick={this.props.startNoServer}
									className="no-server-mode"
									iconProps={{
										iconName: "StatusErrorFull"
									}}
								>
									no-server mode
								</DefaultButton>
							</div>
						) : (
							""
						)}
						{this.errorMessage ? (
							<MessageBar
								data-testid="error-msg"
								messageBarType={MessageBarType.error}
							>
								{this.errorMessage}
							</MessageBar>
						) : (
							""
						)}
					</div>
				)}
			</div>
		);
	}
}
