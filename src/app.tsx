import './index.html';
import 'antd/lib/grid/style/css';
import './style.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import { API, components } from './core';

import { Fabric } from 'office-ui-fabric-react';

initializeIcons('./fonts/');

ReactDOM.render(
	<Fabric>
		<components.MainComponent />
	</Fabric>,
	document.getElementById('root')
);
