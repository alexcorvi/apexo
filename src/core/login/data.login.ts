import { computed, observable, observe } from 'mobx';
import axios from 'axios';
import { observer } from 'mobx-react';
import { registerModules } from '../../modules';

import PouchDB from 'pouchdb-browser';
import auth from 'pouchdb-authentication';
import { resync } from '../db';
PouchDB.plugin(auth);

export enum LoginStep {
	loadingData,
	allDone,
	chooseDoctor,
	initial
}

class Login {
	@observable username: string = '';
	@observable password: string = '';
	@observable server: string = '';
	@observable currentDoctorID: string = '';

	@observable step: LoginStep = LoginStep.initial;

	async login({ user, pass, server }: { user: string; pass: string; server: string }): Promise<true | string> {
		try {
			const res = await new PouchDB(server).logIn(user, pass);
			this.username = user;
			this.password = pass;
			this.server = server;
			localStorage.setItem('server_location', server);
			this.step = LoginStep.loadingData;
			await registerModules();
			this.step = LoginStep.chooseDoctor;
			return true;
		} catch (e) {
			return (
				e.reason ||
				'An error occured, please make sure that the server is online and it\'s accessible. Click "change" to change into another server'
			);
		}
	}
}

export const login = new Login();
