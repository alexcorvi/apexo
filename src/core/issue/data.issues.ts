import { observable, computed } from 'mobx';
import { Issue } from './interface.issue';
import axios from 'axios';
import { login } from '../login/data.login';

// todo: wrap the await request in a try/catch

class IssuesData {
	@observable visible: boolean = false;
	@observable list: Issue[] = [];
	@observable removeTemp: boolean = false;
	constructor() {
		login.onLogin.push(() => this.checkForUpdates());
		setTimeout(() => this.checkForUpdates(), 1000);
		setInterval(() => this.checkForUpdates(), 5 * 60 * 1000 /* check every 5 minutes */);
	}
	async sendIssue(content: string) {
		this.removeTemp = true;
		this.list.push({
			content,
			incoming: false,
			notify: false,
			time: new Date().getTime()
		});
		const sendOp = await login.request<{ ok: number; n: number }>({
			namespace: 'issues',
			subPath: 'send_from_clinic',
			method: 'post',
			data: { content }
		});
	}
	async checkForUpdates() {
		if (navigator.onLine) {
			try {
				const updates = await login.request<{ list: Issue[] }>({
					namespace: 'issues',
					subPath: 'get_updates/' + this.list.length,
					method: 'get'
				});
				if (!updates) {
					return;
				}
				updates.list.forEach((issue) => this.list.push(issue));
				if (updates.list.length && this.removeTemp) {
					// remove placeholders .. if any
					this.removeTemp = false;
					this.list.splice(this.list.length - 1, 1);
				}
			} catch (e) {}
		}
	}
}

export default new IssuesData();
