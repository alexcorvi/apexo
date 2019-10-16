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
	@observable scrollPosition = 0;

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
		const oldNamespace = this.currentNamespace;
		location.hash = "#!/" + routes.join("/").replace(/\/\//g, "/");
		setTimeout(() => {
			if (oldNamespace !== this.currentNamespace) {
				scrollTo(0, 0);
			}
		}, 50);
	}

	private filterOutCategory(input: string[], category: string) {
		return input.filter(x => !x.startsWith(category + ":"));
	}

	select({
		id,
		tab,
		sub,
		main
	}: {
		id?: string;
		tab?: string;
		sub?: string;
		main?: "user" | "menu" | "";
	}) {
		let newLocation: string[] = this.currentLocation.split("/");
		if (typeof id === "string") {
			newLocation = this.filterOutCategory(newLocation, "id");
			if (id.length) {
				newLocation.push(`id:${id}`);
			}
		}
		if (typeof tab === "string") {
			newLocation = this.filterOutCategory(newLocation, "tab");
			if (tab.length) {
				newLocation.push(`tab:${tab}`);
			}
		}
		if (typeof sub === "string") {
			newLocation = this.filterOutCategory(newLocation, "sub");
			if (sub.length) {
				newLocation.push(`sub:${sub}`);
			}
		}
		if (typeof main === "string") {
			newLocation = this.filterOutCategory(newLocation, "main");
			if (main.length) {
				newLocation.push(`main:${main}`);
			}
		}

		this.go(newLocation);
	}

	unSelect() {
		this.select({
			id: "",
			tab: "",
			main: "",
			sub: ""
		});
	}

	unSelectSub() {
		this.select({ sub: "" });
	}

	unSelectMain() {
		this.select({ main: "" });
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
		this.scrollPosition = document.getElementsByTagName(
			"html"
		)[0].scrollTop;

		addEventListener("resize", () => (this.innerWidth = innerWidth));
		addEventListener("scroll", () => {
			this.scrollPosition = document.getElementsByTagName(
				"html"
			)[0].scrollTop;
		});
	}
}

export const router = new Router();
