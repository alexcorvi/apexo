import { InteractionMethods } from './interface.interaction-methods';

/**
 * Interface of a dictionary object of all connected databases
 * 
 * @interface Databases
 */
export interface Databases {
	[key: string]: <T>() => InteractionMethods<T> | undefined;
}

/**
 * @export
 * Dictionary object of all connected databases
 */
export const databases: Databases = {};
