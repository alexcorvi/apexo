export interface Route {
	regex: RegExp;
	component: React.ComponentClass<any>;
	namespace: string;
	condition?: () => boolean;
}
