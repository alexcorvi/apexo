import './home.scss';

import { computed, observable } from 'mobx';

import { API } from '../';
import { Home } from './home';
import { Route } from './interface.route';

class Router {
	@observable reSyncing = false;

	/**
	 * Current location based on the location.hash
	 * 
	 * @memberof Router
	 */
	@observable currentLocation = '';

	@observable innerWidth = 0;

	/**
	 * Current component based on the registered modules
	 * 
	 * @readonly
	 * @memberof Router
	 */
	@computed
	get currentComponent() {
		return (this.directory.find((route) => {
			return (!route.condition || route.condition()) && route.regex.test(this.currentLocation);
		}) || { component: Home }).component;
	}

	@computed
	get currentNamespace() {
		return (this.directory.find((route) => {
			return route.regex.test(this.currentLocation);
		}) || { namespace: 'Home' }).namespace;
	}

	/**
	 * a list of all the registered routes
	 * 
	 * @type {Route[]}
	 * @memberof Router
	 */
	directory: Route[] = [];

	/**
	 * register a route
	 * 
	 * @param {RegExp} regex 
	 * @param {React.ComponentClass<any>} component 
	 * @memberof Router
	 */
	register(name: string, regex: RegExp, component: React.ComponentClass<any>, condition?: () => boolean) {
		this.directory.push({
			regex: regex,
			component: component,
			namespace: name,
			condition
		});
	}

	/**
	 * Go to a specific location
	 * 
	 * @param {string[]} routes 
	 * @memberof Router
	 */
	go(routes: string[]) {
		location.hash = '#!/' + routes.join('/');
		scrollTo(0, 0);
		API.menu.hide();
	}

	/**
	 * Go back and forth in history
	 * 
	 * @param {number} location 
	 * @memberof Router
	 */
	history(location: number) {
		history.go(location);
	}

	constructor() {
		setInterval(() => {
			const newLocation = location.hash.substr(3);
			if (newLocation !== this.currentLocation) {
				this.currentLocation = location.hash.substr(3);
				// resync this namespace database
				const resyncFunction = API.reSyncFunctions[this.currentNamespace];
				if (resyncFunction) {
					resyncFunction();
				}
			}
		}, 20);

		this.innerWidth = innerWidth;
		addEventListener('resize', () => (this.innerWidth = innerWidth));
	}
}

export const router = new Router();
