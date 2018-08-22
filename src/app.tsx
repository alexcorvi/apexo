import './index.html';
import './style.scss';
import 'antd/lib/grid/style/index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import { API, components } from './core';

import { Fabric } from 'office-ui-fabric-react';

initializeIcons();

ReactDOM.render(
	<Fabric>
		<components.MainComponent />
	</Fabric>,
	document.getElementById('root')
);
