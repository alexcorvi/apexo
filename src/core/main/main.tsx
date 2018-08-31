import './main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { API } from '../';
import { components } from '../';
import { observer } from 'mobx-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';

@observer
export class MainComponent extends React.Component<{}, {}> {
	render() {
		if (API.login.step === API.LoginStep.allDone) {
			return (
				<div className="main-component">
					<components.RouterComponent />
					<components.HeaderComponent />
					<components.MenuComponent />
					<components.PromptsComponent />
					<components.ModalsComponent />
				</div>
			);
		} else if (API.login.step === API.LoginStep.chooseDoctor) {
			return <components.ChooseDoctor />;
		} else if (API.login.step === API.LoginStep.initial) {
			return <components.LoginComponent />;
		} else {
			return (
				<div className="spinner-container">
					<Spinner size={SpinnerSize.large} label="Please Wait" />
				</div>
			);
		}
	}
}
