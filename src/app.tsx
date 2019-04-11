import "./index.html";
import "./style.scss";
import { initializeIcons as initializeIconsA } from "@core";
import { MainView, MessagesView, ModalsView } from "@main-components";
import { Fabric } from "office-ui-fabric-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
initializeIconsA("./fonts/");

ReactDOM.render(
	<Fabric>
		<MainView />
		<MessagesView />
		<ModalsView />
		<p className="version-num">version 3.2.1 </p>
	</Fabric>,
	document.getElementById("root")
);
