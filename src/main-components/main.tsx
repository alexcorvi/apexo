import { AsyncComponent } from "@common-components";
import { LoginStep, router, status, text } from "@core";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { MessageBar, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ErrorBoundaryView extends React.Component<{}> {
	@observable hasError: boolean = false;
	@observable stackTrace: string = "";

	componentDidCatch(error: any, info: { componentStack: string }) {
		this.hasError = true;
		this.stackTrace = error.stack;
		console.log(
			error,
			error.stack,
			error.toString(),
			JSON.stringify(error),
			error.message,
			info
		);
	}

	render() {
		if (this.hasError) {
			return (
				<MessageBar className="eb" messageBarType={1}>
					Error occurred
					<br /> send a screenshot of the following details
					<textarea defaultValue={this.stackTrace} />
					<PrimaryButton
						onClick={() => {
							location.href = location.href.split("#")[0];
							location.reload();
						}}
						text={text("Reload")}
					/>
				</MessageBar>
			);
		}
		return this.props.children;
	}
}

@observer
export class MainView extends React.Component<{}, {}> {
	@computed get view() {
		if (status.step === LoginStep.allDone) {
			return (
				<div className="main-component">
					<AsyncComponent
						key={router.currentNamespace}
						loader={async () => {
							const HeaderView = (await import("./header"))
								.HeaderView;
							const UserPanelView = (await import("./user"))
								.UserPanelView;
							const MenuView = (await import("./menu")).MenuView;
							return (
								<div>
									<div key="router" id="router-outlet">
										<AsyncComponent
											key={router.currentNamespace}
											loader={async () => {
												await router.currentLoader();
												return await router.currentComponent();
											}}
										/>
									</div>
									<HeaderView key="header" />
									<UserPanelView key="user" />
									<MenuView key="menu" />
								</div>
							);
						}}
					/>
				</div>
			);
		} else if (status.step === LoginStep.chooseUser) {
			return (
				<AsyncComponent
					key="choose-user"
					loader={async () => {
						const ChooseUserComponent = (await import("./choose-user"))
							.ChooseUserComponent;
						return <ChooseUserComponent />;
					}}
				/>
			);
		} else if (status.step === LoginStep.initial) {
			return (
				<AsyncComponent
					key="choose-user"
					loader={async () => {
						const LoginView = (await import("./login")).LoginView;
						return <LoginView />;
					}}
				/>
			);
		} else {
			return (
				<div className="spinner-container">
					<Spinner
						size={SpinnerSize.large}
						label={text(`Please wait`)}
					/>
				</div>
			);
		}
	}

	componentDidCatch() {
		console.log("Error");
	}

	componentDidMount() {
		setInterval(() => {
			if (document.querySelectorAll(".ms-Panel").length) {
				document.querySelectorAll("html")[0].classList.add("has-panel");
			} else {
				document
					.querySelectorAll("html")[0]
					.classList.remove("has-panel");
			}
		}, 100);
	}

	render() {
		return (
			<ErrorBoundaryView key={status.step}>{this.view}</ErrorBoundaryView>
		);
	}
}
