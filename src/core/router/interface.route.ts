export interface Route {
	/**
	 * A regular expression to be matched against the current location
	 * 
	 * @type {RegExp}
	 * @memberof Route
	 */
	regex: RegExp;
	component: React.ComponentClass<any>;
	namespace: string;
	condition?: () => boolean;
}
