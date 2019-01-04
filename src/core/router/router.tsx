import * as React from 'react';

import { observer } from 'mobx-react';
import { router } from './data.router';

export const RouterComponent = observer(() => (
	<div id="router-outlet">
		<router.currentComponent />
	</div>
));
