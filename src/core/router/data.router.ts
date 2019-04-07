import "./home.scss";

import { computed, observable } from "mobx";

import { API } from "../";
import { Home } from "./home";
import { Route } from "./interface.route";
import { resync } from "../db";

class Router {
	@observable reSyncing = false;

	@observable currentLocation = "";

	@observable innerWidth = 0;

	@computed get currentRoute() {
		return (
			this.directory.find(route => {
				return (
					(!route.condition || route.condition()) &&
					route.regex.test(this.currentLocation)
				);
			}) || { component: Home, namespace: "Home" }
		);
	}

	@computed
	get currentComponent() {
		return this.currentRoute.component;
	}

	@computed
	get currentNamespace() {
		return this.currentRoute.namespace;
	}

	directory: Route[] = [];

	register(
		name: string,
		regex: RegExp,
		component: React.ComponentClass<any>,
		condition?: () => boolean
	) {
		if (this.directory.find(x => x.namespace === name)) {
			console.log(name, "route name already registered, skipping");
			return;
		}
		this.directory.push({
			regex: regex,
			component: component,
			namespace: name,
			condition
		});
	}

	go(routes: string[]) {
		location.hash = "#!/" + routes.join("/");
		scrollTo(0, 0);
		API.menu.hide();
	}

	history(location: number) {
		history.go(location);
	}

	constructor() {
		setInterval(async () => {
			const newLocation = location.hash.substr(3);
			if (newLocation !== this.currentLocation) {
				this.currentLocation = location.hash.substr(3);
				const namespace = this.currentLocation.split("/")[0];
				this.reSyncing = true;
				try {
					const resyncModule = resync.modules.find(
						x => x.namespace === namespace
					);
					if (resyncModule) {
						resyncModule.resync();
					}
				} catch (e) {
					console.log(e);
				}
				this.reSyncing = false;
			}
		}, 20);

		this.innerWidth = innerWidth;
		addEventListener("resize", () => (this.innerWidth = innerWidth));
	}
}

export const router = new Router();
