import { menu, resync } from "@core";
import { HomeView } from "@main-components";
import { computed, observable } from "mobx";
import * as React from "react";

export interface Route {
	regex: RegExp;
	component: () => Promise<React.ReactElement<any>>;
	namespace: string;
	condition?: () => boolean;
}

class Router {
	@observable reSyncing = false;

	@observable currentLocation = "";

	@observable innerWidth = 0;

	@observable directory: Route[] = [];

	@computed get currentRoute(): Route {
		return (
			this.directory.find(route => {
				return (
					(!route.condition || route.condition()) &&
					route.regex.test(this.currentLocation)
				);
			}) || {
				component: async () => <HomeView />,
				namespace: "Home",
				regex: /a/
			}
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

	async currentLoader() {
		const namespace = this.currentLocation.split("/")[0];
		this.reSyncing = true;
		try {
			const resyncModule = resync.modules.find(
				x => x.namespace === namespace
			);
			if (resyncModule) {
				await resyncModule.resync();
			}
		} catch (e) {
			console.log(e);
		}
		this.reSyncing = false;
		return true;
	}

	register({ regex, component, namespace, condition }: Route) {
		if (this.directory.find(x => x.namespace === namespace)) {
			console.log(namespace, "route name already registered, skipping");
			return;
		}
		this.directory.push({
			regex: regex,
			component: component,
			namespace: namespace,
			condition
		});
	}

	go(routes: string[]) {
		location.hash = "#!/" + routes.join("/");
		scrollTo(0, 0);
		menu.hide();
	}

	history(location: number) {
		history.go(location);
	}

	private async checkAndLoad() {
		const newLocation = location.hash.substr(3);
		if (newLocation !== this.currentLocation) {
			this.currentLocation = location.hash.substr(3);
		}
	}

	constructor() {
		setTimeout(() => this.checkAndLoad(), 300);

		onhashchange = () => {
			this.checkAndLoad();
		};

		this.innerWidth = innerWidth;
		addEventListener("resize", () => (this.innerWidth = innerWidth));
	}
}

export const router = new Router();
