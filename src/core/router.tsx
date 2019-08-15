import * as core from "@core";
import { HomeView } from "@main-components";
import * as modules from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

export interface Route {
	regex: RegExp;
	component: () => Promise<React.ReactElement<any>>;
	namespace: string;
	condition?: () => boolean;
}

export class Router {
	@observable private _selectedID = "";
	@observable private _selectedTab = "";

	@observable private _selectedSub = "";

	@observable private _selectedMain = "";

	@computed get selectedID() {
		return this._selectedID;
	}
	@computed get selectedTab() {
		return this._selectedTab;
	}
	@computed get selectedSub() {
		return this._selectedSub;
	}
	@computed get selectedMain() {
		return this._selectedMain;
	}

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
		try {
			// resync on page navigation
			core.dbAction(
				"resync",
				namespace === "staff" ? "doctors" : namespace
			);
		} catch (e) {
			console.log(e);
		}
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
		location.hash = "#!/" + routes.join("/").replace(/\/\//g, "/");
		scrollTo(0, 0);
	}

	selectID(id: string, tab?: string) {
		const newLocation = this.currentLocation
			.split("/")
			.map(x => {
				return x;
			})
			.filter(x => !x.startsWith("id:"));
		newLocation.push(`id:${id}`);
		this.go(newLocation);

		if (tab) {
			setTimeout(() => this.selectTab(tab), 100);
		}
	}
	selectTab(tab?: string) {
		const newLocation = this.currentLocation
			.split("/")
			.map(x => {
				return x;
			})
			.filter(x => !x.startsWith("tab:"));
		if (tab) {
			newLocation.push(`tab:${tab}`);
		}
		this.go(newLocation);
	}

	selectSub(sub?: string) {
		const newLocation = this.currentLocation
			.split("/")
			.map(x => {
				return x;
			})
			.filter(x => !x.startsWith("sub:"));
		if (sub) {
			newLocation.push(`sub:${sub}`);
		}
		this.go(newLocation);
	}

	selectMain(main?: "user" | "menu") {
		const newLocation = this.currentLocation
			.split("/")
			.filter(x => !x.startsWith("main:"));
		if (main) {
			newLocation.push(`main:${main}`);
		}
		this.go(newLocation);
	}

	unSelect() {
		this.go([this.currentNamespace]);
	}

	unSelectSub() {
		this.selectSub();
	}

	unSelectMain() {
		this.selectMain();
	}

	private async checkAndLoad() {
		this.currentLocation = location.hash.substr(3);

		const id = this.currentLocation
			.split("/")
			.find(x => x.startsWith("id:"));

		const tab = this.currentLocation
			.split("/")
			.find(x => x.startsWith("tab:"));

		const sub = this.currentLocation
			.split("/")
			.find(x => x.startsWith("sub:"));

		const main = this.currentLocation
			.split("/")
			.find(x => x.startsWith("main:"));
		if (id) {
			this._selectedID = id.replace(/id:/, "");
		} else {
			this._selectedID = "";
		}
		if (sub) {
			this._selectedSub = sub.replace(/sub:/, "");
		} else {
			this._selectedSub = "";
		}
		if (main) {
			this._selectedMain = main.replace(/main:/, "");
		} else {
			this._selectedMain = "";
		}
		if (tab) {
			this._selectedTab = tab.replace(/tab:/, "");
		} else {
			this._selectedTab = "";
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
