import './index.html';
import './style.scss';
import 'antd/lib/grid/style/index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { API, components } from './core';
import { Fabric } from 'office-ui-fabric-react';

// generated from https://uifabricicons.azurewebsites.net/
// 1. Download the subset
// 2. put the font file in the dist/application/fonts/
// 3. put the contents of src dir in './core/icons-subset/'
import { initializeIcons } from './core/icons-subset';
initializeIcons('./fonts/');

ReactDOM.render(
	<Fabric>
		<components.MainComponent />
		<p
			style={{
				fontSize: '12px',
				position: 'absolute',
				color: '#e3e3e3',
				bottom: '5px',
				right: '12px',
				zIndex: -1
			}}
		>
			{' '}
			version 1.3.0{' '}
		</p>
	</Fabric>,
	document.getElementById('root')
);
