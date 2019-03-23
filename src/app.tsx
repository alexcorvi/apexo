import * as React from "react";
import * as ReactDOM from "react-dom";
import { components } from "./core";
import { Fabric } from "office-ui-fabric-react";
import { initializeIcons as initializeIconsA } from "./core/icons-subset/subset-a";
import { initializeIcons as initializeIconsB } from "./core/icons-subset/subset-b";
import { initializeIcons as initializeIconsC } from "./core/icons-subset/subset-c";
import { initializeIcons as initializeIconsD } from "./core/icons-subset/subset-d";

import "./index.html";
import "./style.scss";

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
initializeIconsA("./fonts/");
initializeIconsB("./fonts/");
initializeIconsC("./fonts/");
initializeIconsD("./fonts/");

ReactDOM.render(
	<Fabric>
		<components.MainComponent />
		<components.MessagesComponent />
		<components.ModalsComponent />
		<p className="version-num">version 2.2.3 </p>
	</Fabric>,
	document.getElementById("root")
);
