import { IClassStatic } from './interface.class-static';

export interface DocumentDesign {
	_id: string;
	_rev?: string;
	filters: {
		[key: string]: string;
	};
}
