export interface TestSuite {
	[key: string]: () => Promise<true | string>;
}
