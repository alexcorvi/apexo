import { computed, observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { registerModules } from '../../modules';

import PouchDB from 'pouchdb-browser';
import auth from 'pouchdb-authentication';
import { Md5 } from 'ts-md5';
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
		// login
		try {
			if (navigator.onLine) {
				const res = await new PouchDB(server).logIn(user, pass);
			} else {
				const LSL = localStorage.getItem('LSL') || '';
				const LSL_hash = LSL.split('__')[0];
				if (LSL_hash !== Md5.hashStr(user + pass + server)) {
					throw new Error('Incorrect username or password');
				}
			}
		} catch (e) {
			if (navigator.onLine) {
				return (
					e.reason ||
					'An error occured, please make sure that the server is online and it\'s accessible. Click "change" to change into another server'
				);
			} else {
				return 'Incorrect username/password combination';
			}
		}

		this.username = user;
		this.password = pass;
		this.server = server;
		localStorage.setItem('server_location', server);
		localStorage.setItem(
			'LSL',
			Md5.hashStr(this.username + this.password + this.server).toString() + '__' + new Date().getTime()
		);
		this.step = LoginStep.loadingData;
		try {
			await registerModules();
		} catch (e) {}
		this.step = LoginStep.chooseDoctor;
		return true;
	}
}

export const login = new Login();
