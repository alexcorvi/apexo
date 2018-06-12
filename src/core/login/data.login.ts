import { computed, observable, observe } from 'mobx';
import axios from 'axios';
import { observer } from 'mobx-react';
import { registerModules } from '../../modules';

import PouchDB from 'pouchdb-browser';
import auth from 'pouchdb-authentication';
PouchDB.plugin(auth);

export enum LoginStep {
	allDone,
	chooseDoctor,
	login
}

class Login {
	@observable loggedIn: boolean = false;
	@observable username: string = '';
	@observable password: string = '';
	@observable server: string = '';
	@observable currentDoctorID: string = '';

	@computed
	get step() {
		if (!this.loggedIn) {
			return LoginStep.login;
		} else if (this.loggedIn && !this.currentDoctorID) {
			return LoginStep.chooseDoctor;
		} else {
			return LoginStep.allDone;
		}
	}

	async login({ user, pass, server }: { user: string; pass: string; server: string }): Promise<true | string> {
		try {
			const res = await new PouchDB(server).logIn(user, pass);
			this.username = user;
			this.password = pass;
			this.server = server;
			this.loggedIn = true;
			registerModules();
			return true;
		} catch (e) {
			return (
				e.reason ||
				"An error occured, please make sure that you have entered the right server address and it's accessible"
			);
		}
	}
}

export const login = new Login();
