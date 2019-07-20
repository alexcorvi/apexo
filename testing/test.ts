import tests from "./tests";

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
						const testReturnValue = await test();
						const result =
							testReturnValue === true
								? "✅"
								: "❌ " + testReturnValue;
						results[id] = result;
						console.log(`🧪🧪🧪 ${id}: ${result}`);
					}
				});
			});
		});
	});

	await Promise.all(testFunctions.map(x => x.test()));

	console.log(results);
}

run();
