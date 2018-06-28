import { computed, observable } from 'mobx';

import { API } from '../';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import { MenuItem } from './interface.item';

class MenuData {
	/**
	 * Menu Items
	 * 
	 * @type {MenuItem[]}
	 * @memberof MenuData
	 */
	@observable
	items: MenuItem[] = [
		{
			icon: 'Home',
			name: 'Home',
			order: -99,
			key: 'Home',
			url: '',
			onClick: () => {
				API.router.go([ '' ]);
			}
		}
	];
	/**
	 * Menu visible or not
	 * 
	 * @type {boolean}
	 * @memberof MenuData
	 */
	@observable visible: boolean = false;

	/**
	 * sorted items by "order" property
	 * 
	 * @readonly
	 * @memberof MenuData
	 */
	@computed
	get sortedItems() {
		return this.items
			.slice()
			.sort((a, b) => a.order - b.order)
			.filter((item) => !item.condition || item.condition());
	}

	@computed
	get currentIndex() {
		return this.sortedItems.findIndex((x) => x.name === API.router.currentNamespace);
	}

	/**
	 * hide menu
	 * 
	 * @memberof MenuData
	 */
	hide() {
		this.visible = false;
	}

	/**
	 * show menu
	 * 
	 * @memberof MenuData
	 */
	show() {
		this.visible = true;
	}
}

export const menu = new MenuData();
