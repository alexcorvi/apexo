export interface MenuItem {
	name: string;
	key: string;
	url: string;
	icon: string;
	onClick: () => void;
	order: number;
	condition?: () => boolean;
}
