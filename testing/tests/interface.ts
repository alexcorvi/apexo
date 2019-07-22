export type TestResult = Promise<void | string>;
export type Test = () => TestResult;

export interface TestSuite {
	[key: string]: () => TestResult;
}

export interface Index {
	[key: string]: {
		[key: string]: {
			[key: string]: Test;
		};
	};
}
