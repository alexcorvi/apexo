import './index.html';
import './style.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { API, components } from './core';
import { Fabric } from 'office-ui-fabric-react';

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
import { initializeIcons as initializeIconsA } from './core/icons-subset/subset-a';
import { initializeIcons as initializeIconsB } from './core/icons-subset/subset-b';
initializeIconsA('./fonts/');
initializeIconsB('./fonts/');

ReactDOM.render(
	<Fabric>
		<components.MainComponent />
		<p className="version-num">version 1.5.2 </p>
	</Fabric>,
	document.getElementById('root')
);
