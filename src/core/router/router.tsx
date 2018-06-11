import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observer } from 'mobx-react';
import { router } from './data.router';

export const RouterComponent = observer(() => (
	<div id="router-outlet" style={{ marginTop: 50, paddingBottom: 20 }}>
		<router.currentComponent />
	</div>
));
