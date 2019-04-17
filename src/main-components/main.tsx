import { AsyncComponent } from "@common-components";
import {
	LoginStep,
	menu,
	messages,
	modals,
	resync,
	router,
	status,
	text,
	user
	} from "@core";
import { MessagesView, ModalsView } from "@main-components";
import { staff, StaffMember } from "@modules";
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
	@computed get conditionalView() {
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
									<HeaderView
										onExpandMenu={menu.show}
										onExpandUser={user.show}
										currentNamespace={
											router.currentNamespace
										}
										isOnline={status.online}
										resync={resync.resync}
										onStartReSyncing={() =>
											(router.reSyncing = true)
										}
										onFinishReSyncing={() =>
											(router.reSyncing = false)
										}
										isCurrentlyReSyncing={router.reSyncing}
									/>
									<UserPanelView key="user" />
									<MenuView
										items={menu.items}
										isVisible={menu.visible}
										currentName={router.currentNamespace}
										onDismiss={() => (menu.visible = false)}
										key="menu"
									/>
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
						return (
							<ChooseUserComponent
								users={staff.list}
								onChoosing={id => status.setUser(id)}
								onCreatingNew={name => {
									const newStaffMember = new StaffMember();
									newStaffMember.name = name;
									status.setUser(newStaffMember._id);
								}}
								showMessage={messages.newMessage}
								showModal={modals.newModal}
							/>
						);
					}}
				/>
			);
		} else if (status.step === LoginStep.initial) {
			return (
				<AsyncComponent
					key="choose-user"
					loader={async () => {
						const LoginView = (await import("./login")).LoginView;
						return (
							<LoginView
								tryOffline={status.tryOffline}
								initialCheck={status.initialCheck}
								loginWithCredentials={
									status.loginWithCredentials
								}
								loginWithCredentialsOffline={
									status.loginWithCredentialsOffline
								}
								startNoServer={status.startNoServer}
							/>
						);
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
			<ErrorBoundaryView key={status.step}>
				<div>
					<ModalsView
						activeModals={modals.activeModals}
						onDismiss={modals.deleteModal}
					/>
					<MessagesView messages={messages.list} />
				</div>
				{this.conditionalView}
			</ErrorBoundaryView>
		);
	}
}
