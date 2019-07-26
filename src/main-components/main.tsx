import { PageLoader } from "@common-components";
import { LoginStep, MenuItem, MessageInterface, ModalInterface, text } from "@core";
import { MessagesView, ModalsView } from "@main-components";
import { Appointment, PrescriptionItem, StaffMember } from "@modules";
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
export class MainView extends React.Component<{
	currentUser: StaffMember;
	step: LoginStep;
	currentNamespace: string;
	isOnline: boolean;
	isCurrentlyReSyncing: boolean;
	userTodayAppointments: Appointment[];
	userPanelVisible: boolean;
	menuVisible: boolean;
	dateFormat: string;
	availableTreatments: { _id: string; expenses: number; type: string }[];
	availablePrescriptions: PrescriptionItem[];
	currencySymbol: string;
	prescriptionsEnabled: boolean;
	timeTrackingEnabled: boolean;
	operatingStaff: { _id: string; name: string; onDutyDays: string[] }[];
	allStaff: { _id: string; name: string; pin: string | undefined }[];
	allAppointments: Appointment[];
	sortedMenuItems: MenuItem[];
	activeModals: ModalInterface[];
	activeMessages: MessageInterface[];
	tryOffline: boolean;
	currentLoader: () => Promise<boolean>;
	currentComponent: () => Promise<React.ReactElement<any>>;
	showMenu: () => void;
	showUser: () => void;
	resync: () => Promise<any>;
	onStartReSyncing: () => void;
	onFinishReSyncing: () => void;
	hideUserPanel: () => void;
	hideMenu: () => void;
	logout: () => void;
	resetUser: () => void;
	setUser: (id: string) => void;
	appointmentsForDay: (
		year: number,
		month: number,
		day: number,
		filter?: string | undefined,
		operatorID?: string | undefined
	) => Appointment[];
	newMessage: (message: MessageInterface) => void;
	newModal: (message: ModalInterface) => void;
	addStaffMember: (member: StaffMember) => void;
	deleteModal: (index: number) => void;
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
	doDeleteAppointment(id: string): void;
}> {
	@computed get conditionalView() {
		if (this.props.step === LoginStep.allDone) {
			return (
				<div className="main-component">
					<div
						key="router"
						id="router-outlet"
						data-current-namespace={this.props.currentNamespace.toLowerCase()}
					>
						<PageLoader
							key={this.props.currentNamespace}
							pageComponent={async () => {
								await this.props.currentLoader();
								return await this.props.currentComponent();
							}}
						/>
					</div>
					<HeaderView
						expandMenu={() => {
							this.props.showMenu();
						}}
						expandUser={() => this.props.showUser()}
						currentNamespace={this.props.currentNamespace}
						isOnline={this.props.isOnline}
						resync={() => this.props.resync()}
						startReSyncing={() => this.props.onStartReSyncing()}
						finishReSyncing={() => this.props.onFinishReSyncing()}
						isCurrentlyReSyncing={this.props.isCurrentlyReSyncing}
					/>
					<UserPanelView
						staffName={this.props.currentUser.name}
						todayAppointments={this.props.userTodayAppointments}
						isOpen={this.props.userPanelVisible}
						onDismiss={() => this.props.hideUserPanel()}
						logout={() => this.props.logout()}
						resetUser={() => this.props.resetUser()}
						key="user"
						dateFormat={this.props.dateFormat}
						availableTreatments={this.props.availableTreatments}
						availablePrescriptions={
							this.props.availablePrescriptions
						}
						currentUser={this.props.currentUser}
						appointmentsForDay={(year, month, day) =>
							this.props.appointmentsForDay(year, month, day)
						}
						currencySymbol={this.props.currencySymbol}
						prescriptionsEnabled={this.props.prescriptionsEnabled}
						timeTrackingEnabled={this.props.timeTrackingEnabled}
						operatingStaff={this.props.operatingStaff}
						doDeleteAppointment={id => {
							this.props.doDeleteAppointment(id);
						}}
						allAppointments={this.props.allAppointments}
					/>
					<MenuView
						items={this.props.sortedMenuItems}
						isVisible={this.props.menuVisible}
						currentName={this.props.currentNamespace}
						onDismiss={() => this.props.hideMenu()}
						key="menu"
					/>
				</div>
			);
		} else if (this.props.step === LoginStep.chooseUser) {
			return (
				<ChooseUserComponent
					users={this.props.allStaff}
					onClickUser={id => this.props.setUser(id)}
					onCreatingNew={name => {
						const newStaffMember = new StaffMember();
						newStaffMember.name = name;
						this.props.addStaffMember(newStaffMember);
						this.props.setUser(newStaffMember._id);
					}}
					showMessage={obj => this.props.newMessage(obj)}
					showModal={obj => this.props.newModal(obj)}
				/>
			);
		} else if (this.props.step === LoginStep.initial) {
			return (
				<LoginView
					tryOffline={this.props.tryOffline}
					initialCheck={server => this.props.initialCheck(server)}
					loginWithCredentials={obj =>
						this.props.loginWithCredentials(obj)
					}
					loginWithCredentialsOffline={obj =>
						this.props.loginWithCredentialsOffline(obj)
					}
					startNoServer={() => this.props.startNoServer()}
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
			<ErrorBoundaryView key={this.props.step}>
				<div>
					<ModalsView
						activeModals={this.props.activeModals}
						onDismiss={index => this.props.deleteModal(index)}
					/>
					<MessagesView messages={this.props.activeMessages} />
				</div>
				{this.conditionalView}
			</ErrorBoundaryView>
		);
	}
}
