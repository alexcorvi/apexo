import { status, text } from "@core";
import { store } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class LoginView extends React.Component<{}, {}> {
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
		return !navigator.onLine && !store.found("LSL_hash");
	}

	componentWillMount() {
		status
			.initialCheck(this.serverFieldValue)
			.then(() => (this.initiallyChecked = true));
	}

	render() {
		return (
			<div className="login-component">
				{this.impossibleToLogin ? (
					<div className="impossible">
						<MessageBar messageBarType={MessageBarType.error}>
							You're offline and unable to login
							<br />
						</MessageBar>
						<DefaultButton
							text="Reload"
							className="m-t-15 m-b-15"
							onClick={() => {
								location.reload();
							}}
						/>
					</div>
				) : (
					<div>
						{this.initiallyChecked ? (
							<div className="login-step">
								<div
									className={navigator.onLine ? "hidden" : ""}
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
									className={navigator.onLine ? "" : "hidden"}
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
								/>
								<PrimaryButton
									text={text("Login")}
									disabled={this.disableInputs}
									className="m-t-15 m-b-15"
									onClick={async () => {
										if (
											!(
												this.usernameFieldValue &&
												this.passwordFieldValue &&
												this.serverFieldValue
											)
										) {
											this.errorMessage =
												"All fields are necessary";
											return;
										}
										this.errorMessage = "";
										const result = await status.loginWithCredentials(
											{
												username: this
													.usernameFieldValue,
												password: this
													.passwordFieldValue,
												server: this.serverFieldValue.replace(
													/([^\/])\/[^\/].+/,
													"$1"
												)
											}
										);
										if (
											typeof result !== "boolean" ||
											result !== true
										) {
											this.errorMessage = result;
										}
									}}
								/>
								{status.tryOffline ? (
									<PrimaryButton
										text={text("Access offline")}
										disabled={this.disableInputs}
										className="m-t-15 m-b-15 m-l-5 m-r-5"
										onClick={async () => {
											if (
												!(
													this.usernameFieldValue &&
													this.passwordFieldValue &&
													this.serverFieldValue
												)
											) {
												this.errorMessage =
													"All fields are necessary";
												return;
											}
											this.errorMessage = "";
											const result = await status.loginWithCredentialsOffline(
												{
													username: this
														.usernameFieldValue,
													password: this
														.passwordFieldValue,
													server: this.serverFieldValue.replace(
														/([^\/])\/[^\/].+/,
														"$1"
													)
												}
											);
											if (
												typeof result !== "boolean" ||
												result !== true
											) {
												this.errorMessage = result;
											}
										}}
									/>
								) : (
									""
								)}
								<DefaultButton
									onClick={() => {
										status.startNoServer();
									}}
									className="no-server-mode"
								>
									no-server mode
								</DefaultButton>
							</div>
						) : (
							""
						)}
						{this.errorMessage ? (
							<MessageBar messageBarType={MessageBarType.error}>
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
