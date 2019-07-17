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
	@observable isCurrentlyReSyncing = false;

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
				component: async () => (
					<HomeView
						currentUsername={
							(core.user.currentUser || { name: "" }).name
						}
						todayAppointments={
							modules.appointments.todayAppointments
						}
						tomorrowAppointments={
							modules.appointments.tomorrowAppointments
						}
						dateFormat={modules.setting.getSetting("date_format")}
						selectedAppointmentsByDay={
							modules.statistics.selectedAppointmentsByDay
						}
						showChart={
							!!modules.setting.getSetting("module_statistics")
						}
						allAppointments={modules.appointments.list}
						doDeleteAppointment={(id: string) =>
							modules.appointments.deleteByID(id)
						}
						availableTreatments={modules.treatments.list}
						availablePrescriptions={modules.prescriptions.list}
						appointmentsForDay={(...args) =>
							modules.appointments.appointmentsForDay(...args)
						}
						prescriptionsEnabled={
							!!modules.setting.getSetting("module_prescriptions")
						}
						timeTrackingEnabled={
							!!modules.setting.getSetting("time_tracking")
						}
						operatingStaff={modules.staff.operatingStaff}
						currentUser={
							core.user.currentUser || new modules.StaffMember()
						}
						currencySymbol={modules.setting.getSetting(
							"currencySymbol"
						)}
					/>
				),
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
		this.isCurrentlyReSyncing = true;
		try {
			const resyncModule = core.resync.modules.find(
				x => x.namespace === namespace
			);
			if (resyncModule) {
				await resyncModule.resync();
			}
		} catch (e) {
			console.log(e);
		}
		this.isCurrentlyReSyncing = false;
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
		core.menu.hide();
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
