export interface Chart {
	Component: React.ComponentClass<{}>;
	name: string;
	description: string;
	tags: string;
	className?: string;
}
