import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observer } from 'mobx-react';
import { router } from './data.router';

export const RouterComponent = observer(() => (
	<div id="router-outlet">
		<router.currentComponent />
	</div>
));
