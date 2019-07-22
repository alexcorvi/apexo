import { destroyLocal, hardReset, initializeIcons as initializeIconsA, reset } from "@core";
import * as core from "@core";
import { MainView } from "@main-components";
import * as modules from "@modules";
import { store } from "@utils";
import { observer } from "mobx-react";
import { Fabric } from "office-ui-fabric-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
initializeIconsA("./fonts/");

const App = observer(() => (
	<Fabric>
		<MainView
			currencySymbol={modules.setting.getSetting("currencySymbol")}
			dateFormat={modules.setting.getSetting("date_format")}
			prescriptionsEnabled={
				!!modules.setting.getSetting("module_prescriptions")
			}
			timeTrackingEnabled={!!modules.setting.getSetting("time_tracking")}
			currentUser={core.user.currentUser || new modules.StaffMember()}
			isCurrentlyReSyncing={core.router.isCurrentlyReSyncing}
			step={core.status.step}
			currentNamespace={core.router.currentNamespace}
			isOnline={core.status.isOnline}
			userTodayAppointments={core.user.todayAppointments}
			userPanelVisible={core.user.isVisible}
			menuVisible={core.menu.isVisible}
			availableTreatments={modules.treatments.list}
			availablePrescriptions={modules.prescriptions.list}
			operatingStaff={modules.staff.operatingStaff}
			allStaff={modules.staff.list}
			sortedMenuItems={core.menu.sortedItems}
			activeModals={core.modals.activeModals}
			activeMessages={core.messages.activeMessages}
			tryOffline={core.status.tryOffline}
			currentLoader={() => core.router.currentLoader()}
			currentComponent={() => core.router.currentComponent()}
			showMenu={() => core.menu.show()}
			showUser={() => core.user.show()}
			resync={() => core.resync.resync()}
			onStartReSyncing={() => (core.router.isCurrentlyReSyncing = true)}
			onFinishReSyncing={() => (core.router.isCurrentlyReSyncing = false)}
			hideUserPanel={() => core.user.hide()}
			hideMenu={() => core.menu.hide()}
			logout={() => core.status.logout()}
			resetUser={() => core.status.resetUser()}
			setUser={(id: string) => core.status.setUser(id)}
			appointmentsForDay={(a, b, c) =>
				modules.appointments.appointmentsForDay(a, b, c)
			}
			newMessage={message => core.messages.newMessage(message)}
			newModal={modal => core.modals.newModal(modal)}
			deleteModal={index => core.modals.deleteModal(index)}
			initialCheck={server => core.status.initialCheck(server)}
			loginWithCredentials={x => core.status.loginWithCredentials(x)}
			loginWithCredentialsOffline={x =>
				core.status.loginWithCredentialsOffline(x)
			}
			startNoServer={() => core.status.startNoServer()}
			addStaffMember={member => modules.staff.list.push(member)}
			doDeleteAppointment={(id: string) =>
				modules.appointments.deleteByID(id)
			}
			allAppointments={modules.appointments.list}
		/>
	</Fabric>
));

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<App />, document.getElementById("root"));

(window as any).resetApp = () => {
	return new Promise(async resolve => {
		ReactDOM.unmountComponentAtNode(document.getElementById("root")!);
		await reset.reset();
		core.status.step = core.LoginStep.initial;
		store.clear();
		ReactDOM.render(<App />, document.getElementById("root"), resolve);
	});
};

(window as any).hardResetApp = () => {
	return new Promise(async resolve => {
		ReactDOM.unmountComponentAtNode(document.getElementById("root")!);
		await hardReset.hardReset();
		core.status.step = core.LoginStep.initial;
		store.clear();
		ReactDOM.render(<App />, document.getElementById("root"), resolve);
	});
};
