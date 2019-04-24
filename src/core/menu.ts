import { router } from "@core";
import { computed, observable } from "mobx";

export interface MenuItem {
	name: string;
	key: string;
	url: string;
	icon: string;
	onClick: () => void;
	order: number;
	condition?: () => boolean;
}

export class Menu {
	@observable
	items: MenuItem[] = [
		{
			icon: "Home",
			name: "Home",
			order: -999,
			key: "Home",
			url: "",
			onClick: () => {
				router.go([""]);
			}
		}
	];

	@observable isVisible: boolean = false;

	@computed
	get sortedItems() {
		return this.items
			.slice()
			.reduce((arr: MenuItem[], item) => {
				if (arr.findIndex(x => x.key === item.key) === -1) {
					arr.push(item);
				}
				return arr;
			}, [])
			.sort((a, b) => a.order - b.order)
			.filter(item => !item.condition || item.condition());
	}

	hide() {
		this.isVisible = false;
	}

	show() {
		this.isVisible = true;
	}
}

export const menu = new Menu();
