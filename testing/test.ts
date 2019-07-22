import tests from "./tests";
import { app } from "./utils";

interface Results {
	[key: string]: boolean | string;
}

const results: Results = {};

async function run() {
	const testFunctions: Array<{
		id: string;
		test: () => Promise<void>;
	}> = [];

	Object.keys(tests).forEach(async groupName => {
		Object.keys(tests[groupName]).forEach(async suitName => {
			Object.keys(tests[groupName][suitName]).forEach(async testName => {
				const id = `${groupName} > ${suitName} > ${testName}`;
				const test = tests[groupName][suitName][testName];
				testFunctions.push({
					id,
					test: async () => {
						await app.reset();
						console.log(`🧪 Running: ${id}`);
						let testReturnValue: string | undefined = undefined;
						try {
							await test();
						} catch (e) {
							testReturnValue = e.toString();
						}
						const result =
							testReturnValue === undefined
								? "✅"
								: "❌ " + testReturnValue;
						results[id] = result;
						console.log(`🧪 Finished: ${id}: ${result}`);
						await app.reset();
					}
				});
			});
		});
	});

	await Promise.all(testFunctions.map(x => x.test()));

	console.log(results);
}

run();
