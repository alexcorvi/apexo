import { PageLoader } from "@common-components";
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
import { MessageBar, PrimaryButton, Shimmer, Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";

const MenuView = loadable({
	loader: async () => (await import("./menu")).MenuView,
	loading: () => <Shimmer />
});

const HeaderView = loadable({
	loader: async () => (await import("./header")).HeaderView,
	loading: () => <Shimmer />
});

const UserPanelView = loadable({
	loader: async () => (await import("./user")).UserPanelView,
	loading: () => <Shimmer />
});

const ChooseUserComponent = loadable({
	loader: async () => (await import("./choose-user")).ChooseUserComponent,
	loading: () => <Shimmer />
});

const LoginView = loadable({
	loader: async () => (await import("./login")).LoginView,
	loading: () => <Shimmer />
});

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
					<div key="router" id="router-outlet">
						<PageLoader
							key={router.currentNamespace}
							pageComponent={async () => {
								await router.currentLoader();
								return await router.currentComponent();
							}}
						/>
					</div>
					<HeaderView
						onExpandMenu={() => {
							menu.show();
						}}
						onExpandUser={() => user.show()}
						currentNamespace={router.currentNamespace}
						isOnline={status.online}
						resync={() => resync.resync()}
						onStartReSyncing={() => (router.reSyncing = true)}
						onFinishReSyncing={() => (router.reSyncing = false)}
						isCurrentlyReSyncing={router.reSyncing}
					/>
					<UserPanelView
						staffName={(user.currentUser || { name: "" }).name}
						todayAppointments={user.todayAppointments}
						isOpen={user.visible}
						onDismiss={() => user.hide()}
						onLogout={() => status.logout()}
						onResetUser={() => status.resetUser()}
						key="user"
					/>
					<MenuView
						items={menu.sortedItems}
						isVisible={menu.visible}
						currentName={router.currentNamespace}
						onDismiss={() => (menu.visible = false)}
						key="menu"
					/>
				</div>
			);
		} else if (status.step === LoginStep.chooseUser) {
			return (
				<ChooseUserComponent
					users={staff.list}
					onChoosing={id => status.setUser(id)}
					onCreatingNew={name => {
						const newStaffMember = new StaffMember();
						newStaffMember.name = name;
						status.setUser(newStaffMember._id);
					}}
					showMessage={obj => messages.newMessage(obj)}
					showModal={obj => modals.newModal(obj)}
				/>
			);
		} else if (status.step === LoginStep.initial) {
			return (
				<LoginView
					tryOffline={status.tryOffline}
					initialCheck={server => status.initialCheck(server)}
					loginWithCredentials={obj =>
						status.loginWithCredentials(obj)
					}
					loginWithCredentialsOffline={obj =>
						status.loginWithCredentialsOffline(obj)
					}
					startNoServer={() => status.startNoServer()}
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
						onDismiss={index => modals.deleteModal(index)}
					/>
					<MessagesView messages={messages.list} />
				</div>
				{this.conditionalView}
			</ErrorBoundaryView>
		);
	}
}
