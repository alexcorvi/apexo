import { loginService, status, text } from "@core";
import * as core from "@core";
import { second, store } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Link, PivotItem } from "office-ui-fabric-react";
import * as React from "react";
import {
	DefaultButton,
	MessageBar,
	MessageBarType,
	PrimaryButton,
	Spinner,
	SpinnerSize,
	TextField,
	Pivot,
	Icon,
} from "office-ui-fabric-react";

@observer
export class LoginView extends React.Component {
	@observable usernameFieldValue = "";
	@observable passwordFieldValue = "";
	@observable serverFieldValue =
		((window as any).couchDBServer as string) ||
		store.get("server_location") ||
		location.origin.replace(/:\d+$/g, ":5984");

	@observable errorMessage: string = "";
	@observable disableInputs: boolean = false;

	@observable initiallyChecked: boolean = false;

	@observable formType: "s" | "c" = "s";

	componentDidMount() {
		core.status
			.initialCheck(this.serverFieldValue)
			.finally(() => (this.initiallyChecked = true));
	}

	async login() {
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
		this.disableInputs = true;
		try {
			const result = await loginService().login(
				this.usernameFieldValue,
				this.passwordFieldValue,
				this.serverFieldValue
			);
			if (result !== true) {
				this.errorMessage = result;
			}
		} catch (error) {
			this.errorMessage = "Error occurred while trying to login";
		}
		this.disableInputs = false;
	}

	loginSupported() {
		store.set("version", "supported");
		core.status.version = "supported";
		this.serverFieldValue = "https://sdb.apexo.app";
		store.set("server_location", this.serverFieldValue);
		this.login();
	}

	loginCommunity() {
		store.set("version", "community");
		core.status.version = "community";
		store.set("server_location", this.serverFieldValue);
		this.login();
	}

	loginOffline() {
		store.set("version", "offline");
		core.status.version = "offline";
		this.usernameFieldValue = "any";
		this.passwordFieldValue = "any";
		this.serverFieldValue = "http://cypress";
		store.set("server_location", this.serverFieldValue);
		this.login();
	}

	render() {
		return (
			<div className="login-component">
				{this.initiallyChecked ? (
					<Pivot
						selectedKey={this.formType}
						onLinkClick={(item) => {
							if (item && item.props.itemKey) {
								this.formType = item.props.itemKey as "c" | "s";
							}
							this.errorMessage = "";
						}}
					>
						<PivotItem
							headerText={"Supported"}
							itemIcon={"Medical"}
							itemKey={"s"}
							key={"s"}
						>
							<form className="supported-login-forum">
								<TextField
									label="Username"
									disabled={this.disableInputs}
									value={this.usernameFieldValue}
									onChange={(e, v) =>
										(this.usernameFieldValue = v!)
									}
									data-testid="input-identification"
									onKeyDown={(ev) => {
										if (ev.keyCode === 13) {
											this.loginSupported();
										}
									}}
								/>
								<TextField
									name="password"
									type="Password"
									label={text(`password`).c}
									disabled={this.disableInputs}
									value={this.passwordFieldValue}
									onChange={(e, v) =>
										(this.passwordFieldValue = v!)
									}
									data-testid="input-password"
									onKeyDown={(ev) => {
										if (ev.keyCode === 13) {
											this.loginSupported();
										}
									}}
								/>
								<PrimaryButton
									iconProps={{
										iconName: "Permissions",
									}}
									text={text("login").c}
									disabled={this.disableInputs}
									className="m-t-15 m-b-15"
									data-testid="proceed-primary"
									onClick={() => {
										this.loginSupported();
									}}
								/>
							</form>
						</PivotItem>
						<PivotItem
							headerText={"Community"}
							itemIcon={"Database"}
							itemKey={"c"}
							key={"c"}
						>
							<form className="community-login-forum">
								<div className="login-step">
									<div
										className={
											status.isOnline.server ||
											!store.found("LSL_hash")
												? "hidden"
												: "offline-msg"
										}
									>
										<MessageBar
											messageBarType={
												MessageBarType.warning
											}
										>
											{`${text(
												`you're offline. use the latest username/password you've successfully used on this machine to login to this server`
											)}:
								${(this.serverFieldValue || "").replace(/([^\/])\/[^\/].+/, "$1")}.
							`}
										</MessageBar>
									</div>

									<div>
										<TextField
											name="server"
											label={text(`server location`).c}
											value={this.serverFieldValue}
											disabled={this.disableInputs}
											onChange={(ev, v) =>
												(this.serverFieldValue = v!)
											}
											className="input-server"
										/>
									</div>

									<TextField
										name="identification"
										label={text(`username`).c}
										disabled={this.disableInputs}
										value={this.usernameFieldValue}
										onChange={(e, v) =>
											(this.usernameFieldValue = v!)
										}
										data-testid="input-identification"
										onKeyDown={(ev) => {
											if (ev.keyCode === 13) {
												this.loginCommunity();
											}
										}}
									/>
									<TextField
										name="password"
										type="Password"
										label={text(`password`).c}
										disabled={this.disableInputs}
										value={this.passwordFieldValue}
										onChange={(e, v) =>
											(this.passwordFieldValue = v!)
										}
										data-testid="input-password"
										onKeyDown={(ev) => {
											if (ev.keyCode === 13) {
												this.loginCommunity();
											}
										}}
									/>
									<PrimaryButton
										iconProps={{
											iconName: "Permissions",
										}}
										text={text("login").c}
										disabled={this.disableInputs}
										className="m-t-15 m-b-15"
										data-testid="proceed-primary"
										onClick={() => {
											this.loginCommunity();
										}}
									/>
								</div>
							</form>
						</PivotItem>
						<PivotItem
							headerText={"Offline"}
							itemIcon={"WifiWarning4"}
							itemKey={"o"}
							key={"o"}
						>
							<div className="offline-login-form">
								<MessageBar
									messageBarType={MessageBarType.warning}
								>
									When using the application in offline mode
									all data is susceptible to loss, as it would
									only live in your browser/computer. It won't
									sync with other devices, and many features
									of the application will be disabled.
								</MessageBar>
								<div>
									<PrimaryButton
										iconProps={{ iconName: "WifiWarning4" }}
										onClick={() => {
											this.loginOffline();
										}}
									>
										Use offline
									</PrimaryButton>
								</div>
							</div>
						</PivotItem>
					</Pivot>
				) : (
					<div className="spinner-container">
						<Spinner
							size={SpinnerSize.large}
							label={
								core.status.initialLoadingIndicatorText
									? `Please wait: ${core.status.initialLoadingIndicatorText}`
									: "Please wait"
							}
						/>
					</div>
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
				{(window as any).Cypress ? (
					<DefaultButton
						text="cypress-test"
						className="no-server-mode m-t-15 m-b-15 m-r-5"
						onClick={() => {
							core.status.startNoServer();
						}}
						iconProps={{
							iconName: "StatusErrorFull",
						}}
					/>
				) : (
					""
				)}
			</div>
		);
	}
}
