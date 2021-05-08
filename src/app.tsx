import * as core from "@core";
import * as mainComponents from "@main-components";
import * as utils from "@utils";
import { observer } from "mobx-react";
import { Fabric } from "office-ui-fabric-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
// 4. add font file in PWA HTML list

core.initializeIcons("./fonts/");
core.initializeIconsB("./fonts/");

const App = observer(() => (
	<Fabric>
		<mainComponents.MainView />
	</Fabric>
));

ReactDOM.render(<App />, document.getElementById("root"));

(window as any).hardResetApp = () => {
	return new Promise(async (resolve) => {
		ReactDOM.unmountComponentAtNode(document.getElementById("root")!);
		await core.dbAction("destroy");
		core.status.reset();
		utils.store.clear();
		ReactDOM.render(<App />, document.getElementById("root"), resolve);
	});
};

(window as any).resyncApp = async () => await core.dbAction("resync");

(window as any).removeCookies = async () => await core.status.removeCookies();

(window as any).emulateOffline = () => {
	utils.connSetting.emulateOffline = true;
	localStorage.setItem("emulate_offline", "1");
};
(window as any).disableOfflineEmulation = () => {
	utils.connSetting.emulateOffline = false;
	localStorage.removeItem("emulate_offline");
};
