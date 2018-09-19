import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { API } from '../';
import { components } from '../';
import {
	MessageBar,
	PrimaryButton,
	Spinner,
	SpinnerSize
	} from 'office-ui-fabric-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './main.scss';

@observer
export class ErrorBoundary extends React.Component<{}> {
	@observable hasError: boolean = false;
	@observable stackTrace: string = '';

	componentDidCatch(error: any, info: { componentStack: string }) {
		this.hasError = true;
		this.stackTrace = error.stack;
		console.log(error, error.stack, error.toString(), JSON.stringify(error), error.message, info);
	}

	render() {
		if (this.hasError) {
			// You can render any custom fallback UI
			return (
				<MessageBar className="eb" messageBarType={1}>
					Error occured<br /> send a screenshot of the following details
					<textarea defaultValue={this.stackTrace} />
					<PrimaryButton
						onClick={() => {
							location.href = location.href.split('#')[0];
							location.reload();
						}}
					>
						Reload
					</PrimaryButton>
				</MessageBar>
			);
		}
		return this.props.children;
	}
}

@observer
export class MainComponent extends React.Component<{}, {}> {
	componentDidCatch() {
		console.log('Error');
	}

	render() {
		if (API.login.step === API.LoginStep.allDone) {
			return (
				<ErrorBoundary>
					<div className="main-component">
						<components.RouterComponent />
						<components.HeaderComponent />
						<components.MenuComponent />
						<components.PromptsComponent />
						<components.ModalsComponent />
					</div>
				</ErrorBoundary>
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
