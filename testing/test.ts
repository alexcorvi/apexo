import tests from "./tests";
import { app, test } from "./tests/utils";

interface Results {
	[key: string]: boolean | string;
}

const results: Results = {};

async function run() {
	let testFunctions: Array<{
		id: string;
		test: () => Promise<void>;
	}> = [];

	Object.keys(tests).forEach(async groupName => {
		Object.keys(tests[groupName]).forEach(async suitName => {
			Object.keys(tests[groupName][suitName]).forEach(async testName => {
				const id = `${groupName} > ${suitName} > ${testName}`;
				const testFunc = tests[groupName][suitName][testName];
				testFunctions.push({
					id,
					test: async () => {
						await app.reset();
						console.log(`🧪 Running: ${id}`);
						let testReturnValue: string | undefined = undefined;
						try {
							await testFunc();
						} catch (e) {
							testReturnValue = JSON.stringify(e);
							await test.onFailCallback();
						}
						const result =
							testReturnValue === undefined
								? "✅"
								: "❌ " + testReturnValue;
						results[id] = result;
						console.log(`🧪 Finished: ${id}: ${result}`);
					}
				});
			});
		});
	});

	if (testFunctions.find(x => x.id.indexOf("__") !== -1)) {
		testFunctions = testFunctions.filter(x => x.id.indexOf("__") !== -1);
	}

	for (let i = 0; i < testFunctions.length; i++) {
		await testFunctions[i].test();
	}

	console.log("🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪");

	Object.keys(results).forEach(id => {
		console.log("🧪", id, results[id]);
	});

	console.log("🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪");
}

run();
